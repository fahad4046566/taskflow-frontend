import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface SelectFormFieldProps {
  value: string | null | undefined;
  onValueChange: (value: string | null) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectFormField({ value, onValueChange, options, placeholder }:SelectFormFieldProps) {
  return (  
    <Select onValueChange={onValueChange} value={value}  modal={false}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}