import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Página no encontrada</h2>
      <p className="mb-8 text-muted-foreground">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link href="/">
        <Button>Volver al Inicio</Button>
      </Link>
    </div>
  )
}


