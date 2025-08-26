"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function MenuItemCard({
  menu,
  item,
  onClick,
}: {
  menu: string;
  item: item;
  onClick: (item: item) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { isRTL } = useLanguage()

  return (
    <motion.div
      className={`flex items-center gap-2 p-2 rounded-sm  ${menu === "cafe" ? "bg-white shadow-sm text-text_royal_green" : "bg-regal_green text-off-white"} hover:shadow-md transition-shadow cursor-pointer`}
      whileHover={{ y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(item)}
    >
      <div className="relative h-20 w-20 rounded-sm overflow-hidden flex-shrink-0">
        <Image
          src={item.image || "/placeholder.svg?height=80&width=80"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="112px"
        />
        <motion.div
          className="absolute inset-0 bg-amber-500 mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="space-y-2 flex-1">
        <div className={`flex justify-between items-center ${menu === "cafe" ? "text-teal-700" : "text-white"}`}>
          <h2 className="font-bold text-base tracking-wider">{isRTL? item.name : item.enName}</h2>
          {item.available ? 
            <h3 className="font-semibold">{isRTL? formatCurrency(item.price) : `${Intl.NumberFormat().format(item.price)}T`}</h3> :
            <h3 className="font-semibold font-ravi text-gray-400">{isRTL? "ناموجود" : "n/a"}</h3>
          }
        </div>
        <p className="text-sm line-clamp-2 font-ravi">
          {isRTL? item.description : item.enDescription}
        </p>
        {item.ingredients && (
          <p className="text-xs font-ravi">
            ({isRTL? item.ingredients : item.enIngredients})
          </p>
        )}
      </div>
    </motion.div>
  );
}