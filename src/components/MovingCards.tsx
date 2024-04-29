"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function MovingCards() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    username: "Sarah",
    time: "10:00 AM",
    message: "Good morning, everyone! Wishing you all a fantastic day ahead.",
  },
  {
    username: "Alex",
    time: "11:30 AM",
    message: "Hey folks! Does anyone have recommendations for a good book to read?",
  },
  {
    username: "Emily",
    time: "1:15 PM",
    message: "Hello lovely people! How about we share our favorite recipes today?",
  },
  {
    username: "Michael",
    time: "3:00 PM",
    message: "Hi everyone! Just wanted to drop by and say hello. What's the topic of discussion today?",
  },
  {
    username: "Sophia",
    time: "4:45 PM",
    message: "Hey there! Anyone interested in discussing the latest movies or TV shows?",
  }
];