"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, UserPlus, Check } from 'lucide-react'
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
import { 
  validateReferralCodeAction,
  processReferralAction,
  completeReferralAction,

} from '@/actions/referralAction'



 const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const router = useRouter()


  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      referralCode: "",
    },
  });

  // Add debounced validation for referral code
  useEffect(() => {
    const referralCode = form.watch("referralCode");
    if (!referralCode || referralCode.trim() === '') {
      setValidationError(undefined);
      setSuccess(undefined);
      return;
    }

    const validateCode = async () => {
      setIsValidatingCode(true);
      setValidationError(undefined);
      setSuccess(undefined);
      try {
        console.log('Validating referral code:', referralCode);
        const result = await validateReferralCodeAction(referralCode);
        console.log('Validation result:', result);
        
        if (!result.isValid) {
          setValidationError(result.message);
          setSuccess(undefined);
        } else {
          setValidationError(undefined);
          setSuccess('Valid referral code!');
        }
      } catch (err) {
        console.error('Error validating code:', err);
        setValidationError("Failed to validate code. Please try again.");
        setSuccess(undefined);
      } finally {
        setIsValidatingCode(false);
      }
    };

    // Only validate if the code is at least 6 characters
    if (referralCode.length >= 6) {
      const timeoutId = setTimeout(validateCode, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setValidationError(undefined);
      setSuccess(undefined);
    }
  }, [form.watch("referralCode")]);

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    
   startTransition(async () => {
     try {
       console.log('Submitting registration with values:', values);
       
       // Extract the referral code from the form values
       const { referralCode, ...userData } = values;
       
       // Create the user first without a referral code
       const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
         method: 'POST',
         body: JSON.stringify(userData),
         headers: { 'Content-Type': 'application/json' },
       });

       if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         console.error('Registration error:', errorData);
         
         if (errorData.errors) {
           // Handle validation errors
           const errorMessages = errorData.errors.map((err: any) => {
             if (err.data?.errors?.[0]?.message) {
               return err.data.errors[0].message;
             }
             return err.message || 'An error occurred during registration';
           });
           setError(errorMessages.join(', '));
         } else {
           setError(response.statusText || 'Error creating the account.');
         }
         return;
       }

       // If we have a valid referral code, process it after user creation
       if (referralCode && referralCode.length >= 6) {
         try {
           const userResponse = await response.json();
           const userId = userResponse.user?.id;
           
           if (userId) {
             console.log('Processing referral for user:', userId, 'with code:', referralCode);
             const referralResult = await processReferralAction(userId, referralCode);
             
             if (!referralResult.success) {
               console.warn('Referral processing warning:', referralResult.message);
               // Don't fail the registration, just log the warning
             }
           }
         } catch (referralError) {
           console.error('Error processing referral:', referralError);
           // Don't fail the registration, just log the error
         }
       }

       setSuccess('Account created successfully!');

       try {
         await login(values);
         const redirect = searchParams?.get('redirect');
         router.push(redirect || '/');
       } catch (loginError) {
         console.error('Login error:', loginError);
         setError('There was an issue with login. Please try again.');
       }
     } catch (error) {
       console.error('Registration error:', error);
       setError('An unexpected error occurred. Please try again.');
     }
   });
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
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Code (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="referral code"
                        className={`
                          ${field.value && !form.formState.errors.referralCode && !validationError ? "pr-10" : ""}
                          ${validationError ? "border-red-500 focus-visible:ring-red-500" : ""}
                        `}
                      />
                      {field.value && !form.formState.errors.referralCode && !isValidatingCode && !validationError && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      {isValidatingCode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {validationError && (
                    <p className="text-sm text-red-500 mt-1">
                      {validationError}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Enter the referral code if you were invited by another user
                  </p>
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
