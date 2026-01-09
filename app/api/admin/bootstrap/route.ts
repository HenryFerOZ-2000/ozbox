import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const bootstrapSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
})

/**
 * Endpoint para crear el primer usuario ADMIN en producción
 * Solo funciona si NO existe ningún ADMIN en la base de datos
 * Requiere header: x-bootstrap-token que debe coincidir con BOOTSTRAP_TOKEN
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar token de bootstrap
    const token = request.headers.get("x-bootstrap-token")
    const expectedToken = process.env.BOOTSTRAP_TOKEN

    if (!expectedToken) {
      return NextResponse.json(
        { error: "BOOTSTRAP_TOKEN no configurado en el servidor" },
        { status: 500 }
      )
    }

    if (token !== expectedToken) {
      return NextResponse.json(
        { error: "Token de bootstrap inválido" },
        { status: 401 }
      )
    }

    // Verificar que NO exista ningún ADMIN
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })

    if (existingAdmin) {
      return NextResponse.json(
        {
          error: "Ya existe un usuario ADMIN. El bootstrap solo funciona cuando no hay admins.",
          message: "Este endpoint queda bloqueado después de crear el primer admin.",
        },
        { status: 403 }
      )
    }

    // Validar body
    const body = await request.json()
    const data = bootstrapSchema.parse(body)

    // Verificar que el email no esté en uso
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      )
    }

    // Crear el primer ADMIN
    const passwordHash = await bcrypt.hash(data.password, 10)

    const admin = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: "ADMIN",
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Usuario ADMIN creado exitosamente",
      user: admin,
      warning: "Este endpoint ya no funcionará. Guarda tus credenciales de forma segura.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error en bootstrap:", error)
    return NextResponse.json(
      { error: "Error al crear el usuario admin" },
      { status: 500 }
    )
  }
}

