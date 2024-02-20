import { usePasswordStore } from "@/lib/client/stores/PasswordStore";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { Button, variants } from "./Button";

export default function PasswordInputs() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { password, updatePassword } = usePasswordStore((state) => state);

  return (
    <section className="flex flex-col items-center gap-2 w-full">
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
        <Button
          type="button"
          variant="iconButton"
          onClick={() => {
            setIsPasswordVisible(!isPasswordVisible);
          }}
        >
          {isPasswordVisible ? (
            <EyeOff className={variants({ variant: "icon" })} />
          ) : (
            <Eye className={variants({ variant: "icon" })} />
          )}
        </Button>
      </div>
    </section>
  );
}
