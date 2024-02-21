import { usePasswordStore } from "@/lib/client/stores/PasswordStore";
import { Button, variants } from "./Button";
import { toast } from "react-toastify";
import { fetchUpdatedPasswords } from "@/lib/client/fetchUpdatedPasswords";
import { deletePassword } from "@/lib/ServerActions/passwords";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { X } from "react-feather";

export default function Delete({
  deleteDialogRef,
}: {
  deleteDialogRef: React.RefObject<HTMLDialogElement>;
}) {
  const { currentIndex, passwords, setPasswords, search } = usePasswordStore(
    (state) => state
  );

  const deleteCurrentPassword = async () => {
    const res = await deletePassword(passwords[currentIndex].id);
    if (!res) return toast.error("Failed to delete password");
    toast.success("Password deleted!");
    deleteDialogRef.current?.close();
    fetchUpdatedPasswords(setPasswords, search);
  };

  return (
    <dialog
      ref={deleteDialogRef}
      className="bg-background-700 p-4 text-text-50 border border-background-500 rounded-sm max-w-xs w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between w-full">
          <Heading>Delete Password</Heading>
          <button
            onClick={() => {
              deleteDialogRef.current?.close();
            }}
          >
            <X className={variants({ variant: "icon" })} />
          </button>
        </div>
        <Text>Are you sure you want to delete this password?</Text>
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            onClick={() => {
              deleteDialogRef.current?.close();
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-400 text-text-50"
            onClick={deleteCurrentPassword}
          >
            Delete
          </Button>
        </div>
      </div>
    </dialog>
  );
}
