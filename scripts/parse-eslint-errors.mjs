import fs from "fs";

const report = JSON.parse(fs.readFileSync("eslint_report.json", "utf8"));
const errors = [];

for (const file of report) {
  for (const msg of file.messages) {
    if (msg.severity === 2) {
      errors.push({
        file: file.filePath,
        line: msg.line,
        col: msg.column,
        ruleId: msg.ruleId,
        message: msg.message.split("\n")[0],
      });
    }
  }
}

console.log(`Found ${errors.length} errors:`);
errors.forEach((e, i) => {
  console.log(`${i + 1}. ${e.file}:${e.line}:${e.col} [${e.ruleId}] - ${e.message}`);
});
