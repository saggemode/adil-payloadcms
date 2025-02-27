"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, UserPlus } from 'lucide-react'
import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,  
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { useAuth } from "@/providers/Auth";
import { useRouter, useSearchParams } from 'next/navigation'



 const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams()
    //const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
    const { login } = useAuth()
    const router = useRouter()


  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    
   startTransition(async () => {
     const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
       method: 'POST',
       body: JSON.stringify(values),
       headers: { 'Content-Type': 'application/json' },
     })

     if (!response.ok) {
       setError(response.statusText || 'Error creating the account.')
       return
     }

     setSuccess('Account created successfully!')

     try {
       await login(values)
       const redirect = searchParams.get('redirect')
       router.push(redirect || '/')
     } catch {
       setError('There was an issue with login. Please try again.')
     }
   })
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter a valid Email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {!isPending ? (
              <UserPlus className="mr-2 h-6 w-6" />
            ) : (
              <Loader className="mr-2 h-6 w-6 animate-spin" />
            )}
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
};

export default RegisterForm
