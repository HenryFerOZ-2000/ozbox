# 🔒 Guía de Seguridad - OZBOX

Este documento describe las prácticas de seguridad implementadas en OZBOX y recomendaciones para mantener la aplicación segura.

---

## 🔐 Secretos y Variables de Entorno

### Nunca Commitees Secretos

**❌ NUNCA hagas esto:**
```bash
git add .env
git commit -m "Add env file"
```

**✅ HAZ esto:**
- Usa `.env.example` como plantilla
- Agrega `.env` y `.env.production` a `.gitignore`
- Configura secretos en Vercel (no en el código)

### Variables Sensibles

Las siguientes variables **NUNCA** deben estar en el código:

- `DATABASE_URL` - Contiene credenciales de la base de datos
- `NEXTAUTH_SECRET` - Secret para firmar tokens JWT
- `CLOUDINARY_API_SECRET` - Secret de Cloudinary
- `BOOTSTRAP_TOKEN` - Token para crear el primer admin

### Generación de Secrets

**Para NEXTAUTH_SECRET:**
```bash
npm run generate-secret
```

**Para BOOTSTRAP_TOKEN:**
```bash
npm run generate-secret
```

**Alternativa (OpenSSL):**
```bash
openssl rand -base64 32
```

---

## 🛡️ Autenticación y Autorización

### NextAuth Configuration

- **JWT Strategy**: Usamos JWT para sesiones (sin base de datos de sesiones)
- **Password Hashing**: bcrypt con salt rounds 10
- **Session Expiry**: Configurado por NextAuth (por defecto 30 días)

### Protección de Rutas

**Middleware (`middleware.ts`):**
- Protege todas las rutas `/admin/*`
- Solo usuarios con rol `ADMIN` pueden acceder
- Redirige a `/` si no tiene permisos

**APIs Protegidas:**
- `/api/products` (POST, PUT, DELETE) - Solo ADMIN
- `/api/categories` (POST, PUT, DELETE) - Solo ADMIN
- `/api/orders` (PUT) - Solo ADMIN
- `/api/users` (GET, POST) - Solo ADMIN
- `/api/upload` - Solo ADMIN

### Validación de Roles

Todas las APIs admin verifican el rol:
```typescript
if (!session || session.user.role !== "ADMIN") {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 })
}
```

---

## 🔒 Validación de Datos

### Zod Schemas

Todos los endpoints críticos usan Zod para validación:

- **Productos**: Valida nombre, precio, stock, categoría
- **Pedidos**: Valida datos del cliente, items, stock disponible
- **Bootstrap**: Valida email y contraseña (mínimo 8 caracteres)

### Sanitización

- **Inputs de usuario**: Validados con Zod antes de procesar
- **SQL Injection**: Prisma ORM previene inyección SQL automáticamente
- **XSS**: Next.js escapa automáticamente en JSX

---

## 🗄️ Base de Datos

### Prisma ORM

- **Prevención de SQL Injection**: Prisma usa prepared statements
- **Type Safety**: TypeScript + Prisma previene errores de tipo
- **Migrations**: Todas las migraciones están versionadas

### Contraseñas

- **Hashing**: bcrypt con 10 salt rounds
- **Nunca almacenamos** contraseñas en texto plano
- **Verificación**: `bcrypt.compare()` para validar login

---

## 📤 Upload de Imágenes

### Cloudinary (Producción)

- **HTTPS obligatorio**: Todas las imágenes se sirven por HTTPS
- **Validación de tipo**: Solo se aceptan imágenes
- **Límites**: Configura límites en Cloudinary dashboard

### Local (Solo Desarrollo)

- **Directorio**: `/public/uploads` (no se commitea)
- **Validación**: Verificación de tipo de archivo
- **Producción**: Cloudinary es obligatorio

---

## 🚨 Bootstrap del Primer Admin

### Endpoint: `/api/admin/bootstrap`

**Seguridad implementada:**

