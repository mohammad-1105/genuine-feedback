"use client";

import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

export default function VerifyUserPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const router = useRouter();

  // useParams hook
  const params = useParams<{ username: string }>();

  // zod implement and define form
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  // Submit function
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/verify-code/`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response?.data?.message,
        variant: "success",
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error on verify code :: ", axiosError);

      toast({
        title: "Verify Code Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-5  bg-gray-100 dark:bg-inherit">
      <h1 className="relative z-10 text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
        Email verification
      </h1>
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-full max-w-xl p-4 bg-gray-50 dark:bg-inherit border rounded-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={"0"} />
                          <InputOTPSlot index={"1"} />
                          <InputOTPSlot index={"2"} />
                          <InputOTPSlot index={"3"} />
                          <InputOTPSlot index={"4"} />
                          <InputOTPSlot index={"5"} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <p className="flex justify-center items-center gap-4">
                    <Loader2 className="text-xs animate-spin" /> verifying...
                  </p>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
