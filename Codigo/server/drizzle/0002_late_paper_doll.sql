ALTER TABLE "student_profiles" ADD COLUMN "cep" varchar(9) NOT NULL DEFAULT '00000-000';--> statement-breakpoint
ALTER TABLE "student_profiles" ALTER COLUMN "cep" DROP DEFAULT;
