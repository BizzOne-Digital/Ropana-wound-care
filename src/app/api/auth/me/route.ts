import { getSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Not authorised.", 401);
  return ok({
    name: session.name,
    email: session.email,
    role: session.role,
  });
}
