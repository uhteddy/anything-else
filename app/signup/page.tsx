import { redirect } from "next/navigation";
import AuthForm from "@/app/auth/auth-form";
import { signUpAction } from "@/app/auth/actions";
import { getClaims } from "@/lib/auth";

export const instant = false;

type SignUpPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { data } = await getClaims();
  if (data?.claims) {
    redirect("/host");
  }

  const params = await searchParams;
  const nextPath = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <AuthForm
      mode="signup"
      action={signUpAction}
      nextPath={nextPath ?? "/host"}
    />
  );
}
