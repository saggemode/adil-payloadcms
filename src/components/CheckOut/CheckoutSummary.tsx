'use client'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import ProductPrice from '../ProductArchive/Price'
import { ArrowRight, Check, ShoppingBag } from 'lucide-react'
import { APP_NAME } from '@/constants'
import Link from 'next/link'

export interface CheckoutSummaryProps {
  isAddressSelected: boolean
  isPaymentMethodSelected: boolean
  loading: boolean
  itemsPrice: number
  shippingPrice: number | undefined
  taxPrice: number | undefined
  totalPrice: number
  onPlaceOrder: () => void
  onSelectShippingAddress: () => void
  onSelectPaymentMethod: () => void
}

export const CheckoutSummary = ({
  isAddressSelected,
  isPaymentMethodSelected,
  loading,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
  onPlaceOrder,
  onSelectShippingAddress,
  onSelectPaymentMethod,
}: CheckoutSummaryProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Items total:</span>
            <ProductPrice price={itemsPrice} plain />
          </div>
          {shippingPrice && (
            <div className="flex justify-between text-sm">
              <span>Shipping & handling:</span>
              <ProductPrice price={shippingPrice} plain />
            </div>
          )}
          {taxPrice && (
            <div className="flex justify-between text-sm">
              <span>Estimated tax:</span>
              <ProductPrice price={taxPrice} plain />
            </div>
          )}
          <div className="flex justify-between font-bold pt-3 border-t text-base">
            <span>Order total:</span>
            <ProductPrice price={totalPrice} plain />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2 text-sm">
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
              {isAddressSelected ? (
                <div className="rounded-full bg-primary/10 w-5 h-5 flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
              ) : (
                <div className="rounded-full border border-muted-foreground/30 w-5 h-5 flex items-center justify-center">
                  <span className="text-xs">1</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">Shipping address</p>
              {!isAddressSelected && (
                <Button variant="link" onClick={onSelectShippingAddress} className="h-auto p-0 text-xs text-primary">
                  Add shipping address
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
              {isPaymentMethodSelected ? (
                <div className="rounded-full bg-primary/10 w-5 h-5 flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
              ) : (
                <div className="rounded-full border border-muted-foreground/30 w-5 h-5 flex items-center justify-center">
                  <span className="text-xs">2</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">Payment method</p>
              {!isPaymentMethodSelected && isAddressSelected && (
                <Button variant="link" onClick={onSelectPaymentMethod} className="h-auto p-0 text-xs text-primary">
                  Select payment method
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={loading || !isAddressSelected || !isPaymentMethodSelected}
          onClick={onPlaceOrder}
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
              Processing...
            </>
          ) : (
            <>
              Place order
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {(!isAddressSelected || !isPaymentMethodSelected) && (
          <p className="text-xs text-muted-foreground text-center px-2">
            Please complete all required steps before placing your order
          </p>
        )}

        <p className="text-xs text-center py-2">
          By placing your order, you agree to {APP_NAME}&apos;s{' '}
          <Link href="/page/privacy-policy">privacy notice</Link> and
          <Link href="/page/conditions-of-use"> conditions of use</Link>.
        </p>
      </CardContent>
    </Card>
  )
}