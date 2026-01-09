# 📝 Pasos para Deploy - OZBOX

## ✅ Estado Actual

- ✅ Código en GitHub: https://github.com/HenryFerOZ-2000/ozbox.git
- ✅ Secrets generados (ver abajo)
- ⏳ Pendiente: Neon DB, Cloudinary, Vercel

---

## 🔐 Secrets Generados

**NEXTAUTH_SECRET** (elige uno):
- `LYckkQ75GlaxLtru4+DqEb1CGOoBQiE2/xBGD0LOjP0=`
- `xQ95Kbkvy9j038TfABh0CQuIoTGVJXOiajESuFmkn9Q=`

**BOOTSTRAP_TOKEN** (genera uno nuevo):
```bash
npm run generate-secret
```

---

## 📋 Checklist de Deploy

### Paso 1: Neon Database ⏳
- [ ] Crear cuenta en https://neon.tech
- [ ] Crear proyecto "ozbox"
- [ ] Copiar Connection String
- [ ] Formato: `postgresql://...@ep-xxxxx.region.aws.neon.tech/database?sslmode=require`

### Paso 2: Cloudinary ⏳
- [ ] Crear cuenta en https://cloudinary.com
- [ ] Copiar Cloud Name
- [ ] Copiar API Key
- [ ] Copiar API Secret

### Paso 3: Vercel ⏳
- [ ] Crear cuenta en https://vercel.com
- [ ] Importar repo de GitHub
- [ ] Configurar variables de entorno (ver abajo)
- [ ] Deploy

### Paso 4: Bootstrap Admin ⏳
- [ ] Ejecutar curl para crear primer admin
- [ ] Verificar login

---

## 🔧 Variables de Entorno para Vercel

Cuando estés en Vercel, configura estas variables:

```
DATABASE_URL = [Connection String de Neon]
NEXTAUTH_SECRET = [Uno de los secrets generados arriba]
NEXTAUTH_URL = https://tu-app.vercel.app (se actualiza después del primer deploy)
CLOUDINARY_CLOUD_NAME = [De Cloudinary]
CLOUDINARY_API_KEY = [De Cloudinary]
CLOUDINARY_API_SECRET = [De Cloudinary]
BOOTSTRAP_TOKEN = [Genera uno nuevo con npm run generate-secret]
NEXT_PUBLIC_SITE_URL = https://tu-app.vercel.app
NEXT_PUBLIC_SHIPPING_DEFAULT = 5000
SHIPPING_DEFAULT = 5000
```

---

## 🚀 Comando para Bootstrap

Después del deploy, ejecuta:

```bash
curl -X POST https://tu-app.vercel.app/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-token: TU_BOOTSTRAP_TOKEN" \
  -d '{
    "email": "admin@ozbox.com",
    "password": "TuPasswordSeguro123!"
  }'
```

---

## 📚 Documentación Completa

- **DEPLOYMENT.md** - Guía detallada paso a paso
- **CHECKLIST-DEPLOY.md** - Checklist completo
- **SECURITY.md** - Buenas prácticas

---

**Última actualización**: Ahora

