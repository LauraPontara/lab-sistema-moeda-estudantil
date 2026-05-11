ALTER TABLE "users" DROP CONSTRAINT "users_cpf_unique";--> statement-breakpoint
ALTER TABLE "professor_profiles" ADD COLUMN "name" varchar(160) NOT NULL;--> statement-breakpoint
ALTER TABLE "professor_profiles" ADD COLUMN "cpf" varchar(14) NOT NULL;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD COLUMN "name" varchar(160) NOT NULL;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD COLUMN "cpf" varchar(14) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "cpf";--> statement-breakpoint
ALTER TABLE "professor_profiles" ADD CONSTRAINT "professor_profiles_cpf_unique" UNIQUE("cpf");--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_cpf_unique" UNIQUE("cpf");