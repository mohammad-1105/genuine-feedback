"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Message } from "@/models/user/user.model";
import dayjs from "dayjs";
import { toast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const classNames = buttonVariants({
    variant: "destructive",
  });

  const handleDeleteMessage = async () => {
    try {
      
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
       // optimistic delete
       onMessageDelete(message._id);
      toast({
        title: response.data.message,
      });

     
    } catch (error) {
      // console.log("Delete message error ", error )
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to delete",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{message?.content}</CardTitle>
        <CardDescription>
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash2 className="text-red-600 cursor-pointer hover:text-red-700" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={cn(classNames)}
                onClick={handleDeleteMessage}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
