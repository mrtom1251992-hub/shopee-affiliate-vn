import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './anh-bai-viet';
const outputDir = './public/images';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = [
  { src: 'click dao.png', dest: 'click-dao.webp' },
  { src: 'shiop.png', dest: 'shiop.webp' },
  { src: 'huy hoa hong.png', dest: 'huy-hoa-hong.webp' },
];

for (const file of files) {
  const srcPath = path.join(inputDir, file.src);
  const destPath = path.join(outputDir, file.dest);

  if (fs.existsSync(srcPath)) {
    const originalSize = fs.statSync(srcPath).size;

    await sharp(srcPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(destPath);

    const newSize = fs.statSync(destPath).size;
    const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

    console.log(`Optimized ${file.src}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024).toFixed(1)}KB (-${reduction}%)`);
  }
}
