"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCafeCategories, getRestaurantCategories } from "@/lib/data/categoryData";
import { getCategoryItems } from "@/lib/data/itemData";
import MenuItemCard from "./menuItemCard";
import MenuItemModal from "./menuItemModal";
import * as LucideIcons from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

interface category {
  id: string;
  name: string;
  enName: string;
  menu: "cafe" | "restaurant";
  description: string;
}

interface item {
  id: string;
  name: string;
  enName: string;
  description: string;
  enDescription: string;
  price: number;
  categoryId: string;
  ingredients: string;
  enIngredients: string;
  image: string;
  order: number;
  available: boolean;
}

interface categoryItems {
  [key : string] : item[]
}


// Animation variants for menu items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

// Loading spinner animation variants
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1,
      ease: "linear",
    },
  },
}

export default function MenuCategories({menu} : {menu : string}) {
  const [categories, setCategories] = useState<category[]>([]);
  const [categoryItems, setCategoryItems] = useState<categoryItems>({})
  const [selectedItem, setSelectedItem] = useState<item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(new Set())
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [modalCategoryName,setModalCategoryName] = useState<string>('')

  const {isRTL} = useLanguage()

  useEffect(() => {
    const loadCategories = async () => {
      const data = menu === "cafe" ? await getCafeCategories() : await getRestaurantCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadItemsForCategories = async () => {
      // Find categories that are open but don't have items loaded yet
      const categoriesToLoad = openCategories.filter(
        (categoryId) => !categoryItems[categoryId] && !loadingCategories.has(categoryId),
      )

      if (categoriesToLoad.length === 0) return

      // Update loading state for these categories
      const newLoadingCategories = new Set(loadingCategories)
      categoriesToLoad.forEach((categoryId) => newLoadingCategories.add(categoryId))
      setLoadingCategories(newLoadingCategories)

      // Load items for each category in parallel
      const loadPromises = categoriesToLoad.map(async (categoryId) => {
        try {
          const items = await getCategoryItems(categoryId)

          // Add category name to each item
          const currentCategory = categories.find((cat: category) => cat.id === categoryId)
          const itemsWithCategory = items.map((item: item) => ({
            ...item,
            categoryName: currentCategory ? currentCategory.name : "",
          }))

          return { categoryId, items: itemsWithCategory }
        } catch (error) {
          console.error(`Error loading items for category ${categoryId}:`, error)
          return { categoryId, items: [] }
        }
      })

      // Wait for all loading to complete
      const results = await Promise.all(loadPromises)

      // Update state with all loaded items
      const newCategoryItems = { ...categoryItems }
      results.forEach(({ categoryId, items }) => {
        newCategoryItems[categoryId] = items
      })

      setCategoryItems(newCategoryItems)

      // Update loading state
      const finalLoadingCategories = new Set(loadingCategories)
      categoriesToLoad.forEach((categoryId) => finalLoadingCategories.delete(categoryId))
      setLoadingCategories(finalLoadingCategories)
    }

    loadItemsForCategories()
  }, [openCategories, categoryItems, loadingCategories, categories])

  const handleAccordionValueChange = (value : string[]) => {
    setOpenCategories(value)
  }

  const handleItemClick = (item: item) => {
    setSelectedItem(item);
    categories.map((category) => {
      if (category.id === item.categoryId) setModalCategoryName(isRTL? category.name : category.enName)
    })
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional: delay clearing the selected item to allow for exit animations
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full" onValueChange={handleAccordionValueChange}>
        {categories.map((category) => {
          // Dynamically get the icon component if iconName exists
          // const IconComponent = category.iconName ? (LucideIcons as any)[category.iconName] : null
          
          const items = categoryItems[category.id] || []
          console.log(items)
          const isLoading = loadingCategories.has(category.id)

          return (
            <AccordionItem
              key={category.id}
              value={category.id}
              className={`rounded-sm mb-4 overflow-hidden`}
            >
              <AccordionTrigger className={`px-4 py-3 ${menu === "cafe" ? "bg-off-white text-teal-700" : "bg-text_royal_green/40 text-golden_yellow"} hover:no-underline`}>
                <div className="flex items-center gap-2">
                  {/* {IconComponent && <IconComponent className="w-5 h-5 text-amber-600" />} */}
                  <span className="font-semibold text-lg tracking-widest">{isRTL? category.name : category.enName? category.enName.toUpperCase() : ""}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className={`px-2 ${menu === "cafe" ? "bg-off-white text-text_royal_green" : "bg-text_royal_green/40 text-off-white"}`}>
                {isLoading ? (
                  <div className="py-12 flex justify-center items-center">
                  <div className="flex space-x-3">
                      <motion.div
                        variants={spinnerVariants}
                        initial="initial"
                        animate="animate"
                        className="w-5 h-5 text-teal-600 flex justify-center items-center"
                      >
                        <LucideIcons.Loader2 />
                      </motion.div>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="py-8 text-center">
                    <p>آیتمی در این دسته‌بندی وجود ندارد.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        // <motion.div
                        //   key={item.name}
                        //   variants={itemVariants}
                        //   initial="hidden"
                        //   animate="visible"
                        //   exit="hidden"
                        //   transition={{ delay: index * 0.05 }}
                        // >
                          <MenuItemCard menu={menu} item={item} onClick={handleItemClick} />
                        // </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {categories.length === 0 && (
        <div className="py-12 flex justify-center items-center">
          <div className="flex space-x-3">
            <motion.div
              variants={spinnerVariants}
              initial="initial"
              animate="animate"
              className="w-5 h-5 text-amber-500 flex justify-center items-center"
            >
              <LucideIcons.Loader2 />
            </motion.div>
          </div>
        </div>
      )}

      <MenuItemModal menu={menu} item={selectedItem} categoryName={modalCategoryName} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}