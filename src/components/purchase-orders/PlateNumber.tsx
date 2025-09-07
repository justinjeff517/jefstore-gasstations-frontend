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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options?: string[];
};

const EXAMPLE_PLATES = [
  // PH 2018+ (ABC-1234)
  "NEX-7214",
  "KDF-0931",
  "UGT-5568",
  "RBL-2489",
  "WMC-4312",
  "PJV-8801",
  "HZN-6324",
  "TQR-1197",
  "VDM-7043",
  "LKS-3750",
  // Motorcycle (AB 12345)
  "AC 12345",
  "BT 90876",
  "DX 50721",
  "JM 44290",
  // Older style (AAA-123)
  "ZKM-987",
  "JQS-214",
];

export default function PlateNumber({ value, onChange, options = [] }: Props) {
  const [open, setOpen] = React.useState(false);

  const mergedOptions = React.useMemo(
    () => Array.from(new Set([...(options ?? []), ...EXAMPLE_PLATES])),
    [options]
  );

  return (
    <div className="grid gap-1">
      <Label htmlFor="plate_number">Plate Number</Label>
      <input id="plate_number" type="hidden" value={value} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || "Select or search plate number..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search plate number..." className="h-9" />
            <CommandList>
              <CommandEmpty>No plate number found.</CommandEmpty>
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
                    <Check className={cn("ml-auto", value === opt ? "opacity-100" : "opacity-0")} />
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
