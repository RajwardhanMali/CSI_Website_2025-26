CREATE TABLE "volunteers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"vit_email" varchar(255) NOT NULL,
	"prn" varchar(50) NOT NULL,
	"contact" varchar(15) NOT NULL,
	"campus" varchar(50) NOT NULL,
	"branch" varchar(50) NOT NULL,
	"division" varchar(10) NOT NULL,
	"domains" jsonb NOT NULL,
	"experience" text NOT NULL,
	"new_idea" text NOT NULL,
	"why_csi" text NOT NULL,
	"questions" text,
	"additional_info" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "volunteers_email_unique" UNIQUE("email")
);
