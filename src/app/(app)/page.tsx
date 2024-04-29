"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useRouter } from "next/navigation";
import MovingCards from "@/components/MovingCards";

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Welcome to Genuine Feedback
          </div>
          <div className="text-center font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            Where your feedback might be important for someone.
          </div>

          <button
            onClick={() => {
              router.push("/sign-in");
            }}
            className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2"
          >
            Join Now
          </button>
        </motion.div>
      </AuroraBackground>

      <MovingCards />
    </div>
  );
}
