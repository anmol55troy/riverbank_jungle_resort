import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a buffer to Cloudinary
 * @param buffer - The file buffer to upload
 * @param folder - The Cloudinary folder to upload to (default: 'river-bank-jungle-resort')
 * @returns Promise with the Cloudinary upload result
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'river-bank-jungle-resort'
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Deletes an asset from Cloudinary by its public ID
 * @param publicId - The public ID of the Cloudinary asset
 * @returns Promise with the Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  if (!publicId) return;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
