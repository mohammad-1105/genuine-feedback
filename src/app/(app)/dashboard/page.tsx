"use client";

import MessageCard from "@/components/MessageCard";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Message } from "@/models/user/user.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { RefreshCcwDot } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState<boolean>(false);
  const [isRefreshSwitchLoading, setIsRefreshSwitchLoading] =
    useState<boolean>(false);

  // get sessions
  const { data: session } = useSession();

  // react hook form
  const { register, setValue, watch } = useForm<
    z.infer<typeof acceptMessageSchema>
  >({
    resolver: zodResolver(acceptMessageSchema),
  });

  // watch accpetMessage status
  const acceptMessage = watch("acceptMessage");

  // delete message by using optimistic UI apporach
  const onMessageDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };


  // fetch acceptingMessage status
  const fetchAcceptMessageStatus = useCallback(async () => {
    try {
      setIsRefreshSwitchLoading(true);

      const response = await axios.get<ApiResponse>("/api/accept-message");

      setValue("acceptMessage", response.data.isAcceptingMessages!);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to get accept message status",
        variant: "destructive",
      });
    } finally {
      setIsRefreshSwitchLoading(false);
    }
  }, [setValue]);

  // fetch all messages
  const fetchAllMessages = useCallback(
    async (refresh: boolean = false) => {
      try {
        setIsFetchingMessages(true);
        setIsRefreshSwitchLoading(false);

        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast({
            title: "Refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to load latest messages",
          variant: "destructive",
        });
      } finally {
        setIsFetchingMessages(false);
        setIsRefreshSwitchLoading(false);
      }
    },
    [setMessages, setIsFetchingMessages]
  );

  // Handle switch toggle
  const handleSwitchToggle = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessage: !acceptMessage,
      });
      setValue("acceptMessage", !acceptMessage);
      toast({
        title: "Accept Message",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update accept message settings",
        variant: "destructive",
      });
    }
  };

  // Fetch intial state from the server by checking session
  useEffect(() => {
    if (!session || !session.user) return;
    fetchAllMessages();
    fetchAcceptMessageStatus();
  }, [session, fetchAcceptMessageStatus, fetchAllMessages]);

  return (
    <div className="min-h-full sm:w-[90vw] mx-auto py-10 px-10">
      <h1 className="text-4xl sm:text-5xl font-extrabold">Dashboard</h1>

      <div className="my-4">
        <Separator />
        <div className="flex justify-between items-center p-4 gap-4">
         <div className="flex justify-center items-center flex-wrap sm:flex-nowrap gap-4 border border-input bg-background hover:text-accent-foreground p-3 rounded-md">
         <Switch
            {...register("acceptMessage")}
            checked={acceptMessage}
            onCheckedChange={handleSwitchToggle}
            disabled={isRefreshSwitchLoading}
          />


         <span className="text-sm sm:text-lg"> Accept message : {acceptMessage ? "ON": "OFF"}</span>
         </div>
          <Button
            className=""
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              fetchAllMessages(true);
            }}
          >
            {isFetchingMessages ? (
              <RefreshCcwDot className="animate-spin" />
            ) : (
              <RefreshCcwDot className="" />
            )}
          </Button>
        </div>

        <Separator />
      </div>

      {/* message card container starts here  */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {
            messages.length > 0 ? messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={onMessageDelete}
              />
            )) : <p>No messages to show</p>        
        }
      </div>
      {/* message card container ends here   */}
    </div>
  );
}
