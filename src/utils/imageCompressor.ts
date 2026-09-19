import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 2000,
    maxHeight = 2000,
    maxSizeKB = 2000,
    quality = 0.9,
  } = options;

  if (file.size <= maxSizeKB * 1024) {
    return file;
  }

  try {
    const compressedBlob = await imageCompression(file, {
      maxSizeMB: maxSizeKB / 1024,
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      initialQuality: quality,
      useWebWorker: true,
      fileType: "image/jpeg",
      maxIteration: 15,
    });

    return new File([compressedBlob], file.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Compression failed for", file.name, error);
    return file;
  }
};

export const compressMultipleImages = async (
  files: File[],
  options?: CompressionOptions
): Promise<File[]> => {
  const compressed: File[] = [];
  for (const file of files) {
    const result = await compressImage(file, options);
    compressed.push(result);
  }
  return compressed;
};