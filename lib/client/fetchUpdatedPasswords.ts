import { toast } from "react-toastify";
import { fetchPasswords } from "../ServerActions/passwords";
import { PasswordsProps } from "./stores/PasswordStore";

export const fetchUpdatedPasswords = async (
  setPasswords: (newPasswords: PasswordsProps[]) => void,
  search: string
) => {
  const res = await fetchPasswords();
  if (!res) return toast.error("Failed to fetch passwords");

  console.log(res);

  const filteredPasswords: any = res.filter((password) => {
    if (!password) return false;
    return password.title.toLowerCase().includes(search.toLowerCase());
  });

  if (!filteredPasswords) return toast.error("Failed to fetch passwords");

  setPasswords(filteredPasswords);
};
