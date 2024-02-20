import {
  PasswordsProps,
  usePasswordStore,
} from "@/lib/client/stores/PasswordStore";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Button, variants } from "./Button";
import { Copy, Edit, Trash } from "react-feather";

export default function PasswordComponent({
  index,
  passwordData,
  editDialogRef,
}: {
  index: number;
  passwordData: PasswordsProps;
  editDialogRef: React.RefObject<HTMLDialogElement>;
}) {
  const { setCurrentIndex, updatePassword, passwords, currentIndex } =
    usePasswordStore((state) => state);

  return (
    <article className="w-full flex lg:flex-row flex-col lg:items-center items-start gap-2 py-2 justify-between border-b border-background-500 rounded-sm">
      <div className="flex flex-col gap-1">
        <Heading>{passwordData.title}</Heading>
        <Text variant="gray">{passwordData.username}</Text>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button variant="iconButton">
          <Copy className={variants({ variant: "icon" })} />
        </Button>
        <Button
          variant="iconButton"
          onClick={() => {
            setCurrentIndex(index);
            updatePassword({
              password: passwords[index].password,
              title: passwords[index].title,
              username: passwords[index].username,
            });
            editDialogRef.current?.showModal();
          }}
        >
          <Edit className={variants({ variant: "icon" })} />
        </Button>
        <Button variant="iconButton">
          <Trash className={variants({ variant: "icon" })} />
        </Button>
      </div>
    </article>
  );
}
