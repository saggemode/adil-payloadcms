'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { AVAILABLE_PAYMENT_METHODS } from '@/constants'

interface PaymentMethodFormProps {
  paymentMethod: string
  onPaymentMethodChange: (value: string) => void
  onSubmit: () => void
}

export const PaymentMethodForm = ({ paymentMethod, onPaymentMethodChange, onSubmit }: PaymentMethodFormProps) => {
  return (
    <Card className="md:ml-8 my-4">
      <CardContent className="p-4">
        <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
          {AVAILABLE_PAYMENT_METHODS.map((pm) => (
            <div key={pm.name} className="flex items-center py-1">
              <RadioGroupItem value={pm.name} id={`payment-${pm.name}`} />
              <Label className="font-bold pl-2 cursor-pointer" htmlFor={`payment-${pm.name}`}>
                {pm.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="p-4">
        <Button onClick={onSubmit} className="rounded-full font-bold">
          Use this payment method
        </Button>
      </CardFooter>
    </Card>
  )
}