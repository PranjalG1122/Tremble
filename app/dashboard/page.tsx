"use client";

import { Button, variants } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { usePasswordStore } from "@/lib/client/stores/PasswordStore";
import { useEffect, useRef } from "react";
import CreatePassword from "@/components/CreatePassword";
import { fetchUpdatedPasswords } from "@/lib/client/fetchUpdatedPasswords";
import EditPassword from "@/components/EditPassword";
import PasswordComponent from "@/components/PasswordComponent";
import Delete from "@/components/Delete";

export default function Dashboard() {
  const createDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const { passwords, setPasswords, search, setSearch, updatePassword } =
    usePasswordStore((state) => state);

  const fetchUserPasswords = async () => {
    await fetchUpdatedPasswords(setPasswords, search);
  };

  useEffect(() => {
    fetchUserPasswords();
  }, []);

  return (
    <div className="min-h-screen w-full max-w-3xl h-full flex flex-col items-center justify-start py-4">
      {/* Change this so that the modeals are only available once updated passwords have been fetched */}
      {passwords && (
        <>
          <CreatePassword dialogRef={createDialogRef} />
          {/* <Delete deleteDialogRef={deleteDialogRef} /> */}
          <EditPassword
            editDialogRef={editDialogRef}
            deleteDialogRef={deleteDialogRef}
          />
        </>
      )}
      <div className="flex flex-col items-start w-full lg:gap-8 gap-4">
        <Heading size="l">My Passwords</Heading>
        <div className="flex flex-row items-center gap-2 w-full">
          <input
            className={variants({ variant: "input" }) + " w-full"}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              updatePassword({
                title: "",
                username: "",
                password: "",
              });
              createDialogRef.current?.showModal();
            }}
          >
            Create
          </Button>
        </div>

        {(passwords.length > 0 && (
          <div className="flex flex-col items-center w-full border-t border-background-500">
            {passwords.map((password, index) => {
              return (
                <PasswordComponent
                  key={password.id}
                  index={index}
                  deleteDialogRef={deleteDialogRef}
                  passwordData={password}
                  editDialogRef={editDialogRef}
                />
              );
            })}
          </div>
        )) ||
          "loading..."}
      </div>
    </div>
  );
}
