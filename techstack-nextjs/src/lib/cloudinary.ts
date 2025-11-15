import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export class CloudinaryService {
  /**
   * Upload image to Cloudinary
   * @param file - Buffer or base64 string of the image
   * @param folder - Folder path (e.g., 'techstack-solution/testimonial')
   * @param filename - Optional filename (will be auto-generated if not provided)
   * @returns Upload result with URL and metadata
   */
  static async uploadImage(
    file: Buffer | string,
    folder: string,
    filename?: string
  ): Promise<UploadResult> {
    try {
      const uploadOptions: any = {
        folder: folder,
        resource_type: 'image',
        transformation: [
          {
            quality: 'auto:good',
            fetch_format: 'auto',
          },
        ],
      };

      if (filename) {
        uploadOptions.public_id = `${folder}/${filename}`;
      }

      // Convert Buffer to base64 string if needed
      let uploadFile: string;
      if (Buffer.isBuffer(file)) {
        uploadFile = `data:image/jpeg;base64,${file.toString('base64')}`;
      } else {
        uploadFile = file;
      }

      const result = await cloudinary.uploader.upload(uploadFile, uploadOptions);

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Delete image from Cloudinary
   * @param publicId - The public ID of the image to delete
   * @returns Deletion result
   */
  static async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }

  /**
   * Upload testimonial image
   * @param file - Buffer or base64 string of the image
   * @param filename - Optional filename
   * @returns Upload result
   */
  static async uploadTestimonialImage(
    file: Buffer | string,
    filename?: string
  ): Promise<UploadResult> {
    return this.uploadImage(file, 'techstack-solution/testimonials', filename);
  }

  /**
   * Upload blog image
   * @param file - Buffer or base64 string of the image
   * @param filename - Optional filename
   * @returns Upload result
   */
  static async uploadBlogImage(
    file: Buffer | string,
    filename?: string
  ): Promise<UploadResult> {
    return this.uploadImage(file, 'techstack-solution/blog', filename);
  }

  /**
   * Get optimized image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformations - Cloudinary transformation options
   * @returns Optimized image URL
   */
  static getOptimizedUrl(
    publicId: string,
    transformations?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    }
  ): string {
    const defaultTransformations = {
      quality: 'auto:good',
      fetch_format: 'auto',
    };

    const finalTransformations = { ...defaultTransformations, ...transformations };

    return cloudinary.url(publicId, finalTransformations);
  }
}

export default CloudinaryService;
