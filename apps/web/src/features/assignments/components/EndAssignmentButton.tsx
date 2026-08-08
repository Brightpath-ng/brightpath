"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@brightpath/ui";
import { Modal } from "@/components/ui/modal";
import { endAssignment } from "../api/actions";

interface EndAssignmentButtonProps {
  assignmentId: string;
  studentName: string;
  tutorName: string;
}

export function EndAssignmentButton({
  assignmentId,
  studentName,
  tutorName,
}: EndAssignmentButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await endAssignment(assignmentId);
        setIsOpen(false);
        router.refresh();
      } catch {
        setError("Couldn't end this assignment. Please try again.");
      }
    });
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        End assignment
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="End this assignment?"
        description={`${tutorName} will no longer be assigned to ${studentName}. This can't be undone -- you'd need to create a new assignment to reconnect them.`}
      >
        <div className="flex flex-col gap-3">
          {error ? (
            <p role="alert" className="text-sm" style={{ color: "var(--red)" }}>
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isPending}
              loading={isPending}
            >
              {isPending ? "Ending..." : "End assignment"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
