import { createPassword } from "@/lib/ServerActions/passwords";
import { usePasswordStore } from "@/lib/client/stores/PasswordStore";
import { toast } from "react-toastify";
import { Text } from "@/components/Text";
import Link from "next/link";
import { X } from "react-feather";
import { useEffect, useState } from "react";
import { Heading } from "@/components/Heading";
import { Button, variants } from "@/components/Button";
import { fetchUpdatedPasswords } from "@/lib/client/fetchUpdatedPasswords";
import PasswordInputs from "./PasswordInputs";

export default function CreatePassword({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
}) {
  const { password, updatePassword, setPasswords, search } = usePasswordStore(
    (state) => state
  );

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleCreateNewPassword = async () => {
    const res = await createPassword({
      passwordId: "",
      ...password,
    });
    if (!res) return toast.error("Failed to create password");
    toast.success("Password Created");
    const updatedPasswords = await fetchUpdatedPasswords(setPasswords, search);
    if (!updatedPasswords)
      return toast.error("Failed to fetch updated passwords");
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        updatePassword({
          password: "",
          title: "",
          username: "",
        });
        setIsPasswordVisible(false);
      }}
      className="bg-background-700 p-4 text-text-50 border border-background-500 rounded-sm max-w-md w-full"
    >
      <form
        className="flex flex-col items-start w-full lg:gap-4 gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleCreateNewPassword();
        }}
      >
        <div className="flex flex-row items-center gap-2 w-full justify-between">
          <Heading size="l">Create a New Password</Heading>
          <button
            type="button"
            onClick={() => {
              dialogRef.current?.close();
            }}
          >
            <X />
          </button>
        </div>
        <PasswordInputs
          isPasswordVisible={isPasswordVisible}
          setIsPasswordVisible={setIsPasswordVisible}
        />
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
    </dialog>
  );
}
