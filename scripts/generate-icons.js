import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = join(__dirname, '../public/favicon.svg');
const outputDir = join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Generate icons for each size
    await Promise.all(
      sizes.map(async (size) => {
        const outputPath = join(outputDir, `icon-${size}x${size}.png`);
        await sharp(inputSvg)
          .resize(size, size)
          .png()
          .toFile(outputPath);
        console.log(`Generated ${size}x${size} icon`);
      })
    );

    // Generate favicon.ico with multiple sizes
    const faviconSizes = [16, 32, 48];
    const faviconBuffers = await Promise.all(
      faviconSizes.map(async (size) => {
        return await sharp(inputSvg)
          .resize(size, size)
          .png()
          .toBuffer();
      })
    );

    // Generate individual favicon PNGs
    await sharp(faviconBuffers[0])
      .resize(16, 16)
      .toFile(join(__dirname, '../public/favicon-16x16.png'));
    await sharp(faviconBuffers[1])
      .resize(32, 32)
      .toFile(join(__dirname, '../public/favicon-32x32.png'));
    await sharp(faviconBuffers[2])
      .resize(48, 48)
      .toFile(join(__dirname, '../public/favicon-48x48.png'));

    console.log('Successfully generated all icons!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 