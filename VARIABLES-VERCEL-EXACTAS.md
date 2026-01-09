# 🔧 Variables de Entorno para Vercel - LISTA EXACTA

Copia y pega estas variables **UNA POR UNA** en Vercel.

---

## 📋 Instrucciones

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** > **Environment Variables**
3. Agrega cada variable de la lista de abajo
4. **Marca todas** para: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **Save** después de cada una

---

## 🔐 Variables a Configurar (10 en total)

### 1. DATABASE_URL
**Key:** `DATABASE_URL`  
**Value:**
```
postgresql://neondb_owner:npg_HKv6Dtqc7AYa@ep-billowing-grass-ahmvuajf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```
✅ Production | ✅ Preview | ✅ Development

---

### 2. NEXTAUTH_SECRET
**Key:** `NEXTAUTH_SECRET`  
**Value:**
```
LYckkQ75GlaxLtru4+DqEb1CGOoBQiE2/xBGD0LOjP0=
```
✅ Production | ✅ Preview | ✅ Development

---

### 3. NEXTAUTH_URL
**Key:** `NEXTAUTH_URL`  
**Value:**
```
https://tu-app.vercel.app
```
⚠️ **IMPORTANTE**: Reemplaza `tu-app.vercel.app` con la URL real que te da Vercel después del primer deploy (ej: `https://ozbox-xxxxx.vercel.app`)

✅ Production | ✅ Preview | ✅ Development

---

### 4. CLOUDINARY_CLOUD_NAME
**Key:** `CLOUDINARY_CLOUD_NAME`  
**Value:**
```
dphwyepkm
```
✅ Production | ✅ Preview | ✅ Development

---

### 5. CLOUDINARY_API_KEY
**Key:** `CLOUDINARY_API_KEY`  
**Value:**
```
226862335399267
```
✅ Production | ✅ Preview | ✅ Development

---

### 6. CLOUDINARY_API_SECRET
**Key:** `CLOUDINARY_API_SECRET`  
**Value:**
```
M9rNKANfz9BcxlbGphYEoXdn7tA
```
✅ Production | ✅ Preview | ✅ Development

---

### 7. BOOTSTRAP_TOKEN
**Key:** `BOOTSTRAP_TOKEN`  
**Value:**
```
t8yQOlmLng8hEskGLmFJL65OXRRL3Hcf07xiEpNr75s=
```
✅ Production | ✅ Preview | ✅ Development

---

### 8. NEXT_PUBLIC_SITE_URL
**Key:** `NEXT_PUBLIC_SITE_URL`  
**Value:**
```
https://tu-app.vercel.app
```
⚠️ **IMPORTANTE**: Reemplaza `tu-app.vercel.app` con la URL real que te da Vercel después del primer deploy (ej: `https://ozbox-xxxxx.vercel.app`)

✅ Production | ✅ Preview | ✅ Development

---

### 9. NEXT_PUBLIC_SHIPPING_DEFAULT
**Key:** `NEXT_PUBLIC_SHIPPING_DEFAULT`  
**Value:**
```
5000
```
✅ Production | ✅ Preview | ✅ Development

---

### 10. SHIPPING_DEFAULT
**Key:** `SHIPPING_DEFAULT`  
**Value:**
```
5000
```
✅ Production | ✅ Preview | ✅ Development

---

## ✅ Checklist

Después de agregar todas, verifica:

- [ ] 10 variables agregadas
- [ ] Todas marcadas para Production, Preview y Development
- [ ] No hay espacios extra al inicio o final de los valores
- [ ] Las URLs temporales (`tu-app.vercel.app`) se actualizarán después del primer deploy

---

## 🔄 Después del Primer Deploy

1. Copia la URL real de Vercel (ej: `https://ozbox-xxxxx.vercel.app`)
2. Edita estas 2 variables y reemplaza `tu-app.vercel.app` con tu URL real:
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_SITE_URL`
3. Guarda los cambios (Vercel hará un redeploy automático)

---

## 🚨 Errores Comunes

### Error: "Variables de entorno no validadas"
- Verifica que todas las 10 variables estén agregadas
- Verifica que no haya espacios extra
- Verifica que las URLs no tengan `http://` duplicado

### Error: "DATABASE_URL no válida"
- Asegúrate de que la URL termine con `?sslmode=require`
- No debe tener espacios
- Debe empezar con `postgresql://`

### Error: "Cloudinary no configurado"
- Verifica las 3 variables de Cloudinary
- Asegúrate de que los valores sean exactos (sin espacios)

---

**¿Tienes todas las variables configuradas?** Avísame y verificamos juntos.

