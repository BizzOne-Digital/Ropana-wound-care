/**
 * Creates or updates the admin account from environment variables.
 *
 *   npm run seed:admin
 *
 * The password is read from ADMIN_PASSWORD and hashed before it is stored.
 * No credential is ever written into source control by this script.
 */
import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../src/models/Admin";

config({ path: ".env.local" });
config({ path: ".env" });

// Must stay in step with MIN_ADMIN_PASSWORD_LENGTH in src/lib/validation.ts.
const MIN_PASSWORD_LENGTH = 10;

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";

  if (!uri || uri.startsWith("PASTE_")) {
    throw new Error("MONGODB_URI is not set in .env.local.");
  }
  if (!email || email.startsWith("paste_") || !email.includes("@")) {
    throw new Error("ADMIN_EMAIL is not set to a valid address in .env.local.");
  }
  if (!password || password.startsWith("PASTE_")) {
    throw new Error("ADMIN_PASSWORD is not set in .env.local.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`
    );
  }

  await mongoose.connect(uri);

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await Admin.findOne({ email });

  if (existing) {
    existing.name = name;
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`Updated the password for existing admin: ${email}`);
  } else {
    await Admin.create({ email, name, passwordHash, role: "admin" });
    console.log(`Created admin: ${email}`);
  }

  console.log("Sign in at /admin/login");
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("\nSeeding failed:", error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
