"use client";

import React, { useState } from "react";
import { z } from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  // Define form and implement zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // on submit

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      console.log("result ", result)

      if (result) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          variant: 'destructive',
        });
      }
    
      if (result?.url) {
        toast({
          title: "Success", 
          description: "Logged In successfully 🎊🥳",
          variant: "success"
        })
        router.replace('/dashboard');
      }
    } catch (error: any) {
      console.log("signin error" ,error)
      toast({
        title: "Sign-in failed",
        description:"😭😿",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="bg-gray-100 dark:bg-inherit min-h-screen w-full p-5 flex justify-center items-center">
      <div className="w-full max-w-[32rem] border rounded-md p-6 bg-white dark:bg-inherit z-50">
        <header className="mb-6">
          <h1 className="relative z-10 text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Login to Genuine Feedback
          </h1>
          <p className="text-center ">
            Don&apos;t have an account ?{" "}
            <Link
              className="text-blue-500 hover:text-blue-700"
              href={"/sign-up"}
            >
              Sign up
            </Link>
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="text"
                      {...field}
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
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="my-7 w-full mx-auto"
              disabled={isSubmitting || !form.formState.isDirty}
            >
              {isSubmitting ? (
                <p className="flex justify-center items-center gap-3">
                  <Loader2 className="animate-spin" /> Please wait...
                </p>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <BackgroundBeams className="z-0" />
    </div>
  );
}
