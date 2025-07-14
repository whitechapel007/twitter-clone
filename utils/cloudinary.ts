import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const config = useRuntimeConfig();

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  filename?: string
): Promise<UploadApiResponse | undefined> => {
  cloudinary.config({
    cloud_name: config.public.cloudinaryCloudName as string,
    api_key: config.public.cloudinaryApiKey as string,
    api_secret: config.cloudinaryApiSecret as string,
  });

  try {
    // Convert buffer to base64 data URL
    const base64Data = `data:image/jpeg;base64,${fileBuffer.toString(
      "base64"
    )}`;

    const result = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          base64Data,
          {
            folder: "tweets",
            public_id: filename ? filename.split(".")[0] : undefined, // Use filename without extension
            resource_type: "auto", // Auto-detect file type
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      }
    );

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
