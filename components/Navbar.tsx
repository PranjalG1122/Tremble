import Image from "next/image";
import { Heading } from "./Heading";

export default function Navbar() {
  return (
    <nav className="flex flex-row items-center justify-between w-full px-16 py-2">
      <div className="flex flex-row items-center gap-2">
        <Image
          src="/tremble.png"
          alt="Tremble"
          width={32}
          height={32}
          unoptimized={true}
        />
        <Heading size="l">Tremble</Heading>
      </div>
      <div>Documentation</div>
    </nav>
  );
}
