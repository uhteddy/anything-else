"use client";

import { useRef, useState } from "react";

// Styling only: deleting is still a prototype placeholder (arrives in v2).
export function DeleteQuizButton({ quizTitle }: { quizTitle: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost btn-sm rounded-full text-error hover:bg-error/10"
        onClick={() => {
          setConfirmed(false);
          dialogRef.current?.showModal();
        }}
      >
        Delete
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-soft sm:p-8">
          <span
            className={`mx-auto flex size-14 items-center justify-center rounded-full text-2xl font-black ${
              confirmed ? "bg-secondary text-primary" : "bg-error/10 text-error"
            }`}
            aria-hidden="true"
          >
            {confirmed ? "i" : "!"}
          </span>
          {confirmed ? (
            <>
              <h3 className="mt-4 text-xl font-extrabold">Not deleted yet</h3>
              <p className="py-3 text-base-content/70">Deleting quizzes arrives in prototype v2.</p>
            </>
          ) : (
            <>
              <h3 className="mt-4 text-xl font-extrabold wrap-break-word">
                Delete &ldquo;{quizTitle}&rdquo;?
              </h3>
              <p className="py-3 text-base-content/70">
                This removes the quiz and all of its questions. This can&apos;t be undone.
              </p>
            </>
          )}
          <div className="modal-action justify-center">
            <form method="dialog" className="flex flex-wrap justify-center gap-2">
              <button className="btn btn-ghost rounded-full">{confirmed ? "Close" : "Cancel"}</button>
              {!confirmed && (
                <button
                  type="button"
                  className="btn btn-error rounded-full"
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
