'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { AVAILABLE_PAYMENT_METHODS } from '@/constants'
import { CreditCard, Wallet, Building2 } from 'lucide-react'
import { cn } from '@/utilities/ui'


interface PaymentMethodFormProps {
  paymentMethod: string
  onPaymentMethodChange: (value: string) => void
  onSubmit: () => void
}

const getPaymentIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case 'credit card':
      return <CreditCard className="w-5 h-5" />
    case 'wallet':
      return <Wallet className="w-5 h-5" />
    case 'bank transfer':
      return <Building2 className="w-5 h-5" />
    default:
      return <CreditCard className="w-5 h-5" />
  }
}

export const PaymentMethodForm = ({
  paymentMethod,
  onPaymentMethodChange,
  onSubmit,
}: PaymentMethodFormProps) => {
  return (
    <Card className="md:ml-8 my-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Select Payment Method</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
          className="space-y-3"
        >
          {AVAILABLE_PAYMENT_METHODS.map((pm) => (
            <div
              key={pm.name}
              className={cn(
                'flex items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
                paymentMethod === pm.name
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50',
              )}
              onClick={() => onPaymentMethodChange(pm.name)}
            >
              <RadioGroupItem value={pm.name} id={`payment-${pm.name}`} className="mr-3" />
              <div className="flex items-center space-x-3">
                {getPaymentIcon(pm.name)}
                <Label
                  className={cn(
                    'text-base cursor-pointer',
                    paymentMethod === pm.name ? 'text-primary font-semibold' : 'text-gray-700',
                  )}
                  htmlFor={`payment-${pm.name}`}
                >
                  {pm.name}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="p-6 border-t">
        <Button
          onClick={onSubmit}
          className="w-full rounded-full font-bold py-6 text-base hover:scale-105 transition-transform duration-200"
        >
          Continue to Payment
        </Button>
      </CardFooter>
    </Card>
  )
}
