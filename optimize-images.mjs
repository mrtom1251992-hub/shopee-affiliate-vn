import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './anh-bai-viet';
const outputDir = './public/images';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (fs.existsSync(inputDir)) {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      const baseName = path.basename(file, ext).trim().toLowerCase().replace(/\s+/g, '-');
      const srcPath = path.join(inputDir, file);
      const destPath = path.join(outputDir, `${baseName}.webp`);

      const originalSize = fs.statSync(srcPath).size;

      // Ultra-optimized 720px width at quality 68 for 100/100 Mobile PageSpeed
      await sharp(srcPath)
        .resize({ width: 720, withoutEnlargement: true })
        .webp({ quality: 68, effort: 6, smartSubsample: true })
        .toFile(destPath);

      const newSize = fs.statSync(destPath).size;
      const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

      console.log(`[Ultra-Optimized] ${file} -> ${baseName}.webp: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)`);
    }
  }
}
