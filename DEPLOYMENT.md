# 🚀 Guía de Despliegue - OZBOX a Producción

Esta guía te llevará paso a paso para desplegar OZBOX en **Vercel** con **Neon Postgres** y **Cloudinary**.

---

## 📋 Checklist Pre-Deploy

- [ ] Repositorio en GitHub
- [ ] Cuenta en Vercel
- [ ] Cuenta en Neon (Postgres serverless)
- [ ] Cuenta en Cloudinary
- [ ] Variables de entorno preparadas

---

## Paso A: Crear Base de Datos en Neon

1. Ve a [https://neon.tech](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto:
   - Nombre: `ozbox` (o el que prefieras)
   - Región: Elige la más cercana a tus usuarios
   - PostgreSQL: Versión más reciente
3. Una vez creado, copia la **Connection String**:
   - Formato: `postgresql://usuario:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require`
   - **Guarda esta URL**, la necesitarás en Vercel

---

## Paso B: Configurar Cloudinary

1. Ve a [https://cloudinary.com](https://cloudinary.com) y crea una cuenta gratuita
2. En el Dashboard, ve a **Settings** > **Security**
3. Copia las siguientes credenciales:
   - **Cloud Name** (ej: `dxxxxx`)
   - **API Key** (ej: `123456789012345`)
   - **API Secret** (ej: `xxxxxxxxxxxxxxxxxxxxx`)
4. **Guarda estas credenciales**, las necesitarás en Vercel

---

## Paso C: Subir Repositorio a GitHub

1. Si aún no tienes el repo en GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - OZBOX ready for production"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/ozbox.git
   git push -u origin main
   ```

2. Si ya está en GitHub, asegúrate de que todo esté actualizado:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push
   ```

---

## Paso D: Importar Proyecto en Vercel

1. Ve a [https://vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **Add New** > **Project**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js
5. **NO hagas clic en Deploy aún**, primero configuraremos las variables de entorno

---

## Paso E: Configurar Environment Variables en Vercel

En la página de configuración del proyecto en Vercel:

1. Ve a **Settings** > **Environment Variables**
2. Agrega las siguientes variables (una por una):

### Variables Obligatorias:

```env
DATABASE_URL
```
**Valor**: La Connection String de Neon que copiaste en el Paso A
```
postgresql://usuario:password@ep-xxxxx.region.aws.neon.tech/database?sslmode=require
```

```env
NEXTAUTH_SECRET
```
**Valor**: Genera uno con:
```bash
npm run generate-secret
```
O usa:
```bash
openssl rand -base64 32
```

```env
NEXTAUTH_URL
```
**Valor**: La URL de tu aplicación (se actualizará después del primer deploy)
```
https://tu-app.vercel.app
```

```env
CLOUDINARY_CLOUD_NAME
```
**Valor**: El Cloud Name de Cloudinary del Paso B

```env
CLOUDINARY_API_KEY
```
**Valor**: El API Key de Cloudinary del Paso B

```env
CLOUDINARY_API_SECRET
```
**Valor**: El API Secret de Cloudinary del Paso B

```env
BOOTSTRAP_TOKEN
```
**Valor**: Genera uno con:
```bash
npm run generate-secret
```
Este token se usa UNA SOLA VEZ para crear el primer admin.

```env
NEXT_PUBLIC_SITE_URL
```
**Valor**: La URL de tu aplicación
```
https://tu-app.vercel.app
```

```env
NEXT_PUBLIC_SHIPPING_DEFAULT
```
**Valor**: Costo de envío por defecto (en centavos)
```
5000
```

```env
SHIPPING_DEFAULT
```
**Valor**: Mismo que el anterior
```
5000
```

### Configuración de Entornos:

- Marca todas las variables para **Production**, **Preview** y **Development**
- Haz clic en **Save** después de agregar cada variable

---

## Paso F: Deploy

1. Ve a la pestaña **Deployments**
2. Haz clic en **Deploy** (o espera a que se despliegue automáticamente)
3. Vercel ejecutará:
   - `npm install`
   - `prisma generate` (postinstall)
   - `prisma migrate deploy` (en build)
   - `next build`
4. Espera a que el deploy termine (2-5 minutos)
5. Una vez completado, copia la URL de tu aplicación (ej: `https://ozbox.vercel.app`)

---

## Paso G: Crear el Primer Admin (Bootstrap)

**IMPORTANTE**: Este paso solo funciona UNA VEZ, cuando no existe ningún admin.

1. Abre una terminal y ejecuta:

```bash
curl -X POST https://tu-app.vercel.app/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-token: TU_BOOTSTRAP_TOKEN_AQUI" \
  -d '{
    "email": "admin@ozbox.com",
    "password": "TuPasswordSeguro123!"
  }'
```

**Reemplaza**:
- `https://tu-app.vercel.app` por tu URL de Vercel
- `TU_BOOTSTRAP_TOKEN_AQUI` por el valor de `BOOTSTRAP_TOKEN` que configuraste
- `admin@ozbox.com` por el email que quieras para el admin
- `TuPasswordSeguro123!` por una contraseña segura

2. Si todo está bien, recibirás una respuesta como:
```json
{
  "success": true,
  "message": "Usuario ADMIN creado exitosamente",
  "user": {
    "id": "...",
    "email": "admin@ozbox.com",
    "role": "ADMIN"
  },
  "warning": "Este endpoint ya no funcionará. Guarda tus credenciales de forma segura."
}
```

3. **Guarda tus credenciales de forma segura**. Este endpoint ya no funcionará.

---

## Paso H: Verificación Post-Deploy

### 1. Verificar que la tienda carga

- Visita: `https://tu-app.vercel.app`
- Debe mostrar la página principal con productos
- Visita: `https://tu-app.vercel.app/productos`
- Debe mostrar el catálogo

### 2. Verificar que el admin está protegido

- Visita: `https://tu-app.vercel.app/admin`
- Debe redirigirte o mostrar error de acceso denegado
- **NO** debe mostrar el dashboard sin login

### 3. Verificar login de admin

- Visita: `https://tu-app.vercel.app/auth/login`
- Inicia sesión con las credenciales que creaste en el Paso G
- Debe redirigirte al dashboard admin

### 4. Verificar creación de producto con imagen

- En el admin, ve a **Productos** > **Nuevo Producto**
- Completa el formulario
- Sube una imagen
- La imagen debe subirse a Cloudinary y mostrarse correctamente
- Guarda el producto

### 5. Verificar checkout y pedidos

- Como cliente, agrega productos al carrito
- Completa el checkout
- Debe crear un pedido exitosamente
- El stock debe descontarse
- En el admin, el pedido debe aparecer en **Pedidos**

---

## 🔧 Troubleshooting

### Error: "Cloudinary no está configurado"

**Solución**: Verifica que todas las variables de Cloudinary estén configuradas en Vercel y que estén marcadas para **Production**.

### Error: "DATABASE_URL no válida"

**Solución**: 
- Verifica que la URL de Neon incluya `?sslmode=require`
- Asegúrate de que la base de datos esté activa en Neon
- Verifica que no haya espacios extra en la variable

### Error: "NEXTAUTH_SECRET debe tener al menos 32 caracteres"

**Solución**: Genera un nuevo secret con `npm run generate-secret` y actualízalo en Vercel.

### El bootstrap no funciona

**Posibles causas**:
- Ya existe un admin en la base de datos
- El token `x-bootstrap-token` no coincide con `BOOTSTRAP_TOKEN`
- El endpoint está mal escrito

**Solución**: Verifica el token y asegúrate de que no exista ningún admin en la DB.

### Las imágenes no se suben

**Solución**: 
- Verifica las credenciales de Cloudinary en Vercel
- Revisa los logs de Vercel para ver errores específicos
- Asegúrate de que `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` estén configuradas

---

## 📝 Notas Importantes

1. **Nunca commitees** archivos `.env` o `.env.production` al repositorio
2. **El endpoint de bootstrap** solo funciona una vez. Después de crear el primer admin, queda bloqueado
3. **Guarda tus credenciales** de forma segura (password manager)
4. **Monitorea los logs** en Vercel para detectar errores
5. **Backup de Neon**: Configura backups automáticos en Neon para producción

---

## ✅ Checklist Post-Deploy

- [ ] La tienda carga correctamente
- [ ] El admin está protegido
- [ ] Puedo iniciar sesión como admin
- [ ] Puedo crear productos con imágenes
- [ ] Las imágenes se suben a Cloudinary
- [ ] Puedo crear pedidos como cliente
- [ ] Los pedidos aparecen en el admin
- [ ] El stock se descuenta correctamente

---

## 🎉 ¡Listo!

Tu aplicación OZBOX está desplegada y funcionando en producción. 

**Próximos pasos recomendados**:
- Configurar dominio personalizado en Vercel
- Configurar backups en Neon
- Configurar monitoreo y alertas
- Revisar [SECURITY.md](./SECURITY.md) para mejores prácticas de seguridad

