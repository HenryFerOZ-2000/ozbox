import { v2 as cloudinary } from "cloudinary"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

// Configurar Cloudinary si hay credenciales
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export async function uploadImage(file: File): Promise<{ url: string; publicId?: string }> {
  const isProduction = process.env.NODE_ENV === "production"

  // En producción, Cloudinary es obligatorio
  if (isProduction) {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(
        "Cloudinary no está configurado. En producción es obligatorio configurar CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET"
      )
    }
  }

  // Si hay Cloudinary configurado, usarlo
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "ozbox",
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
              })
            }
          }
        )
        .end(buffer)
    })
  }

  // Fallback: guardar localmente (solo en desarrollo)
  if (isProduction) {
    throw new Error("Cloudinary es obligatorio en producción")
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = join(process.cwd(), "public", "uploads")
  await mkdir(uploadsDir, { recursive: true })

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
  const filepath = join(uploadsDir, filename)

  await writeFile(filepath, buffer)

  const url = `/uploads/${filename}`
  return { url }
}

export async function deleteImage(publicId?: string, url?: string): Promise<void> {
  // Si hay Cloudinary y publicId, eliminar de Cloudinary
  if (
    publicId &&
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error)
    }
  }

  // Si es local, intentar eliminar el archivo
  if (url && url.startsWith("/uploads/")) {
    try {
      const { unlink } = await import("fs/promises")
      const { join } = await import("path")
      const filepath = join(process.cwd(), "public", url)
      await unlink(filepath)
    } catch (error) {
      console.error("Error deleting local file:", error)
    }
  }
}

