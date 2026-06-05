const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const assetsDir = path.join(__dirname, "..", "assets");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function makePng(width, height, paintPixel) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0;
    offset += 1;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = paintPixel(x, y, width, height);
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
      offset += 4;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function roundedSquare(x, y, size, radius, inset) {
  const left = inset;
  const top = inset;
  const right = size - inset;
  const bottom = size - inset;
  const cx = x < left + radius ? left + radius : x > right - radius ? right - radius : x;
  const cy = y < top + radius ? top + radius : y > bottom - radius ? bottom - radius : y;
  return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= radius * radius;
}

function iconPixel(x, y, width, height) {
  const bg = [232, 242, 236, 255];
  if (!roundedSquare(x, y, width, 150, 128)) return bg;

  const cx = width / 2;
  const cy = height / 2 + 12;
  const belly = ((x - cx) ** 2) / 47000 + ((y - cy) ** 2) / 78000 < 1;
  const leafLeft = ((x - 420) ** 2) / 9800 + ((y - 352) ** 2) / 4200 < 1;
  const leafRight = ((x - 604) ** 2) / 9800 + ((y - 352) ** 2) / 4200 < 1;
  const stem = x > 500 && x < 524 && y > 296 && y < 560;

  if (leafLeft || leafRight || stem) return [47, 111, 94, 255];
  if (belly) return [247, 232, 238, 255];
  return [255, 255, 255, 255];
}

function splashPixel(x, y, width, height) {
  const bg = [251, 250, 247, 255];
  const cx = width / 2;
  const cy = height / 2 - 80;
  const circle = (x - cx) ** 2 + (y - cy) ** 2 < 170 ** 2;
  const belly = ((x - cx) ** 2) / 10800 + ((y - cy + 8) ** 2) / 18000 < 1;
  const leafLeft = ((x - cx + 55) ** 2) / 4300 + ((y - cy - 105) ** 2) / 2200 < 1;
  const leafRight = ((x - cx - 55) ** 2) / 4300 + ((y - cy - 105) ** 2) / 2200 < 1;

  if (leafLeft || leafRight) return [47, 111, 94, 255];
  if (belly) return [247, 232, 238, 255];
  if (circle) return [232, 242, 236, 255];
  return bg;
}

fs.mkdirSync(assetsDir, { recursive: true });
fs.writeFileSync(path.join(assetsDir, "icon.png"), makePng(1024, 1024, iconPixel));
fs.writeFileSync(path.join(assetsDir, "adaptive-icon.png"), makePng(1024, 1024, iconPixel));
fs.writeFileSync(path.join(assetsDir, "splash.png"), makePng(1242, 2436, splashPixel));

console.log("Generated app icon, adaptive icon, and splash assets.");
