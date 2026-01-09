#!/usr/bin/env node

/**
 * Valida que existan las variables de entorno mínimas requeridas
 * Uso: node scripts/check-env.mjs
 */

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "BOOTSTRAP_TOKEN",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SHIPPING_DEFAULT",
  "SHIPPING_DEFAULT",
]

const isProduction = process.env.NODE_ENV === "production"

const missing = requiredEnvVars.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error("\n❌ ERROR: Faltan variables de entorno requeridas:\n")
  missing.forEach((key) => {
    console.error(`   - ${key}`)
  })
  console.error("\n📋 Consulta .env.production.example para ver todas las variables necesarias\n")
  process.exit(1)
}

// Validaciones adicionales
if (isProduction) {
  if (!process.env.DATABASE_URL?.includes("neon.tech") && !process.env.DATABASE_URL?.includes("postgres")) {
    console.warn("⚠️  ADVERTENCIA: DATABASE_URL no parece ser de Neon Postgres")
  }

  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn("⚠️  ADVERTENCIA: NEXTAUTH_SECRET debería tener al menos 32 caracteres")
  }
}

console.log("✅ Variables de entorno validadas correctamente")
process.exit(0)

