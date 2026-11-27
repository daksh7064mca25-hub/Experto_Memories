"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { WeddingOpeningConfig } from "@/types/website";
import { WeddingThemeStyles } from "../weddingThemes";
import { Sparkles, Volume2, VolumeX, ArrowDown, Bell } from "lucide-react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";

interface Props {
  config: WeddingOpeningConfig;
  theme: WeddingThemeStyles;
  onOpenInvitation: () => void;
  isOpen: boolean;
}

/**
 * Authentic Brass Temple Bell Synthesizer using Web Audio API.
 * Uses realistic physical partial harmonics of an Indian brass temple bell (Ghanti)
 * with sharp strike transient and resonant exponential decay.
 * Triggered only by visitor interaction (never autoplays).
 */
function playTempleBellChime(volume = 0.48) {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const partials = [
      { freq: 680, gain: 0.55, decay: 3.6 },
      { freq: 1020, gain: 0.38, decay: 3.0 },
      { freq: 1360, gain: 0.28, decay: 2.4 },
      { freq: 1880, gain: 0.18, decay: 1.8 },
      { freq: 2720, gain: 0.10, decay: 1.2 },
      { freq: 3400, gain: 0.05, decay: 0.7 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.996), ctx.currentTime + decay);

      pGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      pGain.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.008);
      pGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + decay);

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + decay);
    });
  } catch {
    // Fail gracefully if Web Audio is unsupported
  }
}

/**
 * Procedural Sandstone and Granite PBR Texture Generator
 * Creates authentic natural stone grain and masonry courses for Three.js materials.
 */
