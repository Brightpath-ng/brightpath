import { TutorApplicationForm } from "@/features/tutors/components/TutorApplicationForm";

export default function BecomeATutorPage() {
  return (
    <main className="px-6 py-16 sm:py-24">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
          Teach With BrightPath
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
          Tell us about yourself and the subjects you teach. Our team reviews every application
          before you&rsquo;re matched with students.
        </p>
      </div>
      <TutorApplicationForm />
    </main>
  );
}
