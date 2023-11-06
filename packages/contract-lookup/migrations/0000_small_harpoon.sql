DO $$ BEGIN
 CREATE TYPE "contractMetadataSource" AS ENUM('blockscout', 'etherscan');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contractMetadatas" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chainId" integer NOT NULL,
	"address" varchar NOT NULL,
	"source" "contractMetadataSource" NOT NULL,
	"name" varchar NOT NULL,
	"abi" jsonb NOT NULL,
	"sourceCode" varchar,
	"implementationAddress" varchar
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contractMetadatas_chainId_address_index" ON "contractMetadatas" ("chainId","address");