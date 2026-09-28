CREATE TYPE "QuizQuestionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RETIRED');

CREATE TABLE "quiz_questions" (
    "key" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subjectKind" "SubjectKind",
    "subjectSlug" TEXT,
    "attribute" TEXT,
    "personSlugs" TEXT[],
    "generatedPromptArabic" TEXT NOT NULL,
    "promptArabicOverride" TEXT,
    "choices" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "status" "QuizQuestionStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "quiz_questions_status_topic_idx" ON "quiz_questions"("status", "topic");
CREATE INDEX "quiz_questions_family_idx" ON "quiz_questions"("family");
