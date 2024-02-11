import { Button, variants } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-max w-full flex flex-col flex-grow">
      <section className="w-full flex flex-col items-center justify-center gap-4">
        <Heading size="xxl">Fortified Digital</Heading>
        <Heading size="xxl">Password Manager</Heading>
        <Text size="lg" className="text-center max-w-xl" variant="gray">
          Tremble allows you to unlock tranquility by safeguarding passwords
          with our advanced, user-friendly security solution.
        </Text>
        <div className="flex flex-row items-center gap-2">
          <Link href="/login" className={variants({ variant: "primary" })}>
            Get Started
          </Link>
          <Link href="/docs" className={variants({ variant: "secondary" })}>
            Documentation
          </Link>
        </div>
      </section>
    </div>
  );
}
