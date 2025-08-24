"use client"

import React from "react"
import { useState, useEffect, FormEvent } from "react"
import { Plus, Save, X } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { 
  getCafeCategories,
  getRestaurantCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  reorderCategories 
} from "@/lib/data/categoryData"
import { useToast } from "@/components/ui/toastContext"
import SortableCategoryItem from "./sortableCategoryItem"
import MenuSelector from "./menuSelector"

interface category {
    id: string, 
    name: string,
    menu: "cafe" | "restaurant",
    order: number
}

type FormCategory = {
  name: string
  menu: "cafe" | "restaurant"
}

export default function CategoryManager() {
  const [cafeCategories, setCafeCategories] = useState<category[]>([])
  const [restaurantCategories, setRestaurantCategories] = useState<category[]>([])
  const [newCategory, setNewCategory] = useState<FormCategory>({ name: "", menu: "restaurant"})
  const [editingId, setEditingId] = useState<string>("")
  const [editForm, setEditForm] = useState<FormCategory>({ name: "", menu: "restaurant"})
  const [isReordering, setIsReordering] = useState(false)

  // Set up sensors for drag and drop with improved mobile support
  const sensors = useSensors(
    // PointerSensor works for both mouse and touch on modern browsers
    useSensor(PointerSensor, {
      activationConstraint: {
        // distance: 8, // 8px movement required before drag starts
        delay: 100, // Shorter delay for better responsiveness
        tolerance: 10, // Higher tolerance for Android touch jitter
      },
    }),
    // Add TouchSensor as a fallback for older mobile browsers
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0, // No delay for Android
        tolerance: 15, // Higher tolerance for Android touch events
      },
    }),
    // Keep keyboard support for accessibility
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    setNewCategory({ name: "", menu: "restaurant"})
  }, [cafeCategories, ])

  const loadCategories = async () => {
    const cafeData = await getCafeCategories()
    cafeData.sort((a: category, b: category) => (a.order || 0) - (b.order || 0))
    setCafeCategories(cafeData)

    const restaurantData = await getRestaurantCategories()
    restaurantData.sort((a: category, b: category) => (a.order || 0) - (b.order || 0))
    setRestaurantCategories(restaurantData)
  }

  const { toast } = useToast()

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await createCategory(newCategory)
      setNewCategory({ name: "", menu: "restaurant"})
      await loadCategories()
      toast({
        title: "دسته‌بندی‌ ایجاد شد!",
        description: `${newCategory.name} به منو اضافه شد.`,
      })
    } catch (error: any) {
      toast({
        title: "خطا در ایجاد دسته‌بندی‌!",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (category: category) => {
    setEditingId(category.id)
    setEditForm({ name: category.name, menu: category.menu})
  }

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await updateCategory(editingId, {...editForm, _id: editingId})
      setEditingId("")
      loadCategories()
      toast({
        title: "دسته‌بندی‌ به‌روزرسانی شد!",
        description: `${editForm.name} به‌روزرسانی شد.`,
      })
    } catch (error: any) {
      toast({
        title: "خطا در به‌روزرسانی دسته‌بندی‌!",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`از حذف "${name}" مطمئنید؟`)) {
      try {
        await deleteCategory(id)
        loadCategories()
        toast({
          title: "دسته‌بندی‌ حذف شد!",
          description: `${name} از منو حذف شد.`,
        })
      } catch (error: any) {
        toast({
          title: "خطا در حذف دسته‌بندی‌!",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleCafeDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setIsReordering(true)

      try {
        // Calculate the new order of categories
        const oldIndex = cafeCategories.findIndex((item) => item.id === active.id)
        const newIndex = cafeCategories.findIndex((item) => item.id === over.id)

        // Create the new array with the updated order
        const updatedCategories = arrayMove([...cafeCategories], oldIndex, newIndex)

        // Update the local state for immediate feedback
        setCafeCategories(updatedCategories)

        // Get the ordered IDs from the updated array
        const orderedIds = updatedCategories.map((category) => category.id)

        // Save the new order to the database
        await reorderCategories(orderedIds)

        toast({
          title: "ترتیب دسته‌بندی‌ها تغییر یافت!",
          description: "",
        })
      } catch (error: any) {
        // If there's an error, reload the original order
        loadCategories()

        toast({
          title: "خطا در تغییر ترتیب دسته‌بندی‌ها!",
          description: error.message || "",
          variant: "destructive",
        })
      } finally {
        setIsReordering(false)
      }
    }
  }

  const handleRestaurantDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setIsReordering(true)

      try {
        // Calculate the new order of categories
        const oldIndex = restaurantCategories.findIndex((item) => item.id === active.id)
        const newIndex = restaurantCategories.findIndex((item) => item.id === over.id)

        // Create the new array with the updated order
        const updatedCategories = arrayMove([...restaurantCategories], oldIndex, newIndex)

        // Update the local state for immediate feedback
        setRestaurantCategories(updatedCategories)

        // Get the ordered IDs from the updated array
        const orderedIds = updatedCategories.map((category) => category.id)

        // Save the new order to the database
        await reorderCategories(orderedIds)

        toast({
          title: "ترتیب دسته‌بندی‌ها تغییر یافت!",
          description: "",
        })
      } catch (error: any) {
        // If there's an error, reload the original order
        loadCategories()

        toast({
          title: "خطا در تغییر ترتیب دسته‌بندی‌ها!",
          description: error.message || "",
          variant: "destructive",
        })
      } finally {
        setIsReordering(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateSubmit} className="space-y-4 p-4 border border-slate-200 rounded-lg bg-white">
        <h3 className="font-medium font-doran">افزودن دسته‌بندی جدید</h3>
        <div dir="rtl" className="grid gap-4 sm:grid-cols-2 font-ravi">
          <div>
            <Input
              placeholder="عنوان دسته‌بندی"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
          </div>
          <div>
            <MenuSelector
              value={newCategory.menu}
              onChange={(menu) => setNewCategory({ ...newCategory, menu: menu === "cafe" ? "cafe" : "restaurant"})}
            />
          </div>
        </div>
        <div className="flex font-ravi">
          <Button type="submit" className="bg-golden_yellow hover:bg-amber-600">
            <Plus className="w-4 h-4" />
            افزودن دسته‌بندی
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCafeDragEnd}>
          <SortableContext items={cafeCategories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
            {cafeCategories.map((category) =>
              editingId === category.id ? (
                <Card key={category.id} className="overflow-hidden mb-3">
                  <CardContent className="p-0">
                    <form onSubmit={handleUpdateSubmit} className="p-4 space-y-4">
                      <div dir="rtl" className="grid gap-4 sm:grid-cols-2 font-ravi">
                        <div>
                          <Input
                            placeholder="عنوان دسته‌بندی"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <MenuSelector
                            value={editForm.menu}
                            onChange={(menu) => setEditForm({ ...editForm, menu: menu === "cafe" ? "cafe" : "restaurant"})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 font-ravi">
                        <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
                          <Save className="w-4 h-4 mr-2" />
                          ذخیره
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="bg-golden_yellow/40" onClick={() => setEditingId("")}>
                          <X className="w-4 h-4 mr-2" />
                          لغو
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <SortableCategoryItem
                  key={category.id}
                  category={category}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  sortDisabled={editingId !== ""}
                />
              ),
            )}
          </SortableContext>
        </DndContext>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleRestaurantDragEnd}>
          <SortableContext items={restaurantCategories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
            {restaurantCategories.map((category) =>
              editingId === category.id ? (
                <Card key={category.id} className="overflow-hidden mb-3">
                  <CardContent className="p-0">
                    <form onSubmit={handleUpdateSubmit} className="p-4 space-y-4">
                      <div dir="rtl" className="grid gap-4 sm:grid-cols-2 font-ravi">
                        <div>
                          <Input
                            placeholder="عنوان دسته‌بندی"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <MenuSelector
                            value={editForm.menu}
                            onChange={(menu) => setEditForm({ ...editForm, menu: menu === "cafe" ? "cafe" : "restaurant"})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 font-ravi">
                        <Button type="submit" size="sm" className="bg-green-500 hover:bg-green-600">
                          <Save className="w-4 h-4 mr-2" />
                          ذخیره
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="bg-golden_yellow/40" onClick={() => setEditingId("")}>
                          <X className="w-4 h-4 mr-2" />
                          لغو
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <SortableCategoryItem
                  key={category.id}
                  category={category}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  sortDisabled={editingId !== ""}
                />
              ),
            )}
          </SortableContext>
        </DndContext>
        {isReordering && (
          <div className="flex justify-center py-2">
            <p className="text-sm text-amber-600 font-ravi">ذخیره ترتیب جدید...</p>
          </div>
        )}
      </div>
    </div>
  )
}

