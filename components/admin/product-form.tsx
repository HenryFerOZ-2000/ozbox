"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface ProductFormProps {
  product?: {
    id: string
    name: string
    description: string
    price: number
    salePrice: number | null
    stock: number
    status: string
    categoryId: string
    images: Array<{ url: string; publicId?: string; order: number }>
  }
  categories: Array<{ id: string; name: string }>
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    salePrice: product?.salePrice || "",
    stock: product?.stock || 0,
    status: product?.status || "ACTIVO",
    categoryId: product?.categoryId || "",
    images: product?.images || [],
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { url: data.url, publicId: data.publicId, order: prev.images.length },
          ],
        }))
      } else {
        toast({
          title: "Error",
          description: "Error al subir la imagen",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive",
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock),
        images: formData.images.map((img: { url: string; publicId?: string; order: number }, index: number) => ({
          ...img,
          order: index,
        })),
      }

      const url = product ? `/api/products/${product.id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: product ? "Producto actualizado" : "Producto creado",
        })
        onSuccess()
      } else {
        throw new Error(data.error || "Error al guardar el producto")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al guardar el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="categoryId">Categoría *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="salePrice">Precio de Oferta</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.salePrice}
            onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Estado *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVO">Activo</SelectItem>
              <SelectItem value="BORRADOR">Borrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción *</Label>
        <textarea
          id="description"
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Imágenes</Label>
        <div className="mt-2 grid grid-cols-4 gap-4">
          {formData.images.map((image: { url: string; publicId?: string; order: number }, index: number) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
              <Image src={image.url} alt={`Imagen ${index + 1}`} fill className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.images.length < 10 && (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted">
              <Upload className="h-6 w-6" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : product ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}


