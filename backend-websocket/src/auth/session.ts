export type BetterAuthSession = {
  session: { userId: string };
  user: { id: string };
} | null;

export async function getSession(
  cookie: string | undefined,
): Promise<BetterAuthSession> {
  if (!cookie) return null;

  const res = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
    { headers: { cookie } },
  );

  if (!res.ok) return null;
  return res.json() as Promise<BetterAuthSession>;
}
