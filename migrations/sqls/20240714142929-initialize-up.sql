/* Replace with your SQL commands */
CREATE TABLE "users" (
    "user_id" bigserial PRIMARY KEY,
    "email" varchar UNIQUE NOT NULL,
    "password" varchar NOT NULL,
    "phone" varchar NOT NULL,
    "user_type" varchar NOT NULL,
    "first_name" varchar,
    "last_name" varchar,
    "profile_picture" text,
    "verification_code" integer,
    "expiry_time" timestamp,
    "is_verified" boolean NOT NULL DEFAULT false,
    "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX ON "users" ("phone");