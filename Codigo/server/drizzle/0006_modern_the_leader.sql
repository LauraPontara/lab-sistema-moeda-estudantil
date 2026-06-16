CREATE TYPE "public"."advantage_category" AS ENUM('ALIMENTACAO', 'EDUCACAO', 'MATERIAL', 'LAZER', 'SERVICOS', 'OUTROS');--> statement-breakpoint
CREATE TABLE "advantage_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"advantage_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"coupon_code" varchar(16) NOT NULL,
	"xp_spent" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "advantage_redemptions_coupon_code_unique" UNIQUE("coupon_code")
);
--> statement-breakpoint
CREATE TABLE "advantages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"category" "advantage_category" NOT NULL,
	"icon" varchar(60) NOT NULL,
	"cost_xp" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "advantage_redemptions" ADD CONSTRAINT "advantage_redemptions_advantage_id_advantages_id_fk" FOREIGN KEY ("advantage_id") REFERENCES "public"."advantages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advantage_redemptions" ADD CONSTRAINT "advantage_redemptions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advantages" ADD CONSTRAINT "advantages_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;