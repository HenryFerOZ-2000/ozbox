# 🚀 Guía Paso a Paso - Configurar Vercel

## ✅ Lo que ya tienes listo:

- ✅ Neon Database configurado
- ✅ Cloudinary configurado
- ✅ Secrets generados
- ✅ Código en GitHub

---

## 📋 Paso 1: Importar Proyecto en Vercel

1. Ve a **https://vercel.com** e inicia sesión con GitHub
2. Haz clic en **"Add New"** > **"Project"**
3. Busca y selecciona el repositorio: **`HenryFerOZ-2000/ozbox`**
4. Haz clic en **"Import"**

---

## 📋 Paso 2: Configurar Variables de Entorno

**IMPORTANTE**: NO hagas clic en "Deploy" todavía. Primero configura las variables.

1. En la página de configuración, busca la sección **"Environment Variables"**
2. Haz clic en **"Add"** o **"Add Variable"** para cada una:

### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: 
```
postgresql://neondb_owner:npg_HKv6Dtqc7AYa@ep-billowing-grass-ahmvuajf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 2: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: `LYckkQ75GlaxLtru4+DqEb1CGOoBQiE2/xBGD0LOjP0=`
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 3: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://tu-app.vercel.app` (por ahora, lo actualizaremos después)
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 4: CLOUDINARY_CLOUD_NAME
- **Key**: `CLOUDINARY_CLOUD_NAME`
- **Value**: `dphwyepkm`
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 5: CLOUDINARY_API_KEY
- **Key**: `CLOUDINARY_API_KEY`
- **Value**: `226862335399267`
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 6: CLOUDINARY_API_SECRET
- **Key**: `CLOUDINARY_API_SECRET`
- **Value**: `M9rNKANfz9BcxlbGphYEoXdn7tA`
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 7: BOOTSTRAP_TOKEN
- **Key**: `BOOTSTRAP_TOKEN`
- **Value**: `t8yQOlmLng8hEskGLmFJL65OXRRL3Hcf07xiEpNr75s=`
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 8: NEXT_PUBLIC_SITE_URL
- **Key**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://tu-app.vercel.app` (por ahora, lo actualizaremos después)
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 9: NEXT_PUBLIC_SHIPPING_DEFAULT
- **Key**: `NEXT_PUBLIC_SHIPPING_DEFAULT`
- **Value**: `5000`
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

### Variable 10: SHIPPING_DEFAULT
- **Key**: `SHIPPING_DEFAULT`
- **Value**: `5000`
- ✅ Marca: Production, Preview, Development
- ✅ Guarda

---

## 📋 Paso 3: Deploy

1. Después de agregar todas las variables, haz clic en **"Deploy"**
2. Espera a que termine el build (2-5 minutos)
3. Una vez completado, Vercel te dará una URL como: `https://ozbox-xxxxx.vercel.app`
4. **Copia esa URL**, la necesitarás para actualizar las variables

---

## 📋 Paso 4: Actualizar URLs

Después del primer deploy, necesitas actualizar 2 variables con la URL real:

1. Ve a **Settings** > **Environment Variables**
2. Edita `NEXTAUTH_URL` y cámbiala a tu URL real (ej: `https://ozbox-xxxxx.vercel.app`)
3. Edita `NEXT_PUBLIC_SITE_URL` y cámbiala a tu URL real
4. Guarda los cambios
5. Vercel hará un **redeploy automático**

---

## 📋 Paso 5: Crear el Primer Admin (Bootstrap)

Una vez que el deploy esté completo y las URLs actualizadas:

1. Abre PowerShell o Terminal
2. Ejecuta este comando (reemplaza `TU_URL` con tu URL de Vercel):

```powershell
curl -X POST https://TU_URL.vercel.app/api/admin/bootstrap `
  -H "Content-Type: application/json" `
  -H "x-bootstrap-token: t8yQOlmLng8hEskGLmFJL65OXRRL3Hcf07xiEpNr75s=" `
  -d '{\"email\": \"admin@ozbox.com\", \"password\": \"TuPasswordSeguro123!\"}'
```

**O en bash/curl normal:**
```bash
curl -X POST https://TU_URL.vercel.app/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-token: t8yQOlmLng8hEskGLmFJL65OXRRL3Hcf07xiEpNr75s=" \
  -d '{"email": "admin@ozbox.com", "password": "TuPasswordSeguro123!"}'
```

3. Si todo está bien, recibirás una respuesta JSON con `"success": true`
4. **Guarda las credenciales** del admin de forma segura

---

## ✅ Verificación Final

1. Visita tu URL: `https://tu-app.vercel.app`
2. Debe mostrar la página principal de OZBOX
3. Visita: `https://tu-app.vercel.app/admin`
4. Debe redirigir o bloquear (sin login)
5. Visita: `https://tu-app.vercel.app/auth/login`
6. Inicia sesión con las credenciales del bootstrap
7. Debe llevarte al dashboard admin

---

## 🎉 ¡Listo!

Tu aplicación OZBOX está desplegada y funcionando en producción.

**Próximos pasos opcionales:**
- Configurar dominio personalizado en Vercel
- Revisar logs en Vercel para monitoreo
- Configurar backups en Neon

---

**¿Necesitas ayuda en algún paso?** Avísame y te guío.

