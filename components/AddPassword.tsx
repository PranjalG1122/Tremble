import { createPassword } from "@/lib/ServerActions/passwords";
import { usePasswordStore } from "@/lib/client/stores/PasswordStore";
import { toast } from "react-toastify";
import { Heading } from "./Heading";
import { Button, variants } from "./Button";

export default function AddPassword() {
  const { password, updatePassword } = usePasswordStore((state) => state);

  const handleCreateNewPassword = async () => {
    try {
      const res = await createPassword(password);
      if (!res) return toast.error("Failed to create password");
      toast.success("Password Created");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form
      className="flex flex-col items-start w-full lg:gap-4 gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleCreateNewPassword();
      }}
    >
      <Heading>Create a New Password</Heading>
      <div className="flex flex-col items-center lg:gap-4 gap-2 w-full">
        <input
          placeholder="Title"
          spellCheck={false}
          className={variants({ variant: "input" }) + " w-full"}
          onChange={(e) => {
            updatePassword({
              ...password,
              title: e.target.value,
            });
          }}
        />
        <div className="w-full flex lg:flex-row flex-col items-center lg:gap-4 gap-2">
          <input
            placeholder="Username"
            spellCheck={false}
            className={variants({ variant: "input" }) + " w-full"}
            onChange={(e) => {
              updatePassword({
                ...password,
                username: e.target.value,
              });
            }}
          />
          <input
            placeholder="Password"
            spellCheck={false}
            className={variants({ variant: "input" }) + " w-full"}
            onChange={(e) => {
              updatePassword({
                ...password,
                password: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <Button type="submit">Add Password</Button>
    </form>
  );
}