1. **Token de Bootstrap**: Requiere header `x-bootstrap-token`
2. **Una sola vez**: Solo funciona si NO existe ningún ADMIN
3. **Validación**: Email y contraseña validados con Zod
4. **Bloqueo permanente**: Después de crear el primer admin, el endpoint queda bloqueado

**Uso seguro:**
```bash
# Genera un token fuerte
npm run generate-secret

# Úsalo UNA SOLA VEZ
curl -X POST https://tu-app.vercel.app/api/admin/bootstrap \
  -H "x-bootstrap-token: TU_TOKEN_AQUI" \
  -d '{"email": "...", "password": "..."}'
```

**Después del bootstrap:**
- El endpoint queda bloqueado
- No se puede crear otro admin por este método
- Crea admins adicionales desde el panel admin (requiere ser admin)

---

## 🔍 Logging y Auditoría

### AdminLog

Todas las acciones críticas se registran:

- **Creación/Edición/Eliminación de productos**
- **Cambios de estado de pedidos**
- **Creación de usuarios admin**

**Modelo:**
```prisma
model AdminLog {
  userId    String
  action    String  // "CREATE", "UPDATE", "DELETE"
  entity    String  // "Product", "Order", etc.
  entityId  String
  metadata  Json?   // Datos adicionales
  createdAt DateTime
}
```

---

## 🌐 Headers de Seguridad

### Next.js Headers

Considera agregar headers de seguridad en `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ]
}
```

---

## ✅ Checklist de Seguridad

### Pre-Deploy

- [ ] Todos los secrets están en Vercel (no en código)
- [ ] `.env` y `.env.production` están en `.gitignore`
- [ ] `NEXTAUTH_SECRET` tiene al menos 32 caracteres
- [ ] `BOOTSTRAP_TOKEN` es único y fuerte
- [ ] Cloudinary está configurado en producción
- [ ] DATABASE_URL usa SSL (`?sslmode=require`)

### Post-Deploy

- [ ] El endpoint de bootstrap funciona y luego se bloquea
- [ ] Las rutas `/admin/*` están protegidas
- [ ] Las APIs admin requieren autenticación
- [ ] Las contraseñas se hashean correctamente
- [ ] Las imágenes se suben a Cloudinary (no al servidor)

### Mantenimiento

- [ ] Revisa logs de Vercel regularmente
- [ ] Monitorea intentos de acceso no autorizados
- [ ] Actualiza dependencias regularmente (`npm audit`)
- [ ] Revisa AdminLog para actividad sospechosa
- [ ] Cambia `BOOTSTRAP_TOKEN` si se compromete

---

## 🚨 Incidentes de Seguridad

### Si se Compromete un Secret

1. **Inmediatamente**:
   - Cambia el secret en Vercel
   - Revoca acceso si es necesario
   - Revisa logs para actividad sospechosa

2. **Para NEXTAUTH_SECRET**:
   - Todos los usuarios deberán iniciar sesión nuevamente
   - Las sesiones existentes se invalidarán

3. **Para BOOTSTRAP_TOKEN**:
   - Si ya se usó, no hay problema (el endpoint está bloqueado)
   - Si no se usó, genera uno nuevo

### Reportar Vulnerabilidades

Si encuentras una vulnerabilidad:
1. **NO** la publiques públicamente
2. Contacta al equipo de desarrollo
3. Proporciona detalles específicos

---

## 📚 Recursos Adicionales

- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Prisma Security](https://www.prisma.io/docs/guides/security)
- [NextAuth Security](https://next-auth.js.org/configuration/options#security)

---

## 🔄 Actualizaciones de Seguridad

### Dependencias

Revisa regularmente:
```bash
npm audit
npm audit fix
```

### Prisma

Mantén Prisma actualizado:
```bash
npm update @prisma/client prisma
```

### Next.js

Mantén Next.js actualizado:
```bash
npm update next
```

---

**Última actualización**: Enero 2024

