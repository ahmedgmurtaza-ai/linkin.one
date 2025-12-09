import { NextRequest } from "next/server";
import { updateUserPassword } from "@/lib/actions/auth-actions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, newPassword } = body;

  const result = await updateUserPassword(email, newPassword);

  return Response.json(result, {
    status: result.success ? 200 : 400
  });
}