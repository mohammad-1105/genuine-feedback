"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function Page() {
  const params = useParams<{ username: string }>();
  const { username } = params;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
      if(response.status === 200) {
        toast({
          title: "Success",
          description: response.data?.message,
        });
        // reset form content
        form.reset()
      }
      
    } catch (error) {
      console.log("Error on sending message :: ", error);
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-center font-extrabold text-4xl my-4">
        Public profile link
      </h1>
      <div className="p-4 sm:p-12">
        <div className="w-full max-w-5xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="write your message here..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You are sending message to @{username}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} type="submit">Send</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
