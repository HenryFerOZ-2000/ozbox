# 🔒 Configurar Vercel de Forma Segura

**IMPORTANTE**: Las credenciales NUNCA deben estar en el código o en archivos subidos a GitHub.

---

## ✅ Forma Correcta: Variables en Vercel

Todas las credenciales se configuran **SOLO en Vercel**, nunca en el código.

---

## 📋 Lista de Variables para Vercel

Ve a tu proyecto en Vercel > **Settings** > **Environment Variables** y agrega estas 10 variables:

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_HKv6Dtqc7AYa@ep-billowing-grass-ahmvuajf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. NEXTAUTH_SECRET
Genera uno nuevo con:
```bash
npm run generate-secret
```
O usa este (genera uno nuevo para mayor seguridad):
```
[GENERA UNO NUEVO - NO USES EL QUE ESTABA EN LOS ARCHIVOS]
```

### 3. NEXTAUTH_URL
```
https://tu-app.vercel.app
```
⚠️ Actualiza con tu URL real después del primer deploy

### 4. CLOUDINARY_CLOUD_NAME
```
[TU_CLOUD_NAME_DE_CLOUDINARY]
```

### 5. CLOUDINARY_API_KEY
```
[TU_API_KEY_DE_CLOUDINARY]
```

### 6. CLOUDINARY_API_SECRET
```
[TU_API_SECRET_DE_CLOUDINARY]
```

### 7. BOOTSTRAP_TOKEN
Genera uno nuevo con:
```bash
npm run generate-secret
```

### 8. NEXT_PUBLIC_SITE_URL
```
https://tu-app.vercel.app
```
⚠️ Actualiza con tu URL real después del primer deploy

### 9. NEXT_PUBLIC_SHIPPING_DEFAULT
```
5000
```

### 10. SHIPPING_DEFAULT
```
5000
```

---

## 🔐 Generar Secrets Seguros

Ejecuta localmente:
```bash
npm run generate-secret
```

Esto generará un secret seguro. **Úsalo solo en Vercel**, no lo guardes en archivos.

---

## ⚠️ IMPORTANTE - Seguridad

1. **NUNCA** commitees archivos con credenciales
2. **NUNCA** subas `.env` o archivos con secrets a GitHub
3. **SIEMPRE** usa variables de entorno en Vercel
4. **SI** accidentalmente subiste credenciales:
   - Cámbialas inmediatamente en Cloudinary/Neon
   - Genera nuevos secrets
   - Actualiza las variables en Vercel

---

## 🔄 Si Expusiste Credenciales

### Para Cloudinary:
1. Ve a https://cloudinary.com/console
2. Settings > Security
3. Regenera el **API Secret**
4. Actualiza la variable en Vercel

### Para Neon:
1. Ve a https://neon.tech
2. Settings > Reset Password
3. Genera nueva Connection String
4. Actualiza `DATABASE_URL` en Vercel

### Para NEXTAUTH_SECRET y BOOTSTRAP_TOKEN:
1. Genera nuevos con `npm run generate-secret`
2. Actualiza en Vercel
3. Los usuarios deberán iniciar sesión nuevamente

---

## ✅ Verificación

Después de configurar todas las variables en Vercel:
- El build debería pasar
- Las credenciales estarán seguras
- No habrá secrets en el código

---

**Recuerda**: Las credenciales solo existen en Vercel, nunca en el código.

