import { z } from "zod";
import { StudentProfileSchema, type StudentProfile } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

const ListStudentsSchema = z.array(StudentProfileSchema);

// Every student, unscoped by parent -- backs the assignment form's student
// picker. Not the parent-facing "my students" list (features/students).
export function listAllStudentsForPicker(): Promise<StudentProfile[]> {
  return apiFetch("/admin/students", ListStudentsSchema);
}
