import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { loginSchema } from "@/lib/validation";
import { AUTH_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth";
import { fail, ok, parseBody, serverError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = await parseBody(request, loginSchema);
  if (!parsed.success) return parsed.response;

  const { email, password } = parsed.data;

  try {
    await dbConnect();

    // passwordHash is select:false on the schema, so ask for it explicitly.
    const admin = await Admin.findOne({ email }).select("+passwordHash");

    // Always run a comparison so response timing does not reveal whether the
    // account exists, and always return the same generic message.
    const hash =
      admin?.passwordHash ??
      "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin";
    const valid = await bcrypt.compare(password, hash);

    if (!admin || !valid) {
      return fail("Email or password is incorrect.", 401);
    }

    const token = await signSession({
      sub: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const store = await cookies();
    store.set(AUTH_COOKIE, token, sessionCookieOptions());

    return ok({ name: admin.name, email: admin.email, role: admin.role });
  } catch (error) {
    return serverError("auth.login", error);
  }
}
