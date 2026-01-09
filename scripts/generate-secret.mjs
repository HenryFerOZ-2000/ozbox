#!/usr/bin/env node

/**
 * Genera un secret aleatorio seguro para NEXTAUTH_SECRET
 * Uso: node scripts/generate-secret.mjs
 */

import crypto from "crypto"

const secret = crypto.randomBytes(32).toString("base64")
console.log("\n✅ Secret generado para NEXTAUTH_SECRET:\n")
console.log(secret)
console.log("\n📋 Copia este valor y úsalo en tu archivo .env o en Vercel\n")

