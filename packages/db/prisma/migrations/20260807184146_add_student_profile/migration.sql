-- CreateEnum
CREATE TYPE "LearningTrack" AS ENUM ('tutor_led', 'hybrid', 'self_directed');

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "school" TEXT,
    "class" TEXT,
    "learningGoals" TEXT,
    "learningChallenges" TEXT,
    "learningTrack" "LearningTrack" NOT NULL DEFAULT 'tutor_led',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_profiles_parentId_idx" ON "student_profiles"("parentId");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
