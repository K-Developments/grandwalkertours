// src/lib/download-image.ts
import fs from 'fs';
import path from 'path';

/**
 * Download an image at build time and save to /public/images
 * @param url External image URL
 * @param name A descriptive name for the image, used for the filename
 * @returns Relative path to the local image for Next.js <Image>
 */
export async function downloadImage(url: string, name: string): Promise<string> {
  // If the URL is already a local path, don't re-download it.
  if (url.startsWith('/')) {
    return url;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.warn(`Failed to fetch image: ${url}, status: ${response.status}`);
        return url; // Return original URL on failure
    }

    const buffer = await response.arrayBuffer();
    
    // Sanitize the name to create a valid filename
    const safeName = name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    
    // Extract a unique part of the URL to prevent collisions, e.g., from Unsplash IDs
    const urlParts = url.split('?')[0].split('/');
    const uniquePart = urlParts.pop() || Date.now().toString();

    const ext = path.extname(url.split('?')[0]) || '.jpg';
    const fileName = `${safeName}-${uniquePart}${ext}`;
    
    const imagesDir = path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filePath = path.join(imagesDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const localPath = `/images/${fileName}`;
    return localPath;
  } catch (error) {
    console.error(`Error downloading image ${url}:`, error);
    return url; // Return original URL on error
  }
}
