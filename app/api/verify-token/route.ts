import { NextRequest } from "next/server";
import { verifyPasswordResetToken } from "@/lib/actions/auth-actions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;

  const result = await verifyPasswordResetToken(token);

  return Response.json(result, {
    status: result.success ? 200 : 400
  });
}