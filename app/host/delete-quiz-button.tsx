"use client";

import { useRef, useState } from "react";

export function DeleteQuizButton({ quizTitle }: { quizTitle: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost text-error"
        onClick={() => {
          setConfirmed(false);
          dialogRef.current?.showModal();
        }}
      >
        Delete
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          {confirmed ? (
            <>
              <h3 className="text-lg font-bold">Not deleted yet</h3>
              <p className="py-4">Deleting quizzes arrives in prototype v2.</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold">Delete &ldquo;{quizTitle}&rdquo;?</h3>
              <p className="py-4">
                This removes the quiz and all of its questions. This can&apos;t be undone.
              </p>
            </>
          )}
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">{confirmed ? "Close" : "Cancel"}</button>
              {!confirmed && (
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => setConfirmed(true)}
                >
                  Delete quiz
                </button>
              )}
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </>
  );
}
