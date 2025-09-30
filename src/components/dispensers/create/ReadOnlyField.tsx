"use client";

import { useFormContext } from "react-hook-form";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type Props = {
  label: string;
  name: string;          // form field name to watch
  placeholder?: string;  // shown when empty
  monospace?: boolean;   // render value in monospace (default: true)
};

export default function ReadonlyField({ label, name, placeholder = "—", monospace = true }: Props) {
  const form = useFormContext();
  const value = (form?.watch?.(name) ?? "") as string;

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div
        className={[
          "rounded-md border px-3 py-2 text-sm select-all",
          "bg-muted/70 border-border/60 text-foreground/90",
          "dark:bg-muted/80",
          monospace ? "font-mono tabular-nums" : "",
        ].join(" ")}
        role="textbox"
        aria-readonly="true"
      >
        {value || placeholder}
      </div>
      {/* keep the field in the form state */}
      <input type="hidden" {...form.register(name)} />
      <FormMessage />
    </FormItem>
  );
}
