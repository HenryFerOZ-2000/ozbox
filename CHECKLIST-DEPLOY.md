# ✅ Checklist de Despliegue - OZBOX

Usa este checklist para asegurarte de que todo está listo antes y después del deploy.

---

## 📋 Pre-Deploy

### Repositorio
- [ ] Código subido a GitHub
- [ ] `.env` y `.env.production` NO están en el repo
- [ ] `.gitignore` está actualizado
- [ ] Último commit sin errores

### Servicios Externos
- [ ] **Neon Postgres**: Proyecto creado, DATABASE_URL copiada
- [ ] **Cloudinary**: Cuenta creada, credenciales copiadas
- [ ] **Vercel**: Cuenta creada, proyecto importado

### Variables de Entorno
- [ ] `DATABASE_URL` - Connection string de Neon
- [ ] `NEXTAUTH_SECRET` - Generado con `npm run generate-secret`
- [ ] `NEXTAUTH_URL` - URL de producción
- [ ] `CLOUDINARY_CLOUD_NAME` - De Cloudinary
- [ ] `CLOUDINARY_API_KEY` - De Cloudinary
- [ ] `CLOUDINARY_API_SECRET` - De Cloudinary
- [ ] `BOOTSTRAP_TOKEN` - Generado con `npm run generate-secret`
- [ ] `NEXT_PUBLIC_SITE_URL` - URL de producción
- [ ] `NEXT_PUBLIC_SHIPPING_DEFAULT` - Valor numérico (ej: 5000)
- [ ] `SHIPPING_DEFAULT` - Mismo valor que el anterior

### Verificación Local
- [ ] `npm install` ejecuta sin errores
- [ ] `npm run verify` pasa todos los checks
- [ ] `npm run dev` inicia correctamente
- [ ] La aplicación funciona en local

---

## 🚀 Deploy

### En Vercel
- [ ] Todas las variables de entorno configuradas
- [ ] Variables marcadas para Production, Preview y Development
- [ ] Deploy iniciado
- [ ] Build completado sin errores
- [ ] URL de producción obtenida

### Post-Deploy
- [ ] URL actualizada en `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL`
- [ ] Redeploy ejecutado (si fue necesario actualizar URLs)

---

## 🔐 Bootstrap del Primer Admin

- [ ] Token `BOOTSTRAP_TOKEN` generado y configurado
- [ ] Endpoint `/api/admin/bootstrap` ejecutado exitosamente
- [ ] Respuesta exitosa recibida
- [ ] Credenciales del admin guardadas de forma segura
- [ ] Endpoint verificado que ya no funciona (bloqueado)

---

## ✅ Verificación Post-Deploy

### Tienda (Cliente)
- [ ] `/` - Página principal carga correctamente
- [ ] `/productos` - Catálogo muestra productos
- [ ] `/productos/[slug]` - Detalle de producto funciona
- [ ] `/carrito` - Carrito funciona
- [ ] `/checkout` - Checkout funciona
- [ ] Crear pedido funciona y descuenta stock

### Admin
- [ ] `/admin` - Redirige o bloquea sin login
- [ ] `/auth/login` - Login funciona
- [ ] Login con credenciales del bootstrap funciona
- [ ] `/admin` - Dashboard carga después del login
- [ ] `/admin/productos` - Lista de productos funciona
- [ ] Crear producto funciona
- [ ] Subir imagen funciona (se sube a Cloudinary)
- [ ] Editar producto funciona
- [ ] Eliminar producto funciona
- [ ] `/admin/categorias` - CRUD de categorías funciona
- [ ] `/admin/pedidos` - Lista de pedidos funciona
- [ ] Cambiar estado de pedido funciona
- [ ] `/admin/usuarios` - Lista de usuarios funciona

### Funcionalidades Críticas
- [ ] Imágenes se suben a Cloudinary (no al servidor)
- [ ] Stock se descuenta al crear pedido
- [ ] Pedidos se crean correctamente
- [ ] Logs de admin se registran

---

## 🔍 Troubleshooting

Si algo falla, revisa:

1. **Logs de Vercel**: Settings > Logs
2. **Variables de entorno**: Verifica que todas estén configuradas
3. **Base de datos**: Verifica conexión en Neon dashboard
4. **Cloudinary**: Verifica credenciales en Cloudinary dashboard

---

## 📝 Notas Finales

- ✅ Todo funcionando
- ⚠️ Problemas menores (anotar)
- ❌ Problemas críticos (anotar)

**Fecha de deploy**: _______________
**URL de producción**: _______________
**Admin creado**: _______________

---

¡Deploy completado! 🎉

