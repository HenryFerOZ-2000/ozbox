# Configuración Rápida sin Docker (SQLite)

Si no tienes Docker instalado, puedes usar SQLite para desarrollo. Es más rápido de configurar pero tiene algunas limitaciones.

## Pasos Rápidos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar SQLite

Edita `prisma/schema.prisma` y cambia el datasource:

```prisma
datasource db {
  provider = "sqlite"  // Cambia de "postgresql" a "sqlite"
  url      = "file:./dev.db"
}
```

### 3. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="tu-secret-key-aqui-genera-uno-aleatorio"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SHIPPING_DEFAULT=5000

# Shipping
SHIPPING_DEFAULT=5000
```

**Genera NEXTAUTH_SECRET** (en PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear la base de datos y tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 5. Iniciar el servidor

```bash
npm run dev
```

¡Listo! La aplicación estará en http://localhost:3000

## Credenciales Admin

- Email: `admin@ozbox.com`
- Contraseña: `Password123!`

## Notas sobre SQLite

- ✅ Perfecto para desarrollo
- ✅ No requiere Docker
- ✅ Configuración rápida
- ❌ No soporta algunas características avanzadas de PostgreSQL
- ❌ No recomendado para producción

## Volver a PostgreSQL

Si más adelante quieres usar PostgreSQL:

1. Instala Docker Desktop
2. Cambia `prisma/schema.prisma` de vuelta a `provider = "postgresql"`
3. Actualiza `.env` con la URL de PostgreSQL
4. Ejecuta `docker-compose up -d`
5. Ejecuta `npm run db:push` o `npm run db:migrate`


