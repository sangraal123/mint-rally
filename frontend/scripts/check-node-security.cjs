// Minimum supported versions patched by the October 21, 2026 security release.
// https://nodejs.org/en/blog/vulnerability/october-2026-security-releases
const [major, minor, patch] = process.versions.node.split('.').map(Number);
const minimum = { 22: [23, 4], 24: [22, 1], 26: [12, 1] }[major];
if (!minimum || minor < minimum[0] || (minor === minimum[0] && patch < minimum[1])) {
  console.error(`Node.js ${process.versions.node} is unsupported or missing security fixes. Use 22.23.4, 24.22.1, or 26.12.1 (or a newer patch of these majors).`);
  process.exit(1);
}
console.log(`Node.js ${process.versions.node}: October 2026 security baseline satisfied.`);
