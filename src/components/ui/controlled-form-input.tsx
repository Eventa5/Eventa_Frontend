import { FormInput } from "@/components/ui/form-input";
import type { InputHTMLAttributes } from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

interface ControlledFormInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  endAdornment?: React.ReactNode;
}

export function ControlledFormInput<TFieldValues extends FieldValues>({
  name,
  control,
  endAdornment,
  ...props
}: ControlledFormInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1">
          <FormInput
            {...field}
            {...props}
            error={!!error}
            endAdornment={endAdornment}
          />
          {error?.message && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
