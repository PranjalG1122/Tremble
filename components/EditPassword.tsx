import { usePasswordStore } from "@/lib/client/stores/PasswordStore";
import PasswordInputs from "./PasswordInputs";
import { Heading } from "./Heading";
import { X } from "react-feather";
import { Button } from "./Button";
import { createPassword } from "@/lib/ServerActions/passwords";
import { toast } from "react-toastify";
import { fetchUpdatedPasswords } from "@/lib/client/fetchUpdatedPasswords";

export default function EditPassword({
  editDialogRef,
  deleteDialogRef,
}: {
  editDialogRef: React.RefObject<HTMLDialogElement>;
  deleteDialogRef: React.RefObject<HTMLDialogElement>;
}) {
  const {
    updatePassword,
    currentIndex,
    passwords,
    password,
    setPasswords,
    search,
  } = usePasswordStore((state) => state);

  const handleUpdatePassword = async () => {
    const res = await createPassword({
      passwordId: passwords[currentIndex].id,
      ...password,
    });
    if (!res) return toast.error("Failed to update password");
    toast.success("Password Updated");
    await fetchUpdatedPasswords(setPasswords, search);
    editDialogRef.current?.close();
  };

  return (
    <dialog
      ref={editDialogRef}
      onClose={() => {
        updatePassword({
          password: "",
          title: "",
          username: "",
        });
      }}
      className="bg-background-700 p-4 text-text-50 border border-background-500 rounded-sm max-w-md w-full"
    >
      <form
        className="flex flex-col items-start w-full lg:gap-4 gap-2 max-w-md"
        onSubmit={async (e) => {
          e.preventDefault();
          // update this current password bleh
        }}
      >
        <div className="flex flex-row items-center gap-2 w-full justify-between">
          <Heading size="l">Edit Password</Heading>
          <button
            type="button"
            onClick={() => {
              editDialogRef.current?.close();
            }}
          >
            <X />
          </button>
        </div>
        <PasswordInputs />
        <div className="flex flex-row items-center gap-2 w-full">
          <Button className="w-full" onClick={handleUpdatePassword}>
            Update
          </Button>
          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-text-50"
            onClick={() => {
              deleteDialogRef.current?.showModal();
            }}
          >
            Delete
          </Button>
        </div>
      </form>
    </dialog>
  );
}
