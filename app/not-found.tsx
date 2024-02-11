import { variants } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Heading size="xxl">404</Heading>
      <Text variant="gray">The page you are looking for does not exist.</Text>
      <Link href="/" className={variants({ variant: "primary" })}>
        Home
      </Link>
    </div>
  );
}
