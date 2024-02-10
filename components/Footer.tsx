"use client";

import { useState } from "react";
import { Text } from "./Text";
import { variants } from "./Button";
import { variants as textVariants } from "./Text";

export default function Footer() {
  const [systemNormal, setSystemNormal] = useState<boolean>(false);
  return (
    <footer className="flex lg:flex-row flex-col items-center justify-center lg:gap-6 gap-2 w-full lg:px-16 px-2 py-2">
      <Text variant="gray" size="sm">
        Created by{" "}
        <a
          href="https://pranjalg1122.vercel.app"
          className={
            variants({ variant: "link" }) + textVariants({ size: "sm" })
          }
          target="_blank"
          rel="noreferrer noopener"
        >
          Pranjal Gupta
        </a>
      </Text>
      <Text variant="gray" size="sm">
        All rights reserved. ©Tremble 2024
      </Text>
    </footer>
  );
}
