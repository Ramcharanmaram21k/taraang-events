"use client";

import * as React from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface MultiSelectCurryProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  className?: string;
  helperText?: string;
  itemLabel?: string;
}

export function MultiSelectCurry({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  maxSelections = 2,
  className,
  helperText,
  itemLabel = "items",
}: MultiSelectCurryProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      // Remove item
      onChange(selected.filter((s) => s !== item));
    } else {
      // Add item if under max
      if (selected.length >= maxSelections) {
        toast({
          title: "Maximum selections reached",
          description: `You can only select up to ${maxSelections} ${itemLabel}.`,
          variant: "destructive",
        });
        return;
      }
      onChange([...selected, item]);
    }
  };

  const handleRemove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== item));
  };

  const availableOptions = options.filter((opt) => !selected.includes(opt));
  const isMaxReached = selected.length >= maxSelections;

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex min-h-[44px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              selected.length === 0 && "text-muted-foreground"
            )}
          >
            <span className="flex-1 text-left">
              {selected.length === 0
                ? placeholder
                : `${selected.length} of ${maxSelections} selected`}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <div className="max-h-60 overflow-auto p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              const isDisabled = !isSelected && isMaxReached;
              
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => !isDisabled && handleSelect(option)}
                  disabled={isDisabled}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2.5 px-3 text-sm outline-none transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent hover:text-accent-foreground",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="flex-1 text-left">{option}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Tags/Chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="px-3 py-1.5 text-sm font-normal bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default"
            >
              {item}
              <button
                type="button"
                onClick={(e) => handleRemove(item, e)}
                className="ml-2 rounded-full hover:bg-primary/30 p-0.5 transition-colors"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-muted-foreground mt-1.5">
        {helperText || `Select up to ${maxSelections} ${itemLabel}`}
      </p>
    </div>
  );
}
