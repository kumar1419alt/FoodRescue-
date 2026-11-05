import { auth, hasConfiguredAuthSecret } from "@/lib/auth/auth";

async function handle(request: Request) {
  if (!hasConfiguredAuthSecret) {
    return Response.json(
      { error: "Authentication is unavailable due to server configuration." },
      { status: 503 },
    );
  }

  return auth.handler(request);
}

export const GET = handle;
export const POST = handle;
