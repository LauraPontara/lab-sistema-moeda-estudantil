CREATE TABLE "coin_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professor_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professor_semester_allowances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"professor_id" uuid NOT NULL,
	"semester_code" varchar(8) NOT NULL,
	"amount" integer DEFAULT 1000 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "coin_transfers" ADD CONSTRAINT "coin_transfers_professor_id_users_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coin_transfers" ADD CONSTRAINT "coin_transfers_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professor_semester_allowances" ADD CONSTRAINT "professor_semester_allowances_professor_id_users_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "professor_semester_allowances_professor_semester_unique" ON "professor_semester_allowances" USING btree ("professor_id","semester_code");--> statement-breakpoint
INSERT INTO "professor_semester_allowances" ("professor_id", "semester_code", "amount")
SELECT
  u."id",
  CONCAT(EXTRACT(YEAR FROM CURRENT_DATE)::int, '-', CASE WHEN EXTRACT(MONTH FROM CURRENT_DATE)::int <= 6 THEN '1' ELSE '2' END),
  1000
FROM "users" u
WHERE u."role" = 'PROFESSOR'
ON CONFLICT ("professor_id", "semester_code") DO NOTHING;
