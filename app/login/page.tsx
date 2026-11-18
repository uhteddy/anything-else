import { redirect } from "next/navigation";
import AuthForm from "@/app/auth/auth-form";
import { signInAction } from "@/app/auth/actions";
import { getClaims } from "@/lib/auth";

export const instant = false;

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { data } = await getClaims();
  if (data?.claims) {
    redirect("/host");
  }

  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <AuthForm
      mode="login"
      action={signInAction}
      nextPath={nextPath ?? "/host"}
    />
  );
}
