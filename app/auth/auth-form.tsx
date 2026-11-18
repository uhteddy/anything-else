"use client";

import Link from "next/link";
import { useActionState } from "react";

type AuthMode = "login" | "signup";

type AuthActionState = {
  error?: string;
  message?: string;
};

type AuthAction = (
  previousState: AuthActionState,
  formData: FormData,
) => Promise<AuthActionState>;

type AuthFormProps = {
  mode: AuthMode;
  action: AuthAction;
  nextPath: string;
};

export default function AuthForm({ mode, action, nextPath }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignUp = mode === "signup";
  const alternatePath = isSignUp ? "/login" : "/signup";
  const nextQuery =
    nextPath === "/host" ? "" : `?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-5">
        <Link href="/" className="link link-hover w-fit text-sm">
          ← Anything Else
        </Link>

        <section className="card border border-base-300 bg-base-100 shadow-md">
          <div className="card-body gap-5">
            <header>
              <span className="badge badge-soft badge-primary">Instructor</span>
              <h1 className="mt-3 text-3xl font-bold">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-base-content/70">
                {isSignUp
                  ? "Create an instructor account to build and host quizzes."
                  : "Sign in to manage your quizzes and host a game."}
              </p>
            </header>

            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="next" value={nextPath} />

              {isSignUp && (
                <fieldset className="fieldset">
                  <label htmlFor="displayName" className="fieldset-legend">
                    Your name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="name"
                    className="input input-bordered w-full"
                    placeholder="e.g. Alex Morgan"
                    maxLength={100}
                    required
                  />
                </fieldset>
              )}

              <fieldset className="fieldset">
                <label htmlFor="email" className="fieldset-legend">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="input input-bordered w-full"
                  placeholder="you@example.com"
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <label htmlFor="password" className="fieldset-legend">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="input input-bordered w-full"
                  minLength={isSignUp ? 6 : undefined}
                  required
                />
                {isSignUp && (
                  <p className="label">Use at least 6 characters.</p>
                )}
              </fieldset>

              {state.error && (
                <p className="alert alert-error" role="alert">
                  {state.error}
                </p>
              )}
              {state.message && (
                <p className="alert alert-info" role="status">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg mt-1"
                disabled={pending}
              >
                {pending
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create instructor account"
                    : "Sign in"}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/70">
              {isSignUp ? "Already have an account?" : "New to Anything Else?"}{" "}
              <Link
                href={`${alternatePath}${nextQuery}`}
                className="link link-primary font-semibold"
              >
                {isSignUp ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
