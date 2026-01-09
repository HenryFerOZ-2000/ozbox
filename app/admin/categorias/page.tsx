"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({ name: "" })
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      if (res.ok) {
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : "/api/categories"
    const method = editingCategory ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast({
          title: editingCategory ? "Categoría actualizada" : "Categoría creada",
        })
        setShowDialog(false)
        setFormData({ name: "" })
        setEditingCategory(null)
        fetchCategories()
      } else {
        throw new Error("Error al guardar la categoría")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar la categoría",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Categoría eliminada" })
        fetchCategories()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar la categoría",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({ name: category.name })
    setShowDialog(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({ name: "" })
    setShowDialog(true)
  }

  if (loading) {
    return <div className="p-8">Cargando categorías...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Categorías</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifica el nombre de la categoría"
                : "Ingresa el nombre de la nueva categoría"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false)
                  setEditingCategory(null)
                  setFormData({ name: "" })
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingCategory ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


