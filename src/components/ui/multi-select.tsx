import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type Option = {
  label: string
  value: string
}

type MultiSelectProps = {
  options: Option[]
  value?: string[]
  onChange?: (selected: string[]) => void
  placeholder?: string
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione opções",
  className,
  disabled,
}: MultiSelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>(value || [])

  const isControlled = value !== undefined

  const selected = isControlled ? value! : internalValue

  const toggleOption = (val: string) => {
    if (disabled) return;

    const newValue = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val]

    if (isControlled) {
      onChange?.(newValue)
    } else {
      setInternalValue(newValue)
      onChange?.(newValue)
    }
  }

  useEffect(() => {
    if (isControlled && value !== internalValue) {
      setInternalValue(value!)
    }
  }, [value])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            `w-[200px] justify-between ${className}`,
            disabled ? 'opacity-50' : ''
          )}
        >
          {selected.length > 0
            ? `${selected.length} selecionado(s)`
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2 py-1 cursor-pointer"
            onClick={() => toggleOption(option.value)}
          >
            <Checkbox checked={selected.includes(option.value)} disabled={disabled} />
            <span>{option.label}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