function createStoneTexture(baseColor: string, specks: string[], count: number, hasCourses = true) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Natural mineral specks and noise
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = specks[i % specks.length];
    ctx.globalAlpha = 0.08 + Math.random() * 0.18;
    const size = 1 + Math.random() * 4;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size);
  }

  // Stone masonry course lines
  if (hasCourses) {
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#2b2015";
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
      const offset = ((y / 64) % 2) * 64;
      for (let x = offset; x < 512; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 64);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const HinduMandir3DOpening: React.FC<Props> = ({
  config,
  theme,
  onOpenInvitation,
  isOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [hasVideoTransition, setHasVideoTransition] = useState(false);

  // DOM Container & Canvas Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayControlsRef = useRef<HTMLDivElement | null>(null);
  const screenFlashRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Three.js References for Animation & Clean Disposal
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Interactive 3D Nodes
  const leftDoorGroupRef = useRef<THREE.Group | null>(null);
  const rightDoorGroupRef = useRef<THREE.Group | null>(null);
  const leftBellGroupRef = useRef<THREE.Group | null>(null);
  const rightBellGroupRef = useRef<THREE.Group | null>(null);
  const sanctumLightRef = useRef<THREE.PointLight | null>(null);
  const leftDiyaFlameRef = useRef<THREE.Mesh | null>(null);
  const rightDiyaFlameRef = useRef<THREE.Mesh | null>(null);
  const petalsMeshRef = useRef<THREE.InstancedMesh | null>(null);
  const petalsDataRef = useRef<Array<{ x: number; y: number; z: number; rx: number; ry: number; rz: number; vx: number; vy: number; vz: number; vrot: number }>>([]);
  const customModelGroupRef = useRef<THREE.Group | null>(null);

  // Ring the sacred bell sound
  const ringBellSound = useCallback(() => {
    if (soundEnabled) {
      playTempleBellChime(0.48);
    }
  }, [soundEnabled]);

  // Animate a 3D Bell Swing with Physics Recoil
  const triggerBellSwing = (bellGroup: THREE.Group | null, direction: 1 | -1) => {
    if (!bellGroup) return;
    ringBellSound();
    setHasInteracted(true);

    gsap.killTweensOf(bellGroup.rotation);
    gsap.timeline()
      .to(bellGroup.rotation, { z: direction * 0.45, duration: 0.18, ease: "power1.out" })
      .to(bellGroup.rotation, { z: -direction * 0.35, duration: 0.28, ease: "sine.inOut" })
      .to(bellGroup.rotation, { z: direction * 0.25, duration: 0.35, ease: "sine.inOut" })
      .to(bellGroup.rotation, { z: -direction * 0.15, duration: 0.42, ease: "sine.inOut" })
      .to(bellGroup.rotation, { z: direction * 0.08, duration: 0.50, ease: "sine.inOut" })
      .to(bellGroup.rotation, { z: 0, duration: 0.60, ease: "power1.out" });
  };

  // Main 3D Door Opening & Cinematic Camera Travel
  const handleOpenMandir = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    setHasInteracted(true);
    ringBellSound();

    // Check for user reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (screenFlashRef.current) {
        gsap.to(screenFlashRef.current, {
          opacity: 1,
          duration: 0.5,
          onComplete: onOpenInvitation,
        });
      } else {
        onOpenInvitation();
      }
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onOpenInvitation();
      },
    });

    // 1. Both hanging bells swing vigorously in celebration
    if (leftBellGroupRef.current) {
      tl.to(leftBellGroupRef.current.rotation, {
        z: -0.42,
        duration: 0.15,
        repeat: 5,
        yoyo: true,
        ease: "sine.inOut",
      }, 0);
    }
    if (rightBellGroupRef.current) {
      tl.to(rightBellGroupRef.current.rotation, {
        z: 0.42,
        duration: 0.15,
        repeat: 5,
        yoyo: true,
        ease: "sine.inOut",
      }, 0.04);
    }

    // 2. Fade out 2D UI overlays (couple names and button)
    if (overlayControlsRef.current) {
      tl.to(overlayControlsRef.current, {
        opacity: 0,
        y: 25,
        duration: 0.5,
        ease: "power2.out",
      }, 0.1);
    }

    // 3. Genuine 3D Carved Wooden Doors physically rotate outward 115 degrees on hinges
    if (leftDoorGroupRef.current) {
      tl.to(leftDoorGroupRef.current.rotation, {
        y: -Math.PI * 0.65, // -117 degrees outward
        duration: 2.0,
        ease: "power2.inOut",
      }, 0.25);
    }
    if (rightDoorGroupRef.current) {
      tl.to(rightDoorGroupRef.current.rotation, {
        y: Math.PI * 0.65, // +117 degrees outward
        duration: 2.0,
        ease: "power2.inOut",
      }, 0.25);
    }

    // 4. Inner sanctum divine golden light blooms and floods outward through open doors
    if (sanctumLightRef.current) {
      tl.to(sanctumLightRef.current, {
        intensity: 4.8,
        distance: 28,
        duration: 1.4,
        ease: "power2.out",
      }, 0.35);
    }

    // 5. Cinematic 3D Camera Dolly Zoom travelling through the open portal into sanctum
    if (cameraRef.current) {
      tl.to(cameraRef.current.position, {
        z: -0.8, // Travels through doorway
        y: 1.62,
        duration: 2.4,
        ease: "power3.inOut",
      }, 0.65);
    }

    // 6. Optional Cinematic Video Transition Playback
    if (videoRef.current && hasVideoTransition) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      tl.to(videoRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0.8);
    }

    // 7. Warm ivory & champagne light smoothly envelops viewport for flawless reveal
    if (screenFlashRef.current) {
      tl.to(screenFlashRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.in",
      }, 2.0);
    }
  };

  const handleQuickSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenInvitation();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSoundEnabled((prev) => !prev);
  };

  // Initialize Three.js 3D Temple Environment
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check WebGL availability
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      setWebglSupported(false);
      setIsSceneReady(true);
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. WebGL Renderer with High-Fidelity PBR Tone Mapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // 2. 3D Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x19080e);
    scene.fog = new THREE.FogExp2(0x1f0a12, 0.038);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);
    const isMobile = width < 640;
    camera.position.set(0, 1.45, isMobile ? 6.2 : 5.0);
    camera.lookAt(0, 1.55, 0);
    cameraRef.current = camera;

    // 3. Realistic Environmental Lighting
    const hemiLight = new THREE.HemisphereLight(0xffecd2, 0x42261a, 1.4);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff3db, 2.8);
    sunLight.position.set(12, 16, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Inner Sanctum (Garbhagriha) glowing sacred point light
    const sanctumLight = new THREE.PointLight(0xffa233, 1.2, 14, 1.4);
    sanctumLight.position.set(0, 1.6, -1.8);
    scene.add(sanctumLight);
    sanctumLightRef.current = sanctumLight;

    // Threshold Diya Point Lights
    const diyaLightL = new THREE.PointLight(0xff8811, 0.7, 3.5, 2);
    diyaLightL.position.set(-1.25, 0.45, 0.85);
    scene.add(diyaLightL);

    const diyaLightR = new THREE.PointLight(0xff8811, 0.7, 3.5, 2);
    diyaLightR.position.set(1.25, 0.45, 0.85);
    scene.add(diyaLightR);

    // 4. Procedural PBR Stone & Architectural Materials
    const texSandstone = createStoneTexture("#8a6745", ["#6b4e33", "#ab855a", "#543c26"], 2800, true);
    const texDarkGranite = createStoneTexture("#3a251a", ["#2b1a11", "#4f3424", "#1e110a"], 2200, false);

    const matSandstone = new THREE.MeshStandardMaterial({
      map: texSandstone,
      roughness: 0.86,
      metalness: 0.05,
      color: 0xdeb887,
    });

    const matDarkCarved = new THREE.MeshStandardMaterial({
      map: texDarkGranite,
      roughness: 0.82,
      metalness: 0.08,
      color: 0x5c3826,
    });

    const matTeakwood = new THREE.MeshStandardMaterial({
      roughness: 0.72,
      metalness: 0.06,
      color: 0x3d2011,
    });

    const matBrassGold = new THREE.MeshStandardMaterial({
      roughness: 0.32,
      metalness: 0.84,
      color: 0xd4af37,
    });

    const matDiyaBrass = new THREE.MeshStandardMaterial({
      roughness: 0.38,
      metalness: 0.78,
      color: 0xb8860b,
    });

    const matFlame = new THREE.MeshBasicMaterial({
      color: 0xffb703,
    });

    // 5. Construct Procedural PBR 3D Hindu Temple Architecture
    const baseGroup = new THREE.Group();
    const lowerPlinth = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.35, 6.0), matSandstone);
    lowerPlinth.position.set(0, 0.175, 0.5);
    lowerPlinth.receiveShadow = true;
    baseGroup.add(lowerPlinth);

    const upperPlinth = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.25, 4.8), matSandstone);
    upperPlinth.position.set(0, 0.475, 0.3);
    upperPlinth.receiveShadow = true;
    baseGroup.add(upperPlinth);

    for (let s = 0; s < 3; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(2.4 - s * 0.15, 0.12, 0.45),
        matSandstone
      );
      step.position.set(0, 0.06 + s * 0.12, 2.6 - s * 0.4);
      step.receiveShadow = true;
      baseGroup.add(step);
    }
    scene.add(baseGroup);

    // Flanking Carved Stone Pillars (Stambhas)
    function buildCarvedPillar(x: number, z: number) {
      const pGroup = new THREE.Group();
      const pBase1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.55), matSandstone);
      pBase1.position.y = 0.6 + 0.11;
      pGroup.add(pBase1);

      const pBase2 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.46), matDarkCarved);
      pBase2.position.y = 0.6 + 0.31;
      pGroup.add(pBase2);

      const shaft1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.7, 0.36), matSandstone);
      shaft1.position.y = 0.6 + 0.75;
      pGroup.add(shaft1);

      const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.65, 8), matDarkCarved);
      shaft2.position.y = 0.6 + 1.425;
      pGroup.add(shaft2);

      const shaft3 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.45, 0.36), matSandstone);
      shaft3.position.y = 0.6 + 1.975;
      pGroup.add(shaft3);

      const kumbha = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 8), matSandstone);
      kumbha.scale.set(1.0, 0.55, 1.0);
      kumbha.position.y = 0.6 + 2.3;
      pGroup.add(kumbha);

      const phalaka = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.58), matDarkCarved);
      phalaka.position.y = 0.6 + 2.5;
      pGroup.add(phalaka);

      const corbelX = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.36), matSandstone);
      corbelX.position.y = 0.6 + 2.67;
      pGroup.add(corbelX);

      const corbelZ = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.75), matSandstone);
      corbelZ.position.y = 0.6 + 2.67;
      pGroup.add(corbelZ);

      pGroup.children.forEach((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
      });

      pGroup.position.set(x, 0, z);
      scene.add(pGroup);
      return pGroup;
    }

    buildCarvedPillar(-1.45, 0.35);
    buildCarvedPillar(1.45, 0.35);

    // Carved Stone Doorway Jambs (Dvarashakha) & Lintel (Prastara)
    const portalGroup = new THREE.Group();
    const portalW = 1.7;
    const portalH = 2.65;

    const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.32, portalH + 0.3, 0.4), matSandstone);
    leftJamb.position.set(-portalW / 2 - 0.16, 0.6 + portalH / 2, 0);
    leftJamb.castShadow = true;
    leftJamb.receiveShadow = true;
    portalGroup.add(leftJamb);

    const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.32, portalH + 0.3, 0.4), matSandstone);
    rightJamb.position.set(portalW / 2 + 0.16, 0.6 + portalH / 2, 0);
    rightJamb.castShadow = true;
    rightJamb.receiveShadow = true;
    portalGroup.add(rightJamb);

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(portalW + 1.2, 0.42, 0.6), matSandstone);
    lintel.position.set(0, 0.6 + portalH + 0.21, 0.05);
    lintel.castShadow = true;
    lintel.receiveShadow = true;
    portalGroup.add(lintel);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.32, 0.2), matBrassGold);
    crest.position.set(0, 0.6 + portalH + 0.48, 0.2);
    crest.castShadow = true;
    portalGroup.add(crest);

    const cornice = new THREE.Mesh(new THREE.BoxGeometry(portalW + 1.8, 0.35, 0.8), matSandstone);
    cornice.position.set(0, 0.6 + portalH + 0.72, 0.05);
    cornice.castShadow = true;
    portalGroup.add(cornice);

    const kalashBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.25, 12), matBrassGold);
    kalashBase.position.set(0, 0.6 + portalH + 1.02, 0.05);
    portalGroup.add(kalashBase);

    const kalashSpire = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 12), matBrassGold);
    kalashSpire.position.set(0, 0.6 + portalH + 1.32, 0.05);
    portalGroup.add(kalashSpire);

    scene.add(portalGroup);

    // Double 3D Carved Teakwood Doors on Rotational Hinges
    const doorLeafW = portalW / 2 - 0.02;
    const doorLeafH = portalH;
    const doorLeafD = 0.08;

    const leftDoorGroup = new THREE.Group();
    leftDoorGroup.position.set(-portalW / 2, 0.6, 0);

    const leftDoorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(doorLeafW, doorLeafH, doorLeafD),
      matTeakwood
    );
    leftDoorMesh.position.set(doorLeafW / 2, doorLeafH / 2, 0);
    leftDoorMesh.castShadow = true;
    leftDoorMesh.receiveShadow = true;
    leftDoorGroup.add(leftDoorMesh);

    for (let row = 0; row < 3; row++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(doorLeafW * 0.75, 0.55, 0.03),
        matDarkCarved
      );
      panel.position.set(doorLeafW / 2, 0.45 + row * 0.82, 0.045);
      leftDoorGroup.add(panel);

      for (let col = -1; col <= 1; col += 2) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), matBrassGold);
        stud.position.set(doorLeafW / 2 + col * (doorLeafW * 0.28), 0.45 + row * 0.82, 0.065);
        leftDoorGroup.add(stud);
      }
    }

    const leftRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.015, 8, 16), matBrassGold);
    leftRing.position.set(doorLeafW - 0.12, doorLeafH * 0.48, 0.065);
    leftDoorGroup.add(leftRing);

    scene.add(leftDoorGroup);
    leftDoorGroupRef.current = leftDoorGroup;

    const rightDoorGroup = new THREE.Group();
    rightDoorGroup.position.set(portalW / 2, 0.6, 0);

    const rightDoorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(doorLeafW, doorLeafH, doorLeafD),
      matTeakwood
    );
    rightDoorMesh.position.set(-doorLeafW / 2, doorLeafH / 2, 0);
    rightDoorMesh.castShadow = true;
    rightDoorMesh.receiveShadow = true;
    rightDoorGroup.add(rightDoorMesh);

    for (let row = 0; row < 3; row++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(doorLeafW * 0.75, 0.55, 0.03),
        matDarkCarved
      );
      panel.position.set(-doorLeafW / 2, 0.45 + row * 0.82, 0.045);
      rightDoorGroup.add(panel);

      for (let col = -1; col <= 1; col += 2) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), matBrassGold);
        stud.position.set(-doorLeafW / 2 + col * (doorLeafW * 0.28), 0.45 + row * 0.82, 0.065);
        rightDoorGroup.add(stud);
      }
    }

    const rightRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.015, 8, 16), matBrassGold);
    rightRing.position.set(-doorLeafW + 0.12, doorLeafH * 0.48, 0.065);
    rightDoorGroup.add(rightRing);

    scene.add(rightDoorGroup);
    rightDoorGroupRef.current = rightDoorGroup;

    // Hanging 3D Brass Temple Bells (Ghanti)
    function create3DBell(x: number, y: number, z: number) {
      const bellPivot = new THREE.Group();
      bellPivot.position.set(x, y, z);

      const chainH = 0.65;
      const chain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, chainH, 8),
        matBrassGold
      );
      chain.position.y = -chainH / 2;
      bellPivot.add(chain);

      const bellBody = new THREE.Group();
      bellBody.position.y = -chainH;

      const crown = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 6, 12), matBrassGold);
      crown.position.y = 0.04;
      bellBody.add(crown);

      const dome = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 16, 1, true), matBrassGold);
      dome.position.y = -0.12;
      dome.castShadow = true;
      bellBody.add(dome);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 20), matBrassGold);
      rim.position.y = -0.26;
      rim.rotation.x = Math.PI / 2;
      rim.castShadow = true;
      bellBody.add(rim);

      const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), matBrassGold);
      clapper.position.y = -0.25;
      bellBody.add(clapper);

      bellPivot.add(bellBody);
      scene.add(bellPivot);
      return bellPivot;
    }

    const leftBell = create3DBell(-0.85, 0.6 + portalH + 0.08, 0.45);
    leftBellGroupRef.current = leftBell;

    const rightBell = create3DBell(0.85, 0.6 + portalH + 0.08, 0.45);
    rightBellGroupRef.current = rightBell;

    // Traditional Brass Diyas on Threshold Plinth
    function create3DDiya(x: number, y: number, z: number) {
      const diyaGroup = new THREE.Group();
      diyaGroup.position.set(x, y, z);

      const bowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.06, 0.07, 12),
        matDiyaBrass
      );
      bowl.castShadow = true;
      diyaGroup.add(bowl);

      const spout = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.09, 8), matDiyaBrass);
      spout.position.set(0, 0.02, 0.1);
      spout.rotation.x = -Math.PI / 3;
      diyaGroup.add(spout);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 8), matFlame);
      flame.position.set(0, 0.09, 0.06);
      diyaGroup.add(flame);

      scene.add(diyaGroup);
      return flame;
    }

    const flameL = create3DDiya(-1.25, 0.48 + 0.035, 0.85);
    leftDiyaFlameRef.current = flameL;

    const flameR = create3DDiya(1.25, 0.48 + 0.035, 0.85);
    rightDiyaFlameRef.current = flameR;

    // Inner Sanctum (Garbhagriha) Room Behind Doorway
    const sanctumGroup = new THREE.Group();
    sanctumGroup.position.set(0, 0.6, -1.8);

    const sanctumBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, portalH + 0.6, 0.3), matDarkCarved);
    sanctumBack.position.set(0, (portalH + 0.6) / 2, -1.0);
    sanctumGroup.add(sanctumBack);

    const sanctumSideL = new THREE.Mesh(new THREE.BoxGeometry(0.3, portalH + 0.6, 2.0), matDarkCarved);
    sanctumSideL.position.set(-1.8, (portalH + 0.6) / 2, 0);
    sanctumGroup.add(sanctumSideL);

    const sanctumSideR = new THREE.Mesh(new THREE.BoxGeometry(0.3, portalH + 0.6, 2.0), matDarkCarved);
    sanctumSideR.position.set(1.8, (portalH + 0.6) / 2, 0);
    sanctumGroup.add(sanctumSideR);

    const altar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.6), matSandstone);
    altar.position.set(0, 0.225, -0.6);
    sanctumGroup.add(altar);

    const murti = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.45, 12), matBrassGold);
    murti.position.set(0, 0.675, -0.6);
    sanctumGroup.add(murti);

    scene.add(sanctumGroup);

    // Atmospheric Falling Flower Petals (Marigold & Crimson Rose)
    const petalCount = 42;
    const petalGeo = new THREE.PlaneGeometry(0.08, 0.12);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      roughness: 0.9,
    });
    const petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
    petalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(petalMesh);
    petalsMeshRef.current = petalMesh;

    const dummy = new THREE.Object3D();
    const pData: Array<{ x: number; y: number; z: number; rx: number; ry: number; rz: number; vx: number; vy: number; vz: number; vrot: number }> = [];

    const petalColors = [
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xf97316),
      new THREE.Color(0xfbbf24),
      new THREE.Color(0xe11d48),
    ];

    for (let i = 0; i < petalCount; i++) {
      const pColor = petalColors[i % petalColors.length];
      petalMesh.setColorAt(i, pColor);

      const p = {
        x: (Math.random() - 0.5) * 5.0,
        y: Math.random() * 4.5 + 0.5,
        z: (Math.random() - 0.5) * 4.0 + 1.5,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        vx: (Math.random() - 0.5) * 0.006,
        vy: -(Math.random() * 0.012 + 0.008),
        vz: (Math.random() - 0.5) * 0.006,
        vrot: (Math.random() - 0.5) * 0.02,
      };
      pData.push(p);

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.updateMatrix();
      petalMesh.setMatrixAt(i, dummy.matrix);
    }
    if (petalMesh.instanceColor) petalMesh.instanceColor.needsUpdate = true;
    petalMesh.instanceMatrix.needsUpdate = true;
    petalsDataRef.current = pData;

    // Optional External GLTF/GLB Temple Model Loader (only if explicitly configured)
    const customModelUrl = config.modelUrl;
    if (customModelUrl && customModelUrl.trim() !== "") {
      try {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.load(
          customModelUrl,
          (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
              // Bind named door and bell nodes if present in asset
              const lowerName = (child.name || "").toLowerCase();
              if (lowerName.includes("door_left") || lowerName.includes("door_l")) {
                leftDoorGroupRef.current = child as THREE.Group;
              } else if (lowerName.includes("door_right") || lowerName.includes("door_r")) {
                rightDoorGroupRef.current = child as THREE.Group;
              } else if (lowerName.includes("bell_left") || lowerName.includes("bell_l")) {
                leftBellGroupRef.current = child as THREE.Group;
              } else if (lowerName.includes("bell_right") || lowerName.includes("bell_r")) {
                rightBellGroupRef.current = child as THREE.Group;
              }
            });
            customModelGroupRef.current = model;
            scene.add(model);
          },
          undefined,
          () => {
            // Fallback seamlessly: procedural PBR temple is already rendered in scene!
          }
        );
      } catch {
        // Graceful fallback to procedural PBR architecture
      }
    }

    setIsSceneReady(true);

    // 6. Raycasting for Clicking 3D Temple Bells & Doors Directly
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

      const rect = canvas.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check left bell
      if (leftBellGroupRef.current) {
        const hitsL = raycaster.intersectObjects(leftBellGroupRef.current.children, true);
        if (hitsL.length > 0) {
          triggerBellSwing(leftBellGroupRef.current, -1);
          return;
        }
      }

      // Check right bell
      if (rightBellGroupRef.current) {
        const hitsR = raycaster.intersectObjects(rightBellGroupRef.current.children, true);
        if (hitsR.length > 0) {
          triggerBellSwing(rightBellGroupRef.current, 1);
          return;
        }
      }

      // Check clicking directly on the doors to open
      if (!isOpening && (leftDoorGroupRef.current || rightDoorGroupRef.current)) {
        const doorTargets: THREE.Object3D[] = [];
        if (leftDoorGroupRef.current) doorTargets.push(...leftDoorGroupRef.current.children);
        if (rightDoorGroupRef.current) doorTargets.push(...rightDoorGroupRef.current.children);
        const doorHits = raycaster.intersectObjects(doorTargets, true);
        if (doorHits.length > 0) {
          handleOpenMandir();
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    // 7. Responsive Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;

      camera.aspect = nw / nh;
      const mobileView = nw < 640;
      if (!isOpening) {
        camera.position.z = mobileView ? 6.2 : 5.0;
      }
      camera.updateProjectionMatrix();

      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener("resize", handleResize);

    // 8. 60fps Animation Loop with Natural Idle Bell Sway, Diya Flicker & Petal Fall
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Idle gentle bell sway in breeze when not clicked
      if (!isOpening) {
        if (leftBellGroupRef.current) {
          leftBellGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.8) * 0.04;
        }
        if (rightBellGroupRef.current) {
          rightBellGroupRef.current.rotation.z = Math.sin(elapsedTime * 1.6 + 0.8) * 0.04;
        }
      }

      // Natural diya flame flickering
      const flameNoise1 = Math.sin(elapsedTime * 14) * 0.06 + Math.cos(elapsedTime * 22) * 0.04;
      const flameNoise2 = Math.cos(elapsedTime * 16) * 0.06 + Math.sin(elapsedTime * 24) * 0.04;

      if (leftDiyaFlameRef.current) {
        leftDiyaFlameRef.current.scale.set(1.0 + flameNoise1, 1.0 + flameNoise1 * 1.5, 1.0 + flameNoise1);
      }
      if (rightDiyaFlameRef.current) {
        rightDiyaFlameRef.current.scale.set(1.0 + flameNoise2, 1.0 + flameNoise2 * 1.5, 1.0 + flameNoise2);
      }

      // Update falling flower petals in 3D
      if (petalsMeshRef.current && petalsDataRef.current.length > 0) {
        const mesh = petalsMeshRef.current;
        const data = petalsDataRef.current;

        for (let i = 0; i < data.length; i++) {
          const p = data[i];
          p.y += p.vy;
          p.x += Math.sin(p.y * 2.0 + elapsedTime) * 0.004 + p.vx;
          p.z += Math.cos(p.y * 1.8 + elapsedTime) * 0.003 + p.vz;
          p.rx += p.vrot;
          p.ry += p.vrot * 0.8;

          if (p.y < 0.2) {
            p.y = 4.8;
            p.x = (Math.random() - 0.5) * 5.0;
            p.z = (Math.random() - 0.5) * 4.0 + 1.5;
          }

          dummy.position.set(p.x, p.y, p.z);
          dummy.rotation.set(p.rx, p.ry, p.rz);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 9. Thorough Memory Cleanup on Component Unmount
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);

      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-40 overflow-hidden bg-[#14050a] select-none transition-opacity duration-1000 ${
        isOpen ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* ========================================================
          GENUINE THREE.JS WEBGL 3D CANVAS
         ======================================================== */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block cursor-pointer"
          aria-label="Interactive 3D Hindu Temple Entrance"
        />
      ) : (
        /* Atmospheric WebGL Fallback Backdrop */
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3a1a24] via-[#1f0a12] to-[#0d0306] flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('/images/temple/modhera_mandapa.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        </div>
      )}

      {/* Cinematic Transition Video Overlay (Plays during door passage if video asset provided) */}
      {config.transitionVideoUrl && (
        <video
          ref={videoRef}
          playsInline
          muted
          preload="auto"
          src={config.transitionVideoUrl}
          onCanPlay={() => setHasVideoTransition(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 z-45 transition-opacity"
        />
      )}

      {/* Screen Flash Transition Overlay */}
      <div
        ref={screenFlashRef}
        className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFEB] opacity-0 pointer-events-none z-50 transition-opacity"
      />

      {/* Top Header Navigation: Sound Toggle & Quick Skip */}
      <div className="absolute top-4 inset-x-0 px-4 sm:px-8 flex justify-between items-center z-40 pointer-events-auto">
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-[#D4AF37]/50 text-xs font-serif text-[#FDE68A] hover:text-white transition cursor-pointer shadow-lg"
          title={soundEnabled ? "Mute Bell Sound" : "Enable Bell Sound"}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={14} className="text-[#F59E0B]" />
              <span className="text-[11px]">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX size={14} className="text-stone-400" />
              <span className="text-[11px] text-stone-400">Muted</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleQuickSkip}
          className="px-4 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-[#D4AF37]/50 text-xs font-serif text-[#FDE68A] hover:text-white transition cursor-pointer shadow-lg"
        >
          <span>Skip to Invitation &rarr;</span>
        </button>
      </div>

      {/* Subtle Hint for 3D Bell Tap & Door Interaction */}
      <div className="absolute top-16 inset-x-0 flex justify-center pointer-events-none z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-serif text-[#FDE68A] bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 shadow-md animate-pulse">
          <span>🔔 Tap 3D hanging bells to ring &bull; Tap doors or button to enter</span>
        </span>
      </div>

      {/* ========================================================
          ELEGANT ROYAL OVERLAY TYPOGRAPHY & CTA CONTROLS
         ======================================================== */}
      <div
        ref={overlayControlsRef}
        className="absolute inset-x-0 bottom-4 sm:bottom-6 flex flex-col items-center text-center px-4 z-30 pointer-events-auto transition-all duration-500"
      >
        {/* Sacred Sanskrit Invocation Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs sm:text-sm font-serif font-bold tracking-widest text-[#FDE68A] bg-[#2E0B14]/90 border border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.35)] mb-2 backdrop-blur-sm">
          <Sparkles size={13} className="text-[#F59E0B] animate-pulse" />
          <span>{config.eyebrow || "|| श्री गणेशाय नमः ||"}</span>
          <Sparkles size={13} className="text-[#F59E0B] animate-pulse" />
        </div>

        {/* Blessings Introductory Quote */}
        <p className="text-xs sm:text-sm font-serif italic text-[#FDE68A]/95 max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-1">
          “With the blessings of the divine, we invite you to celebrate our wedding.”
        </p>

        {/* Couple Names Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#FAF7F2] drop-shadow-[0_2px_18px_rgba(212,175,55,0.5)] my-1">
          {config.coupleNames}
        </h1>

        {/* Wedding Date Text */}
        <p className="text-xs sm:text-sm font-serif uppercase tracking-widest text-[#F59E0B] font-semibold mb-3.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {config.weddingDateText}
        </p>

        {/* Ceremonial Action Button */}
        <button
          type="button"
          onClick={handleOpenMandir}
          className="pointer-events-auto w-full max-w-xs sm:max-w-sm py-3 px-6 rounded-full text-sm sm:text-base font-serif font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] text-[#2E0B14] shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-[#FEF08A]/70"
          aria-label="Enter The Sacred Mandap 🪷"
        >
          <Bell size={16} />
          <span>{config.actionButtonText || "Enter The Sacred Mandap 🪷"}</span>
          <ArrowDown size={16} className="animate-bounce" />
        </button>
      </div>
    </div>
  );
};
