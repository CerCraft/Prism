import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

const outputDirectory = new URL('./public/icons/', import.meta.url);
const sizes = [16, 48, 128];
const orange = [255, 77, 0, 255];

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function createIcon(size) {
  const pixels = Buffer.alloc(size * size * 4, 0);
  const thickness = Math.max(1, Math.round(size / 32));

  function paint(x, y, color) {
    const offset = (y * size + x) * 4;
    pixels.set(color, offset);
  }

  function line(startX, startY, endX, endY, color, width = thickness) {
    const distance = Math.hypot(endX - startX, endY - startY);
    const steps = Math.max(1, Math.ceil(distance * 2));
    const radius = Math.max(0, Math.floor(width / 2));
    for (let step = 0; step <= steps; step += 1) {
      const progress = step / steps;
      const centerX = Math.round(startX + (endX - startX) * progress);
      const centerY = Math.round(startY + (endY - startY) * progress);
      for (let y = -radius; y <= radius; y += 1) {
        for (let x = -radius; x <= radius; x += 1) {
          const pixelX = centerX + x;
          const pixelY = centerY + y;
          if (pixelX >= 0 && pixelX < size && pixelY >= 0 && pixelY < size) {
            paint(pixelX, pixelY, color);
          }
        }
      }
    }
  }

  const point = (x, y) => [Math.round(size * x), Math.round(size * y)];
  const apex = point(0.5, 0.12);
  const lowerLeft = point(0.13, 0.84);
  const lowerRight = point(0.87, 0.84);
  const entry = point(0.3, 0.5);
  const center = point(0.5, 0.58);
  const exitUpper = point(0.87, 0.4);
  const exitLower = point(0.87, 0.76);

  line(...apex, ...lowerLeft, orange);
  line(...lowerLeft, ...lowerRight, orange);
  line(...lowerRight, ...apex, orange);
  line(...entry, ...center, orange);
  line(...center, ...exitUpper, orange);
  line(...center, ...exitLower, orange);
  line(...point(0.5, 0.58), ...point(0.5, 0.84), orange, Math.max(1, Math.round(thickness * 0.75)));

  const scanlines = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    scanlines[rowStart] = 0;
    pixels.copy(scanlines, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(scanlines)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all(
  sizes.map((size) =>
    writeFile(new URL(`icon${size}.png`, outputDirectory), createIcon(size)),
  ),
);