# OZBOX - Tienda Online

Tienda online completa con área de cliente y panel de administración, construida con Next.js 14, TypeScript, Prisma y PostgreSQL.

> **🚀 Listo para producción**: Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para desplegar en Vercel + Neon + Cloudinary

## 🚀 Características

### Área Cliente
- **Home**: Banner, categorías destacadas, productos destacados, buscador
- **Catálogo**: Grid de productos con filtros por categoría, búsqueda, ordenamiento y paginación
- **Detalle de Producto**: Galería de imágenes, información completa, selector de cantidad
- **Carrito**: Gestión de items, edición de cantidades, cálculo de totales
- **Checkout**: Formulario completo de datos de envío y método de pago
- **Pedidos**: Visualización del estado de pedidos

### Área Admin
- **Dashboard**: Métricas de ventas, pedidos por estado, productos con bajo stock
- **CRUD de Productos**: Crear, editar, eliminar productos con múltiples imágenes
- **CRUD de Categorías**: Gestión completa de categorías
- **Pedidos**: Listado con filtros, cambio de estado, detalle completo
- **Usuarios**: Listado y creación de usuarios (admin/cliente)

## 📋 Requisitos

- Node.js 18+ 
- Docker y Docker Compose (para PostgreSQL) - **Opcional**: puedes usar SQLite para desarrollo rápido
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd OZbox
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://ozbox:ozbox123@localhost:5432/ozbox?schema=public"

# NextAuth
NEXTAUTH_SECRET="tu-secret-key-aqui-genera-uno-aleatorio"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (opcional - si no se usa, las imágenes se guardan localmente)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SHIPPING_DEFAULT=5000

# Shipping
SHIPPING_DEFAULT=5000
```

**Importante**: Genera un `NEXTAUTH_SECRET` aleatorio. Puedes usar:

```bash
openssl rand -base64 32
```

### 4. Configurar Base de Datos

**Opción A: PostgreSQL con Docker (Recomendado para producción)**

Si tienes Docker instalado, ejecuta:

```bash
# Versión clásica
docker-compose up -d

# O versión moderna (Docker Desktop reciente)
docker compose up -d
```

Esto iniciará PostgreSQL en el puerto 5432 con las credenciales:
- Usuario: `ozbox`
- Contraseña: `ozbox123`
- Base de datos: `ozbox`

**Opción B: SQLite (Rápido para desarrollo, sin Docker)**

Si no tienes Docker instalado, puedes usar SQLite. **Ver instrucciones detalladas en [SETUP-SIN-DOCKER.md](./SETUP-SIN-DOCKER.md)**

Resumen rápido:
1. Edita `prisma/schema.prisma` y cambia `provider = "sqlite"` y `url = "file:./dev.db"`
2. En tu `.env`, usa `DATABASE_URL="file:./dev.db"`
3. Usa `npm run db:push` en lugar de `db:migrate` (SQLite no requiere migraciones)

### 5. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Ejecutar las migraciones
npm run db:migrate

# Poblar la base de datos con datos de ejemplo
npm run db:seed
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 👤 Usuario Admin Inicial

Después de ejecutar el seed, puedes iniciar sesión con:

- **Email**: `admin@ozbox.com`
- **Contraseña**: `Password123!`

## 📁 Estructura del Proyecto

```
OZbox/
├── app/
│   ├── (store)/          # Rutas del cliente
│   │   ├── page.tsx      # Home
│   │   ├── productos/    # Catálogo y detalle
│   │   ├── carrito/      # Carrito de compras
│   │   ├── checkout/     # Proceso de compra
│   │   └── pedidos/      # Historial de pedidos
│   ├── admin/            # Panel de administración
│   │   ├── page.tsx      # Dashboard
│   │   ├── productos/    # CRUD productos
│   │   ├── categorias/    # CRUD categorías
│   │   ├── pedidos/      # Gestión de pedidos
│   │   └── usuarios/     # Gestión de usuarios
│   ├── api/              # API Routes
│   │   ├── auth/         # NextAuth
│   │   ├── products/     # Productos
│   │   ├── categories/   # Categorías
│   │   ├── orders/       # Pedidos
│   │   ├── users/        # Usuarios
│   │   └── upload/       # Upload de imágenes
│   └── auth/              # Páginas de autenticación
├── components/            # Componentes React
│   ├── ui/               # Componentes de shadcn/ui
│   └── admin/            # Componentes del admin
├── lib/                  # Utilidades y configuraciones
├── prisma/               # Schema y seed de Prisma
├── store/                # Zustand stores
└── types/                # TypeScript types
```

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con Prisma ORM. El schema está definido en `prisma/schema.prisma`.

### Modelos principales:
- **User**: Usuarios del sistema (ADMIN/CLIENTE)
- **Category**: Categorías de productos
- **Product**: Productos con imágenes
- **Order**: Pedidos de clientes
- **OrderItem**: Items de cada pedido
- **AdminLog**: Logs de acciones del admin

## 🔐 Autenticación

El proyecto usa NextAuth con Credentials Provider. Las rutas `/admin/*` están protegidas y solo accesibles para usuarios con rol `ADMIN`.

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo

# Base de datos
npm run db:generate      # Genera el cliente de Prisma
npm run db:push          # Sincroniza el schema con la BD (sin migraciones)
npm run db:migrate       # Ejecuta las migraciones
npm run db:seed          # Ejecuta el seed
npm run db:studio        # Abre Prisma Studio

# Producción
npm run build            # Construye la aplicación
npm run start            # Inicia el servidor de producción
```

## 🖼️ Imágenes

El proyecto soporta dos métodos de almacenamiento de imágenes:

1. **Cloudinary** (recomendado para producción): Configura las variables de entorno de Cloudinary
2. **Almacenamiento local**: Las imágenes se guardan en `/public/uploads` (solo desarrollo)

## 🧪 Datos de Ejemplo

El seed crea:
- 1 usuario admin (`admin@ozbox.com`)
- 2 categorías (Electrónica, Hogar)
- 6 productos con imágenes de ejemplo

## 🚨 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que Docker esté corriendo: `docker ps`
- Verifica que el contenedor de PostgreSQL esté activo: `docker-compose ps`
- Revisa que las credenciales en `.env` coincidan con `docker-compose.yml`

### Error de migraciones
- Asegúrate de que la base de datos esté vacía o ejecuta: `npm run db:push` en lugar de `db:migrate`

### Error de NextAuth
- Verifica que `NEXTAUTH_SECRET` esté configurado en `.env`
- Asegúrate de que `NEXTAUTH_URL` coincida con la URL de tu aplicación

## 📝 Notas

- Las contraseñas se hashean con bcrypt
- El carrito se persiste en localStorage usando Zustand
- Los pedidos generan códigos únicos con formato `OZB-XXXXXX`
- El stock se descuenta automáticamente al crear un pedido
- Los cambios críticos se registran en `AdminLog`

## 🎨 Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + **shadcn/ui**
- **Prisma ORM**
- **PostgreSQL**
- **NextAuth**
- **Zustand**
- **Zod** (validación)
- **Cloudinary** (opcional, para imágenes)

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

Desarrollado con ❤️ para OZBOX

