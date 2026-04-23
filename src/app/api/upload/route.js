import { v2 as cloudinary } from "cloudinary";
import { authenticate } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/apiResponse";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Next.js App Router: disable body parsing so we can read the stream
export const runtime = "nodejs";

/**
 * POST /api/upload
 * Accepts: multipart/form-data with field "file"
 * Returns: { url, public_id }
 * Requires: Bearer token (any authenticated user)
 */
export async function POST(request) {
  try {
    const auth = authenticate(request);
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) return apiError("No file provided");

    // Convert File/Blob to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "freshcart",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return apiSuccess(
      { url: result.secure_url, public_id: result.public_id },
      "Image uploaded successfully"
    );
  } catch (err) {
    console.error("Upload error:", err);
    return apiError(err.message || "Upload failed", 500);
  }
}
