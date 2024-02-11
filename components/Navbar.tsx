import Image from "next/image";
import { Heading } from "./Heading";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex flex-row items-center justify-start w-full lg:px-16 px-2 py-2">
      <Link href="/" className="flex flex-row items-center gap-2">
        <Image
          src="/tremble.png"
          alt="Tremble"
          width={28}
          height={28}
          unoptimized={true}
        />
        <Heading size="l">Tremble</Heading>
      </Link>
    </nav>
  );
}
