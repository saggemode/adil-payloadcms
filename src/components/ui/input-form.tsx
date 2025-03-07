import * as React from 'react'
import { Input } from './input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from './form'
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: any
  name: string
  label: string
  defaultValue?: string
}

const InputForm = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, control, name, defaultValue, label, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input {...field} ref={ref} type={type} {...props} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
)
InputForm.displayName = 'Input'

export { InputForm }
