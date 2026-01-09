import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">OZBOX</h3>
            <p className="text-sm text-muted-foreground">
              Tu tienda online de confianza. Encuentra los mejores productos al mejor precio.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="text-muted-foreground hover:text-foreground">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-muted-foreground hover:text-foreground">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <p className="text-sm text-muted-foreground">
              Email: info@ozbox.com
              <br />
              Teléfono: +57 300 123 4567
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OZBOX. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}


