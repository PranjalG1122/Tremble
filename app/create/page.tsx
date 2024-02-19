"use client";

import { createPassword } from "@/lib/ServerActions/passwords";
import { usePasswordStore } from "@/lib/client/stores/PasswordStore";
import { toast } from "react-toastify";
import { Heading } from "../../components/Heading";
import { Button, variants } from "../../components/Button";
import { Text } from "@/components/Text";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "react-feather";
import { useState } from "react";

export default function Create() {
  const router = useRouter();

  const { password, updatePassword } = usePasswordStore((state) => state);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleCreateNewPassword = async () => {
    const res = await createPassword(password);
    updatePassword({
      title: "",
      username: "",
      password: "",
    });
    if (!res) return toast.error("Failed to create password");
    toast.success("Password Created");
    router.push("/dashboard");
  };
  return (
    <form
      className="flex flex-col items-start w-full lg:gap-4 gap-2 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleCreateNewPassword();
      }}
    >
      <Heading>Create a New Password</Heading>
      <div className="flex flex-col items-center gap-2 w-full">
        <input
          placeholder="Title"
          title="Title"
          value={password.title}
          spellCheck={false}
          maxLength={256}
          className={variants({ variant: "input" }) + " w-full"}
          onChange={(e) => {
            updatePassword({
              ...password,
              title: e.target.value,
            });
          }}
        />
        <input
          placeholder="Username"
          title="Username"
          value={password.username}
          spellCheck={false}
          maxLength={256}
          className={variants({ variant: "input" }) + " w-full"}
          onChange={(e) => {
            updatePassword({
              ...password,
              username: e.target.value,
            });
          }}
        />
        <div className="flex flex-row items-center gap-1 w-full">
          <input
            placeholder="Password"
            title="Password"
            value={password.password}
            spellCheck={false}
            maxLength={256}
            type={isPasswordVisible ? "text" : "password"}
            className={variants({ variant: "input" }) + " w-full"}
            onChange={(e) => {
              updatePassword({
                ...password,
                password: e.target.value,
              });
            }}
          />
          <button
            type="button"
            className="bg-background-600 p-2 rounded-sm"
            onClick={() => {
              setIsPasswordVisible(!isPasswordVisible);
            }}
          >
            {isPasswordVisible ? (
              <EyeOff className={variants({ variant: "icon" })} />
            ) : (
              <Eye className={variants({ variant: "icon" })} />
            )}
          </button>
        </div>
      </div>
      <Text variant="gray">
        Tremble stores your passwords encrypted. Learn more about it{" "}
        <Link href="/docs" className={variants({ variant: "link" })}>
          here
        </Link>
        .
      </Text>
      <Button className="w-full" type="submit">
        Add Password
      </Button>
    </form>
  );
}
