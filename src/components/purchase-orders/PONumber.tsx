"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  required?: boolean;
};

export default function PONumber({ value, onChange, options = [], required }: Props) {
  const [open, setOpen] = React.useState(false);

  const randomOptions = React.useMemo(() => {
    const year = new Date().getFullYear();
    const set = new Set<string>();
    while (set.size < 10) {
      const n = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
      set.add(`${year}-${n}`);
    }
    return Array.from(set);
  }, []);

  const mergedOptions = React.useMemo(
    () => Array.from(new Set([...(options ?? []), ...randomOptions])),
    [options, randomOptions]
  );

  return (
    <div className="grid gap-1">
      <Label htmlFor="po_number">PO Number</Label>
      <input id="po_number" type="hidden" value={value} required={required} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || "Select or search PO number..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search PO number..." className="h-9" />
            <CommandList>
              <CommandEmpty>No PO number found.</CommandEmpty>
              <CommandGroup>
                {mergedOptions.map((opt) => (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {opt}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === opt ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
