"use client";

import { useActionState } from "react";
import {
  createLobbyAction,
  type CreateLobbyActionState,
} from "@/app/host/start/actions";

export function CreateLobbyForm({ quizId }: { quizId: string }) {
  const initialState: CreateLobbyActionState = {};
  const [state, formAction, isPending] = useActionState(
    createLobbyAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="quizId" value={quizId} />
      {state.error && (
        <p className="alert alert-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={isPending}>
        {isPending ? "Opening lobby..." : "Create lobby"}
      </button>
    </form>
  );
}
