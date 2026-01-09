import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed...")

  const isProduction = process.env.NODE_ENV === "production"

  // Solo crear admin en desarrollo
  if (!isProduction) {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash("Password123!", 10)
      const admin = await prisma.user.upsert({
        where: { email: "admin@ozbox.com" },
        update: {},
        create: {
          email: "admin@ozbox.com",
          passwordHash: adminPassword,
          role: "ADMIN",
        },
      })
      console.log("✅ Usuario admin demo creado:", admin.email)
    } else {
      console.log("ℹ️  Ya existe un usuario admin, omitiendo creación")
    }
  } else {
    console.log("ℹ️  Modo producción: no se crea admin automáticamente")
    console.log("📋 Usa el endpoint /api/admin/bootstrap para crear el primer admin")
  }

  // Crear categorías (idempotente)
  const categoria1 = await prisma.category.upsert({
    where: { slug: "electronica" },
    update: {},
    create: {
      name: "Electrónica",
      slug: "electronica",
    },
  })

  const categoria2 = await prisma.category.upsert({
    where: { slug: "hogar" },
    update: {},
    create: {
      name: "Hogar",
      slug: "hogar",
    },
  })
  console.log("✅ Categorías verificadas/creadas")

  // Crear productos demo (idempotente)
  const productos = [
    {
      name: "Smartphone Pro Max",
      slug: "smartphone-pro-max",
      description: "El smartphone más avanzado con pantalla AMOLED de 6.7 pulgadas, procesador de última generación y cámara de 108MP.",
      price: 899000,
      salePrice: 799000,
      stock: 15,
      status: "ACTIVO" as const,
      categoryId: categoria1.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
          order: 0,
        },
      ],
    },
    {
      name: "Laptop Ultra Slim",
      slug: "laptop-ultra-slim",
      description: "Laptop ultradelgada con procesador Intel i7, 16GB RAM, SSD 512GB y pantalla Full HD de 14 pulgadas.",
      price: 1299000,
      stock: 8,
      status: "ACTIVO" as const,
      categoryId: categoria1.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
          order: 0,
        },
      ],
    },
    {
      name: "Auriculares Inalámbricos",
      slug: "auriculares-inalambricos",
      description: "Auriculares con cancelación de ruido activa, batería de 30 horas y calidad de sonido Hi-Fi.",
      price: 299000,
      salePrice: 249000,
      stock: 25,
      status: "ACTIVO" as const,
      categoryId: categoria1.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
          order: 0,
        },
      ],
    },
    {
      name: "Sofá Moderno 3 Plazas",
      slug: "sofa-moderno-3-plazas",
      description: "Sofá cómodo y elegante con tapizado en tela de alta calidad, perfecto para tu sala de estar.",
      price: 1599000,
      stock: 5,
      status: "ACTIVO" as const,
      categoryId: categoria2.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
          order: 0,
        },
      ],
    },
    {
      name: "Mesa de Comedor Extensible",
      slug: "mesa-comedor-extensible",
      description: "Mesa de comedor de madera maciza con capacidad para 6-8 personas, diseño moderno y funcional.",
      price: 899000,
      stock: 3,
      status: "ACTIVO" as const,
      categoryId: categoria2.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
          order: 0,
        },
      ],
    },
    {
      name: "Lámpara de Pie LED",
      slug: "lampara-pie-led",
      description: "Lámpara de pie con tecnología LED, regulador de intensidad y diseño minimalista.",
      price: 149000,
      salePrice: 119000,
      stock: 12,
      status: "ACTIVO" as const,
      categoryId: categoria2.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
          order: 0,
        },
      ],
    },
  ]

  let created = 0
  let skipped = 0

  for (const producto of productos) {
    const { images, ...productData } = producto
    const existing = await prisma.product.findUnique({
      where: { slug: producto.slug },
    })

    if (!existing) {
      await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images,
          },
        },
      })
      created++
      console.log(`✅ Producto creado: ${producto.name}`)
    } else {
      skipped++
      console.log(`ℹ️  Producto ya existe: ${producto.name}`)
    }
  }

  console.log(`\n🎉 Seed completado! (${created} creados, ${skipped} existentes)`)
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
