// 'use client'

// import { useMemo } from 'react'
// import { useForm, FormProvider } from 'react-hook-form'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardFooter } from '@/components/ui/card'
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { Input } from '../ui/input'

// interface ShippingAddressFormProps {
//   onSubmit: () => void
// }

// interface ShippingAddressValues {
//   fullName: string
//   street: string
//   city: string
//   province: string
//   phone: string
//   postalCode: string
//   country: string
// }

// const ShippingAddressForm = ({ onSubmit }: ShippingAddressFormProps) => {
//   // Memoize default values to prevent unnecessary re-renders
//   const defaultValues = useMemo(
//     () =>
//       process.env.NODE_ENV === 'development'
//         ? {
//             fullName: 'umeh paul abuchi',
//             street: '22 biafra street biafra',
//             city: 'Onitsha',
//             province: 'Anambra state',
//             phone: '+2347038655954',
//             postalCode: '23470',
//             country: 'Biafra',
//           }
//         : {
//             fullName: '',
//             street: '',
//             city: '',
//             province: '',
//             phone: '',
//             postalCode: '',
//             country: '',
//           },
//     [],
//   )

//   // Initialize useForm with proper types
//   const shippingAddressForm = useForm<ShippingAddressValues>({
//     defaultValues,
//     mode: 'onChange',
//   })

//   return (
//     <FormProvider {...shippingAddressForm}>
//       <form onSubmit={shippingAddressForm.handleSubmit(onSubmit)}>
//         <Card>
//           <CardContent className="p-4 space-y-2">
//             <div className="text-lg font-bold mb-2">Your address</div>

//             <div className="flex flex-col gap-5 md:flex-row">
//               <FormField
//                 control={shippingAddressForm.control}
//                 name="fullName"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter full name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div>
//               <FormField
//                 control={shippingAddressForm.control}
//                 name="street"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter address" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="flex flex-col gap-5 md:flex-row">
//               <FormField
//                 control={shippingAddressForm.control}
//                 name="city"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>City</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter city" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={shippingAddressForm.control}
//                 name="province"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Province</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter province" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={shippingAddressForm.control}
//                 name="country"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Country</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter country" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="flex flex-col gap-5 md:flex-row">
//               <FormField
//                 control={shippingAddressForm.control}
//                 name="postalCode"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Postal Code</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter postal code" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={shippingAddressForm.control}
//                 name="phone"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Phone number</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter phone number" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </CardContent>
//           <CardFooter className="p-4">
//             <Button type="submit" className="rounded-full font-bold">
//               Ship to this address
//             </Button>
//           </CardFooter>
//         </Card>
//       </form>
//     </FormProvider>
//   )
// }

// export default ShippingAddressForm

// components/ShippingAddressForm.tsx
'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ShippingAddressSchema } from '@/types/validator'
import { ShippingAddress } from '@/types'

interface ShippingAddressFormProps {
  onSubmit: (values: ShippingAddress) => void
  defaultValues?: ShippingAddress
}

export const ShippingAddressForm = ({ onSubmit, defaultValues }: ShippingAddressFormProps) => {
  const form = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="md:ml-8 my-4">
          <CardContent className="p-4 space-y-2">
            <div className="text-lg font-bold mb-2">Your address</div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="p-4">
            <Button type="submit" className="rounded-full font-bold">
              Ship to this address
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
