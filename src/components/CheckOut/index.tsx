// 'use client'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { ShippingAddress } from '@/types'
// import { createOrder } from '@/actions/orderAction'

// import { toast } from '@/hooks/use-toast'

// import { calculateFutureDate, formatDateTime2 } from '@/utilities/generateId'
// import { APP_NAME, AVAILABLE_DELIVERY_DATES, DEFAULT_PAYMENT_METHOD } from '@/constants'
// import useCartStore from '@/hooks/use-cart-store'
// import { Button } from '../ui/button'
// import { ShippingAddressForm } from './ShippingAddressSection'
// import { PaymentMethodForm } from './PaymentMethodSection'
// import { DeliveryDateForm } from './DeliveryDateSection'
// import { CheckoutSummary } from './CheckoutSummary'
// import { Card, CardContent } from '../ui/card'
// import ProductPrice from '../ProductArchive/Price'
// import Link from 'next/link'
// import CheckoutFooter from './checkout-footer'
// import { Coupon } from '@/payload-types'
// import { Input } from '../ui/input'
// import { useCoupon } from '@/hooks/useCoupon'

// const CheckoutForm = () => {
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const {
//     cart: {
//       items,
//       itemsPrice,
//       shippingPrice,
//       taxPrice,
//       totalPrice,
//       shippingAddress,
//       deliveryDateIndex,
//       paymentMethod = DEFAULT_PAYMENT_METHOD,
//     },
//     setShippingAddress,
//     setPaymentMethod,
//     setDeliveryDateIndex,
//     clearCart,
//   } = useCartStore()

//   const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
//   const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState<boolean>(false)
//   const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState<boolean>(false)
//  const { coupon, applyCoupon, removeCoupon, calculateDiscount } = useCoupon()
//   const subtotal = totalPrice
//   const discountAmount = calculateDiscount(subtotal)
//   const total = subtotal - discountAmount

//   const handlePlaceOrder = async () => {
//     setLoading(true)
//     const res = await createOrder({
//       items,
//       shippingAddress,
//       expectedDeliveryDate: calculateFutureDate(
//         AVAILABLE_DELIVERY_DATES[deliveryDateIndex ?? 0]?.daysToDeliver ?? 0,
//       ),
//       deliveryDateIndex,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       taxPrice,
//        totalPrice,

//     })
//     if (!res.success) {
//       toast({
//         description: res.message,
//         variant: 'destructive',
//       })
//     } else {
//       toast({
//         description: res.message,
//         variant: 'default',
//       })
//       clearCart()
//       router.push(`/checkout/${res.data?.orderId}`)

//       //startRouteTransition(() => router.push(`/checkout/${res.data?.orderId}`))
//     }
//     setLoading(false)
//   }

//   const handleSelectPaymentMethod = () => {
//     setIsAddressSelected(true)
//     setIsPaymentMethodSelected(true)
//   }

//   const handleSelectShippingAddress = (values: ShippingAddress) => {
//     setShippingAddress(values)
//     setIsAddressSelected(true)
//   }

//   return (
//     <main className="max-w-6xl mx-auto highlight-link">
//       <div className="grid md:grid-cols-4 gap-6">
//         <div className="md:col-span-3">
//           {/* Shipping Address */}
//           {isAddressSelected && shippingAddress ? (
//             <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
//               <div className="col-span-5 flex text-lg font-bold">
//                 <span className="w-8">1 </span>
//                 <span>Shipping address</span>
//               </div>
//               <div className="col-span-5">
//                 <p>
//                   {shippingAddress.fullName} <br />
//                   {shippingAddress.street} <br />
//                   {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
//                 </p>
//               </div>
//               <div className="col-span-2">
//                 <Button
//                   variant={'outline'}
//                   onClick={() => {
//                     setIsAddressSelected(false)
//                     setIsPaymentMethodSelected(true)
//                     setIsDeliveryDateSelected(true)
//                   }}
//                 >
//                   Change
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="flex text-primary text-lg font-bold my-2">
//                 <span className="w-8">1 </span>
//                 <span>Enter shipping address</span>
//               </div>
//               <ShippingAddressForm
//                 onSubmit={handleSelectShippingAddress}
//                 defaultValues={shippingAddress}
//               />
//             </>
//           )}

//           {/* Payment Method */}
//           <div className="border-y">
//             {isPaymentMethodSelected && paymentMethod ? (
//               <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
//                 <div className="flex text-lg font-bold col-span-5">
//                   <span className="w-8">2 </span>
//                   <span>Payment Method</span>
//                 </div>
//                 <div className="col-span-5">
//                   <p>{paymentMethod}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setIsPaymentMethodSelected(false)
//                       if (paymentMethod) setIsDeliveryDateSelected(true)
//                     }}
//                   >
//                     Change
//                   </Button>
//                 </div>
//               </div>
//             ) : isAddressSelected ? (
//               <>
//                 <div className="flex text-primary text-lg font-bold my-2">
//                   <span className="w-8">2 </span>
//                   <span>Choose a payment method</span>
//                 </div>
//                 <PaymentMethodForm
//                   paymentMethod={paymentMethod}
//                   onPaymentMethodChange={setPaymentMethod}
//                   onSubmit={handleSelectPaymentMethod}
//                 />
//               </>
//             ) : (
//               <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
//                 <span className="w-8">2 </span>
//                 <span>Choose a payment method</span>
//               </div>
//             )}
//           </div>

//           {/* Items and Delivery Date */}
//           <div>
//             {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
//               <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
//                 <div className="flex text-lg font-bold col-span-5">
//                   <span className="w-8">3 </span>
//                   <span>Items and shipping</span>
//                 </div>
//                 <div className="col-span-5">
//                   <p>
//                     Delivery date:{' '}
//                     {
//                       formatDateTime2(
//                         calculateFutureDate(
//                           AVAILABLE_DELIVERY_DATES[deliveryDateIndex ?? 0]?.daysToDeliver ?? 0,
//                         ),
//                       ).dateOnly
//                     }
//                   </p>
//                   <ul>
//                     {items.map((item, _index) => (
//                       <li key={_index}>
//                         {item.name} x {item.quantity} = {item.price}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="col-span-2">
//                   <Button
//                     variant={'outline'}
//                     onClick={() => {
//                       setIsPaymentMethodSelected(true)
//                       setIsDeliveryDateSelected(false)
//                     }}
//                   >
//                     Change
//                   </Button>
//                 </div>
//               </div>
//             ) : isPaymentMethodSelected && isAddressSelected ? (
//               <>
//                 <div className="flex text-primary text-lg font-bold my-2">
//                   <span className="w-8">3 </span>
//                   <span>Review items and shipping</span>
//                 </div>
//                 <DeliveryDateForm
//                   deliveryDateIndex={deliveryDateIndex}
//                   onDeliveryDateChange={(value) =>
//                     setDeliveryDateIndex(
//                       AVAILABLE_DELIVERY_DATES.findIndex((dd) => dd.name === value)!,
//                     )
//                   }
//                   itemsPrice={itemsPrice}
//                 />
//               </>
//             ) : (
//               <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
//                 <span className="w-8">3 </span>
//                 <span>Items and shipping</span>
//               </div>
//             )}
//           </div>

// <h1>hello</h1>

//           {/* Coupon Section */}
//           <div className="mt-6">
//             <div className="flex items-center gap-2">
//               <Input
//                 placeholder="Enter coupon code"
//                 //value={couponCode}
//                 //onChange={(e) => setCouponCode(e.target.value)}
//               />
//               <Button
//              // onClick={handleApplyCoupon}
//               variant="outline">
//                 Apply
//               </Button>
//             </div>
//             {/* {couponError && <p className="text-sm text-red-600 mt-2">{couponError}</p>}
//             {appliedCoupon && (
//               <p className="text-sm text-green-600 mt-2">
//                 Coupon applied: {appliedCoupon.discountPercent}% discount
//               </p>
//             )} */}
//           </div>

//           {isPaymentMethodSelected && isAddressSelected && (
//             <div className="mt-6">
//               <div className="block md:hidden">
//                 <CheckoutSummary
//                   isAddressSelected={isAddressSelected}
//                   isPaymentMethodSelected={isPaymentMethodSelected}
//                   loading={loading}
//                   itemsPrice={itemsPrice}
//                   shippingPrice={shippingPrice}
//                   taxPrice={taxPrice}
//                   totalPrice={totalPrice}
//                   onPlaceOrder={handlePlaceOrder}
//                   onSelectShippingAddress={() => setIsAddressSelected(false)}
//                   onSelectPaymentMethod={handleSelectPaymentMethod}
//                 />
//               </div>
//               <Card className="hidden md:block">
//                 <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-3">
//                   <Button
//                     onClick={handlePlaceOrder}
//                     className="rounded-full w-full flex items-center justify-center gap-2"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
//                         Placing Order...
//                       </>
//                     ) : (
//                       'Place Your Order'
//                     )}
//                   </Button>
//                   <div className="flex-1">
//                     <p className="font-bold text-lg">
//                       Order Total: <ProductPrice price={totalPrice} plain />
//                     </p>
//                     <p className="text-xs">
//                       By placing your order, you agree to {APP_NAME}&apos;s{' '}
//                       <Link href="/page/privacy-policy">privacy notice</Link> and
//                       <Link href="/page/conditions-of-use"> conditions of use</Link>.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}
//           <CheckoutFooter />
//         </div>
//         <div className="hidden md:block">
//           <CheckoutSummary
//             isAddressSelected={isAddressSelected}
//             isPaymentMethodSelected={isPaymentMethodSelected}
//             loading={loading}
//             itemsPrice={itemsPrice}
//             shippingPrice={shippingPrice}
//             taxPrice={taxPrice}
//             totalPrice={totalPrice}
//             onPlaceOrder={handlePlaceOrder}
//             onSelectShippingAddress={() => setIsAddressSelected(false)}
//             onSelectPaymentMethod={handleSelectPaymentMethod}
//           />
//         </div>
//       </div>
//     </main>
//   )
// }

// export default CheckoutForm

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShippingAddress } from '@/types'
import { createOrder } from '@/actions/orderAction'
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
import { Input } from '../ui/input'
import { useCoupon } from '@/hooks/useCoupon'
import CouponInput from './CouponInput'
import CouponSummary from './CouponSummary'

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState<boolean>(false)
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState<boolean>(false)
  const { coupon, applyCoupon, removeCoupon, calculateDiscount } = useCoupon()
  const subtotal = totalPrice
  const discountAmount = calculateDiscount(subtotal)
  const total = subtotal - discountAmount

  const handlePlaceOrder = async () => {
    setLoading(true)
    const res = await createOrder({
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
    })
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
    setLoading(false)
  }

  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true)
    setIsPaymentMethodSelected(true)
  }

  const handleSelectShippingAddress = (values: ShippingAddress) => {
    setShippingAddress(values)
    setIsAddressSelected(true)
  }

  return (
    <main className="max-w-6xl mx-auto highlight-link">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {/* Shipping Address */}
          {isAddressSelected && shippingAddress ? (
            <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
              <div className="col-span-5 flex text-lg font-bold">
                <span className="w-8">1 </span>
                <span>Shipping address</span>
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
            <>
              <div className="flex text-primary text-lg font-bold my-2">
                <span className="w-8">1 </span>
                <span>Enter shipping address</span>
              </div>
              <ShippingAddressForm
                onSubmit={handleSelectShippingAddress}
                defaultValues={shippingAddress}
              />
            </>
          )}

          {/* Payment Method */}
          <div className="border-y">
            {isPaymentMethodSelected && paymentMethod ? (
              <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
                <div className="flex text-lg font-bold col-span-5">
                  <span className="w-8">2 </span>
                  <span>Payment Method</span>
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
              <>
                <div className="flex text-primary text-lg font-bold my-2">
                  <span className="w-8">2 </span>
                  <span>Choose a payment method</span>
                </div>
                <PaymentMethodForm
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  onSubmit={handleSelectPaymentMethod}
                />
              </>
            ) : (
              <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
                <span className="w-8">2 </span>
                <span>Choose a payment method</span>
              </div>
            )}
          </div>

          {/* Items and Delivery Date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className="grid grid-cols-1 md:grid-cols-12 my-3 pb-3">
                <div className="flex text-lg font-bold col-span-5">
                  <span className="w-8">3 </span>
                  <span>Items and shipping</span>
                </div>
                <div className="col-span-5">
                  <p>
                    Delivery date:{' '}
                    {
                      formatDateTime2(
                        calculateFutureDate(
                          AVAILABLE_DELIVERY_DATES[deliveryDateIndex ?? 0]?.daysToDeliver ?? 0,
                        ),
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, _index) => (
                      <li key={_index}>
                        {item.name} x {item.quantity} = {item.price}
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
              <>
                <div className="flex text-primary text-lg font-bold my-2">
                  <span className="w-8">3 </span>
                  <span>Review items and shipping</span>
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
              </>
            ) : (
              <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
                <span className="w-8">3 </span>
                <span>Items and shipping</span>
              </div>
            )}
          </div>

          {/* Coupon Section */}
          <div className="mt-6">
            {!coupon.code ? (
              <CouponInput onApplyCoupon={applyCoupon} />
            ) : (
              <CouponSummary
                code={coupon.code}
                discountAmount={discountAmount}
                onRemove={removeCoupon}
              />
            )}
          </div>

          {isPaymentMethodSelected && isAddressSelected && (
            <div className="mt-6">
              <div className="block md:hidden">
                <CheckoutSummary
                  isAddressSelected={isAddressSelected}
                  isPaymentMethodSelected={isPaymentMethodSelected}
                  loading={loading}
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                        Placing Order...
                      </>
                    ) : (
                      'Place Your Order'
                    )}
                  </Button>
                  <div className="flex-1">
                    <p className="font-bold text-lg">
                      Order Total: <ProductPrice price={total} plain />
                    </p>
                    <p className="text-xs">
                      By placing your order, you agree to {APP_NAME}&apos;s{' '}
                      <Link href="/page/privacy-policy">privacy notice</Link> and
                      <Link href="/page/conditions-of-use"> conditions of use</Link>.
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
            loading={loading}
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