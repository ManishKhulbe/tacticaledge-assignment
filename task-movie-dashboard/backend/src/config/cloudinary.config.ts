import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

console.log(
  '🚀 ~ process.env.CLOUDINARY_CLOUD_NAME:',
  process.env.CLOUDINARY_CLOUD_NAME,
);
export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

export { cloudinary };
