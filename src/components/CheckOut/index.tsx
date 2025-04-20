'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShippingAddress } from '@/types'
import { toast } from '@/hooks/use-toast'
import { calculateFutureDate, formatDateTime2 } from '@/utilities/generateId'
import { APP_NAME, AVAILABLE_DELIVERY_DATES, DEFAULT_PAYMENT_METHOD } from '@/constants'
import useCartStore from '@/hooks/use-cart-store'
import { Button } from '../ui/button'
import { ShippingAddressForm } from './ShippingAddressSection'
import { PaymentMethodForm } from './PaymentMethodSection'
import { DeliveryDateForm } from './DeliveryDateSection'
import { CheckoutSummary } from './CheckoutSummary'
import { Card, CardContent } from '../ui/card'
import ProductPrice from '../ProductArchive/Price'
import Link from 'next/link'
import CheckoutFooter from './checkout-footer'
import { useCoupon } from '@/hooks/useCoupon'
import CouponInput from './CouponInput'
import CouponSummary from './CouponSummary'
import { useCreateOrder } from '@/hooks/useOrders'
import { useNotifications } from '@/contexts/NotificationContext'
import { AlertCircle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

const CheckoutForm = () => {
  const router = useRouter()
  const createOrderMutation = useCreateOrder()
  //const { addNotification } = useNotifications()

  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = DEFAULT_PAYMENT_METHOD,
    },
    setShippingAddress,
    setPaymentMethod,
    setDeliveryDateIndex,
    clearCart,
  } = useCartStore()

  // Check if cart is empty
  const [isCartEmpty, setIsCartEmpty] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // useEffect(() => {
  //   // Set hydration state
  //   setIsHydrated(true)
  // }, [])

  // useEffect(() => {
  //   // Only check for empty cart after hydration is complete
  //   if (isHydrated) {
  //     if (!items || items.length === 0) {
  //       setIsCartEmpty(true)
        
  //       const timer = setTimeout(() => {
  //         router.push('/cart')
  //         toast({
  //           description: 'Your cart is empty. Please add items before checkout.',
  //           variant: 'destructive',
  //         })
  //       }, 2000)
        
  //       return () => clearTimeout(timer)
  //     } else {
  //       // Ensure we reset the empty cart state if items are found after hydration
  //       setIsCartEmpty(false)
  //     }
  //   }
  // }, [items, router, isHydrated])

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState<boolean>(false)
  const { coupon, applyCoupon, removeCoupon, calculateDiscount } = useCoupon()
  const subtotal = totalPrice
  const discountAmount = calculateDiscount(subtotal)
  const total = subtotal - discountAmount

  const handlePlaceOrder = async () => {
    const orderData = {
      items,
      shippingAddress,
      expectedDeliveryDate: calculateFutureDate(
        AVAILABLE_DELIVERY_DATES[deliveryDateIndex ?? 0]?.daysToDeliver ?? 0,
      ),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice: total,
      couponCode: coupon.code ?? undefined,
      discountAmount,
    }

    try {
     
      
      const res = await createOrderMutation.mutateAsync(orderData)
      if (!res.success) {
      
        
        toast({
          description: res.message,
          variant: 'destructive',
        })
      } else {
      
        
        toast({
          description: res.message,
          variant: 'default',
        })
        clearCart()
        router.push(`/checkout/${res.data?.orderId}`)
      }
    } catch (error) {
    
      toast({
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
    

  }

  const handleSelectShippingAddress = (values: ShippingAddress) => {
    setShippingAddress(values)
    setIsAddressSelected(true)
    

  }

  // If cart is empty, show redirection message
  if (isCartEmpty) {
    return (
      <div className="max-w-3xl mx-auto my-12 px-4">
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Empty Cart</AlertTitle>
          <AlertDescription>
            Your cart is empty. Redirecting to cart page...
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto highlight-link px-4 py-6">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-bold">Secure Checkout</h1>
        {createOrderMutation.isPending && (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {/* Shipping Address */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              {isAddressSelected && shippingAddress ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
                  <div className="col-span-5 flex text-lg font-bold">
                    <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary">1</span>
                    <span className="ml-2">Shipping address</span>
                  </div>
                  <div className="col-span-5">
                    <p>
                      {shippingAddress.fullName} <br />
                      {shippingAddress.street} <br />
                      {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        setIsAddressSelected(false)
                        setIsPaymentMethodSelected(true)
                        setIsDeliveryDateSelected(true)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex text-primary text-lg font-bold my-2">
                    <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary">1</span>
                    <span className="ml-2">Enter shipping address</span>
                  </div>
                  <ShippingAddressForm
                    onSubmit={handleSelectShippingAddress}
                    defaultValues={shippingAddress}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              {isPaymentMethodSelected && paymentMethod ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
                  <div className="flex text-lg font-bold col-span-5">
                    <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary">2</span>
                    <span className="ml-2">Payment Method</span>
                  </div>
                  <div className="col-span-5">
                    <p>{paymentMethod}</p>
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsPaymentMethodSelected(false)
                        if (paymentMethod) setIsDeliveryDateSelected(true)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : isAddressSelected ? (
                <div className="p-4">
                  <div className="flex text-primary text-lg font-bold my-2">
                    <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary">2</span>
                    <span className="ml-2">Choose a payment method</span>
                  </div>
                  <PaymentMethodForm
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    onSubmit={handleSelectPaymentMethod}
                  />
                </div>
              ) : (
                <div className="p-4 flex text-muted-foreground text-lg font-bold my-2">
                  <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-muted text-muted-foreground">2</span>
                  <span className="ml-2">Choose a payment method</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items and Delivery Date */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
                  <div className="flex text-lg font-bold col-span-5">
                    <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary">3</span>
                    <span className="ml-2">Items and shipping</span>
                  </div>
                  <div className="col-span-5">
                    <p className="font-medium">
                      Delivery date:{' '}
                      <span className="text-primary">
                        {
                          formatDateTime2(
                            calculateFutureDate(
                              AVAILABLE_DELIVERY_DATES[deliveryDateIndex ?? 0]?.daysToDeliver ?? 0,
                            ),
                          ).dateOnly
                        }
                      </span>
                    </p>
                    <ul className="mt-3 space-y-2">
                      {items.map((item, _index) => (
                        <li key={_index} className="flex justify-between">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        setIsPaymentMethodSelected(true)
                        setIsDeliveryDateSelected(false)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : isPaymentMethodSelected && isAddressSelected ? (
                <div className="p-4">
                  <div className="flex text-primary text-lg font-bold my-2">
                    <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary">3</span>
                    <span className="ml-2">Review items and shipping</span>
                  </div>
                  <DeliveryDateForm
                    deliveryDateIndex={deliveryDateIndex}
                    onDeliveryDateChange={(value) =>
                      setDeliveryDateIndex(
                        AVAILABLE_DELIVERY_DATES.findIndex((dd) => dd.name === value)!,
                      )
                    }
                    itemsPrice={itemsPrice}
                  />
                </div>
              ) : (
                <div className="p-4 flex text-muted-foreground text-lg font-bold my-2">
                  <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-muted text-muted-foreground">3</span>
                  <span className="ml-2">Items and shipping</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Coupon Section */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex text-lg font-bold mb-4">
                <span className="w-8 inline-flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary">4</span>
                <span className="ml-2">Apply discount</span>
              </div>
              {!coupon.code ? (
                <CouponInput onApplyCoupon={applyCoupon} />
              ) : (
                <CouponSummary
                  code={coupon.code}
                  discountAmount={discountAmount}
                  onRemove={removeCoupon}
                />
              )}
            </CardContent>
          </Card>

          {isPaymentMethodSelected && isAddressSelected && (
            <div className="mt-6">
              <div className="block md:hidden">
                <CheckoutSummary
                  isAddressSelected={isAddressSelected}
                  isPaymentMethodSelected={isPaymentMethodSelected}
                  loading={createOrderMutation.isPending}
                  itemsPrice={itemsPrice}
                  shippingPrice={shippingPrice}
                  taxPrice={taxPrice}
                  totalPrice={total}
                  onPlaceOrder={handlePlaceOrder}
                  onSelectShippingAddress={() => setIsAddressSelected(false)}
                  onSelectPaymentMethod={handleSelectPaymentMethod}
                />
              </div>
              <Card className="hidden md:block">
                <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-3">
                  <Button
                    onClick={handlePlaceOrder}
                    className="rounded-full w-full flex items-center justify-center gap-2"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Your Order
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                  <div className="flex-1">
                    <p className="font-bold text-lg">
                      Order Total: <ProductPrice price={total} plain />
                    </p>
                    <p className="text-xs">
                      By placing your order, you agree to {APP_NAME}&apos;s{' '}
                      <Link href="/page/privacy-policy" className="text-primary hover:underline">privacy notice</Link> and
                      <Link href="/page/conditions-of-use" className="text-primary hover:underline"> conditions of use</Link>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <CheckoutFooter />
        </div>
        <div className="hidden md:block">
          <CheckoutSummary
            isAddressSelected={isAddressSelected}
            isPaymentMethodSelected={isPaymentMethodSelected}
            loading={createOrderMutation.isPending}
            itemsPrice={itemsPrice}
            shippingPrice={shippingPrice}
            taxPrice={taxPrice}
            totalPrice={total}
            onPlaceOrder={handlePlaceOrder}
            onSelectShippingAddress={() => setIsAddressSelected(false)}
            onSelectPaymentMethod={handleSelectPaymentMethod}
          />
        </div>
      </div>
    </main>
  )
}

export default CheckoutForm
