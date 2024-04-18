import { Message } from "@/models/user/user.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean
    messages?: Array<Message>
    data?: any
}

