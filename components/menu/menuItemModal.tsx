"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"


interface item {
  id: string;
  name: string;
  description: string;
  price: number;
  // categoryName: string;
  ingredients: string;
  image: string;
  order: number;
}

interface MenuItemModalProps {
  item: item | null
  categoryName: string
  isOpen: boolean
  onClose: () => void
}

export default function MenuItemModal({ item, categoryName, isOpen, onClose }: MenuItemModalProps) {
  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-lg">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="relative w-full h-[200px] sm:h-[250px]">
                <Image
                  src={item.image || "/placeholder.svg?height=250&width=500"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                />
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/90 text-qqorange"
                  >
                  </Button>
                </DialogClose>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex w-full justify-between">
                      <DialogTitle className="flex items-center gap-1 text-qqdarkbrown">
                        {item.name}
                      </DialogTitle>        
                      <h3 className="font-semibold text-qqdarkbrown">{formatCurrency(item.price)}</h3>
                    </div>
                  </div>

                  <motion.p
                    className="text-qqbrown px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.description}
                  </motion.p>
                </div>
                {item.ingredients && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-base text-qqbrown px-2.5">({item.ingredients})</p>
                  </motion.div>
                )}

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant="outline" className="text-qqteal border-qqteal">
                    {categoryName || "آیتم منو"}
                  </Badge>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}