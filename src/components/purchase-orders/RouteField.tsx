"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  options?: string[];
};

const sampleRoutes = [
  "Tagbilaran → Loboc",
  "Loboc → Tagbilaran",
  "Tagbilaran → Sikatuna",
  "Sikatuna → Tagbilaran",
  "Sikatuna → Loboc",
  "Loboc → Sikatuna",
  "Loboc → Sevilla",
  "Sevilla → Loboc",
  "Carmen → Loboc",
  "Lila → Tagbilaran",
];

export default function RouteField({
  value,
  onChange,
  id = "route",
  name = "route",
  label = "Route",
  placeholder = "e.g. Tagbilaran → Loboc",
  required = false,
  autoComplete = "off",
  options = sampleRoutes,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-1">
      <Label htmlFor={id}>{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className={value ? "" : "text-muted-foreground"}>
              {value || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search route..." />
            <CommandEmpty>No route found.</CommandEmpty>
            <CommandList>
              <CommandItem
                value=""
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                <Check className={`mr-2 h-4 w-4 ${value === "" ? "opacity-100" : "opacity-0"}`} />
                Clear
              </CommandItem>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={(v) => {
                    onChange(v);
                    setOpen(false);
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${value === opt ? "opacity-100" : "opacity-0"}`} />
                  {opt}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Hidden input so forms still submit this value */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
}
