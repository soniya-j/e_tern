import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import configKeys from '../configKeys';

// export async function processAndUploadImage(file: Express.Multer.File): Promise<string> {
//   // Process the image
//   const processedImage = await sharp(file.buffer)
//     .resize({ width: 800, height: 800, fit: 'inside' })
//     .toFormat('png')
//     .toBuffer();

//   // Generate a unique filename
//   const filename = uuidv4() + '.png';
//   const filePath = path.join(configKeys.BASE_DIR_PATH, 'upload', 'avatar', filename);
//   // Ensure the directory exists
//   await fs.mkdir(path.dirname(filePath), { recursive: true });
//   // Save the file to the local directory
//   await fs.writeFile(filePath, processedImage);
//   // Return the file path or a URL to access the file
//   return `/upload/avatar/${filename}`;
// }

export async function processAndUploadImage(
  file: Express.Multer.File,
  uploadFolder: string,
): Promise<string> {
  // Process the image
  const processedImage = await sharp(file.buffer)
    .resize({ width: 800, height: 800, fit: 'inside' })
    .toFormat('png')
    .toBuffer();

  // Generate a unique filename
  const filename = uuidv4() + '.png';
  //  const filePath = path.join(configKeys.BASE_DIR_PATH, 'upload', 'avatar', filename);
  const filePath = path.join(configKeys.BASE_DIR_PATH, 'upload', uploadFolder, filename);

  // Ensure the directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  // Save the file to the local directory
  await fs.writeFile(filePath, processedImage);
  // Return the file path or a URL to access the file
  return `/upload/${uploadFolder}/${filename}`;
}
