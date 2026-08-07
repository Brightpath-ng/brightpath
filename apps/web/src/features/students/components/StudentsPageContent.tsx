"use client";

import { useState } from "react";
import { Button } from "@brightpath/ui";
import type { StudentProfile } from "@brightpath/types";
import { PageHeader } from "@/components/PageHeader";
import { Sheet } from "@/components/ui/sheet";
import { ToastContainer, useToast } from "@/components/ui/toast";
import { AddStudentForm } from "./AddStudentForm";
import { StudentsList } from "./StudentsList";

interface StudentsPageContentProps {
  students: StudentProfile[];
}

export function StudentsPageContent({ students }: StudentsPageContentProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const { toasts, addToast, removeToast } = useToast();

  function openSheet() {
    setOpenCount((count) => count + 1);
    setIsSheetOpen(true);
  }

  function handleSuccess() {
    setIsSheetOpen(false);
    addToast("Child added.", "success");
  }

  return (
    <>
      <PageHeader
        title="My Students"
        description="The children you manage on BrightPath."
        action={<Button onClick={openSheet}>Add child</Button>}
      />
      <div className="p-8">
        <StudentsList students={students} />
      </div>

      <Sheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Add a child">
        <AddStudentForm key={openCount} onSuccess={handleSuccess} />
      </Sheet>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
}
