CREATE TABLE "users" (
    "user_id" bigserial PRIMARY KEY,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "phone" varchar NOT NULL,
    "user_type" varchar NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT now(),
)