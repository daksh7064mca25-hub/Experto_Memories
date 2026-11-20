# Cloudflare R2 Media Storage Configuration & Runbook

This runbook documents the setup, environment variables, CORS rules, and security policies for Cloudflare R2 object storage in **ExpertoMemories**.

---

## 1. Overview

ExpertoMemories stores user-uploaded media (scrapbook photos, background MP3 songs, video greetings, and custom banners) in **Cloudflare R2** via an S3-compatible API.

- **Zero Egress Fees**: Cloudflare R2 charges zero data egress fees, keeping operating costs predictable.
- **Strict File Upload Validation**:
  - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/ogg`, `video/mp4`, `video/webm`.
  - Forbidden types: `.exe`, `.bat`, `.sh`, `.php`, `.js`, `.html` are strictly rejected.
  - Maximum upload sizes:
    - Images & Audio: **25 MB**
    - Video Clips: **150 MB**

---

## 2. Required Environment Variables

Add the following keys to `.env.local` / production environment:

```env
# Cloudflare R2 Object Storage
CLOUDFLARE_R2_ACCOUNT_ID="your_cloudflare_account_id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your_r2_access_key_id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
CLOUDFLARE_R2_PUBLIC_URL="https://media.example.com"
```

---

## 3. R2 Bucket CORS Configuration

In the Cloudflare Dashboard, navigate to **R2 > Overview > your-bucket-name > Settings > CORS Policy** and apply the following configuration:

```json
[
  {
    "AllowedOrigins": [
      "https://expertomemories.in",
      "https://www.expertomemories.in",
      "http://localhost:3000"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 4. Presigned Direct Upload Pipeline

1. **Client Presign Request** (`/api/media/r2-presign`):
   - Authenticated customer sends file name, file size, MIME type, and project slug.
   - Server validates file extension, MIME type, and size caps.
   - Generates an S3 presigned PUT URL with a 15-minute expiration time (`Expires: 900`).
2. **Direct Browser Upload**:
   - The browser performs a direct HTTP PUT request to Cloudflare R2.
   - Media bytes bypass the Next.js web application server, minimizing bandwidth and latency.
3. **Public URL Mapping**:
   - Media is served publicly via Cloudflare CDN caching (`https://media.expertomemories.in/projects/{slug}/{filename}`).
