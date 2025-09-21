import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { cloudinary } from '../config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'movie-posters',
          resource_type: 'image',
          transformation: [
            { width: 500, height: 750, crop: 'fill' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
      );
      return result.secure_url;
    } catch (error) {
      throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
    }
  }

  generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = extname(originalName);
    return `${timestamp}-${randomString}${ext}`;
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
