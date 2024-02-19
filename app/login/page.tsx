"use client";

import React, { useEffect, useState } from "react";
import {
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  platformAuthenticatorIsAvailable,
  startAuthentication,
} from "@simplewebauthn/browser";
import { Text } from "@/components/Text";
import { Heading } from "@/components/Heading";
import { CheckCircle, XCircle } from "react-feather";
import { Button, variants } from "@/components/Button";
import { useAuthStore } from "@/lib/client/stores/AuthStore";
import { toast } from "react-toastify";
import { startRegistration } from "@simplewebauthn/browser";
import {
  registerOptions,
  verifyRegisterOptions,
} from "@/lib/ServerActions/register";
import {
  genereateAuthOptions,
  verifyAuthOptions,
} from "@/lib/ServerActions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const VALID_USERNAME = /^[A-Za-z0-9 ]+$/;

export default function Login() {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [passkeysAllowed, setPasskeysAllowed] = useState<boolean>(false);

  const registerShown = useAuthStore((state) => state.registerShown);
  const setRegisterShown = useAuthStore((state) => state.setRegisterShown);

  const name = useAuthStore((state) => state.name);
  const setName = useAuthStore((state) => state.setName);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (
        browserSupportsWebAuthn() &&
        (await platformAuthenticatorIsAvailable()) &&
        (await browserSupportsWebAuthnAutofill())
      ) {
        setButtonDisabled(false);
        setPasskeysAllowed(true);
        return;
      }
    })();
  }, []);

  const handleRegister = (name: string) => {
    if (name.length < 3) {
      return toast.error("Username should be atleast 3 characters long!");
    }

    if (!VALID_USERNAME.test(name)) {
      return toast.error("Username should be alphanumerical!");
    }

    setButtonDisabled(true);

    registerOptions(name)
      .then((options) => {
        if (!options) throw new Error();
        return startRegistration(options);
      })
      .then(verifyRegisterOptions)
      .then((res) => {
        if (!res) throw new Error();
        router.push("/dashboard");
      })
      .catch((err) => {
        setButtonDisabled(false);
        toast.error("Something went wrong!");
      });
  };

  const handleLogin = () => {
    setButtonDisabled(true);

    genereateAuthOptions()
      .then((options) => {
        if (!options) throw new Error();
        return startAuthentication(options);
      })
      .then(verifyAuthOptions)
      .then((res) => {
        if (!res) throw new Error();
        router.push("/dashboard");
      })
      .catch((err) => {
        setButtonDisabled(false);
        toast.error("Something went wrong!");
      });
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-sm w-full">
      <section className="flex flex-col gap-2 w-full items-center">
        <Heading size="l">
          {registerShown
            ? "Get Started with Tremble"
            : "Welcome back to Tremble"}
        </Heading>

        <Text variant="gray" className="flex flex-row items-center gap-2">
          {passkeysAllowed
            ? " Passkeys are supported"
            : "Passkeys are not supported"}
          {passkeysAllowed ? (
            <CheckCircle className="text-green-600" />
          ) : (
            <XCircle className="text-red-500" />
          )}
        </Text>
      </section>
      <section className="flex flex-row items-center w-full">
        <button
          className={
            "py-1 text-center w-full rounded-l-sm lg:text-base text-sm " +
            (registerShown
              ? "bg-white text-text-800"
              : "bg-background-600 text-text-50")
          }
          onClick={() => setRegisterShown(true)}
        >
          Register
        </button>
        <button
          className={
            "py-1 text-center w-full rounded-r-sm lg:text-base text-sm " +
            (registerShown
              ? "bg-background-600 text-text-50"
              : "bg-white text-text-800")
          }
          onClick={() => setRegisterShown(false)}
        >
          Login
        </button>
      </section>

      <form
        className="w-full flex flex-col items-center gap-4 border-2 rounded lg:p-8 p-6 border-background-600"
        onSubmit={(e) => {
          e.preventDefault();
          if (registerShown) {
            handleRegister(name);
          } else {
            handleLogin();
          }
        }}
      >
        <div className="flex flex-col items-start w-full gap-2">
          <Heading>{registerShown ? "Register" : "Login"}</Heading>
          <Text variant="gray">
            {registerShown
              ? "Choose a suitable name"
              : "Select a name from the list"}
          </Text>
        </div>
        {registerShown ? (
          <input
            placeholder="Name"
            spellCheck={false}
            value={name}
            maxLength={32}
            className={variants({ variant: "input" }) + " w-full"}
            onChange={(e) => {
              setName(e.target.value);
            }}
            disabled={buttonDisabled}
          />
        ) : null}
        <Button
          type="submit"
          disabled={buttonDisabled && !passkeysAllowed}
          className="w-full"
        >
          {registerShown ? "Register" : "Login"}
        </Button>
        <Text className="text-center" variant="gray">
          By registering and signing up with Tremble, you agree to our{" "}
          <Link href={"/terms"} className={variants({ variant: "link" })}>
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href={"/privacy"} className={variants({ variant: "link" })}>
            Privacy Policy
          </Link>
          .
        </Text>
      </form>
    </div>
  );
}
