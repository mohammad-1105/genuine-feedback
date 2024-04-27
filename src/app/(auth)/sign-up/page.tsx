"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SingUpPage() {
  const [username, setUsername] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // useDebounced hook
  const debounced = useDebounceCallback(setUsername, 400);
  // toast
  const { toast } = useToast();

  // router
  const router = useRouter();

  // Define form and implement zod validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // function to check unique username
  useEffect(() => {
    const checkUniqueUsername = async (): Promise<void> => {
      if (username) {
        try {
          setIsCheckingUsername(true);
          setUsernameMessage("");
          const response = await axios.get<ApiResponse>(
            `/api/unique-username-check?username=${username}`
          );
          setUsernameMessage(response?.data?.message);
        } catch (error) {
          console.error("ERROR ON CHECKING USERNAME :: ", error);
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError?.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUniqueUsername();
  }, [username]);

  // Define form submit
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/sign-up", data);

      toast({
        title: "Success",
        description: response?.data.message,
        variant: "success",
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("ERROR ON SIGNING UP :: ", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Signup Failed",
        description: axiosError?.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen w-full p-5 flex justify-center items-center">
      <div className="w-full max-w-[32rem] border rounded-md p-6 bg-white z-50">
        <header className="mb-6">
          <h1 className="relative z-10 text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
            Join Genuine Feedback
          </h1>
          <p className="text-center ">
            Already have an account ?{" "}
            <Link
              className="text-blue-500 hover:text-blue-700"
              href={"/sign-in"}
            >
              Sign in
            </Link>
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username here..."
                      type="text"
                      {...field}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <p>
                    {isCheckingUsername && (
                      <Loader2 className="animate-spin text-xs" />
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm ${
                          usernameMessage === "username is unique"
                            ? "text-green-500"
                            : "text-red-600"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </p>
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
                      placeholder="email here..."
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    We will send you a verification code
                  </FormDescription>
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
              disabled={isSubmitting}
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
