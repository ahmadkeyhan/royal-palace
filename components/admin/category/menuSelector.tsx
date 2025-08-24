"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const menus = ["restaurant", "cafe"];

interface MenuSelector {
  value: string;
  onChange: (value: string) => void;
}

export default function MenuSelector({ value, onChange }: MenuSelector) {
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string>(value || "");

  useEffect(() => {
    if (value) {
      console.log(value);
      setSelectedMenu(value);
    }
  }, [value]);

  const handleSelect = (menu: string) => {
    if (typeof menu === "string") {
      setSelectedMenu(menu);
      onChange(menu);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full flex-row justify-between bg-amber-50 border-amber-200"
        >
          <div dir="rtl" className="flex items-start gap-2 font-ravi">
            {selectedMenu.length > 0 ? (
              <>
                <div className="w-4 h-4 rounded-full" />
                <span>{selectedMenu === "cafe" ? "کافه" : "رستوران"}</span>
              </>
            ) : (
              "انتخاب رنگ(اختیاری)"
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup className=" overflow-y-auto">
              {/* <div
                className="flex items-center gap-2 px-2 py-1.5 text-base rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect("")}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    !selectedMenu ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>بدون رنگ</span>
              </div> */}
              {menus.map((menu) => {
                return (
                  <div
                    key={menu}
                    className="flex items-center gap-2 font-ravi px-2 py-1.5 text-base rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(menu)}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedMenu === menu
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className={`w-4 h-4 rounded-full`} />
                    <span>{menu === "cafe" ? "کافه" : "رستوران"}</span>
                  </div>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
