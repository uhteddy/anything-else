"use server";

import { redirect } from "next/navigation";
import { signIn, signOut, signUp } from "@/lib/auth";

type AuthActionState = {
  error?: string;
  message?: string;
};

function getTextField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getSafeNextPath(formData: FormData) {
  const candidate = getTextField(formData, "next");
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/host";
  }

  const url = new URL(candidate, "http://localhost");
  return url.origin === "http://localhost"
    ? `${url.pathname}${url.search}${url.hash}`
    : "/host";
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getTextField(formData, "email");
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const { error } = await signIn(email, password);
  if (error) {
    return { error: "We couldn't sign you in with those credentials." };
  }

  redirect(getSafeNextPath(formData));
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const displayName = getTextField(formData, "displayName");
  const email = getTextField(formData, "email");
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!displayName || !email || !password) {
    return { error: "Complete each field to create your instructor account." };
  }

  if (displayName.length > 100) {
    return { error: "Your name must be 100 characters or fewer." };
  }

  if (password.length < 6) {
    return { error: "Your password must be at least 6 characters." };
  }

  const { data, error } = await signUp(email, password, displayName);
  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      message: "Account created. Check your email to confirm it before signing in.",
    };
  }

  redirect(getSafeNextPath(formData));
}

export async function signOutAction() {
  const { error } = await signOut();
  if (error) {
    throw new Error(`Unable to sign out: ${error.message}`);
  }

  redirect("/login");
}
