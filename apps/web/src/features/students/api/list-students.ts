import { z } from "zod";
import { StudentProfileSchema, type StudentProfile } from "@brightpath/types";
import { apiFetch } from "@/lib/api-client";

const ListStudentsSchema = z.array(StudentProfileSchema);

export function listMyStudents(): Promise<StudentProfile[]> {
  return apiFetch("/students", ListStudentsSchema);
}
