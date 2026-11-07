import { createServer, type Server } from "node:http";
import type { BrowserContext } from "@playwright/test";

export async function mockBrowserAuth(id: string) {
  const user = { id, email: `${id}@test.com`, aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {} };
  const server: Server = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  });
  await new Promise<void>((resolve) => server.listen(55463, resolve));
  return {
    async signIn(context: BrowserContext) {
      const expires = Math.floor(Date.now() / 1000) + 3600;
      const encoded = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
      const token = `${encoded({ alg: "HS256", typ: "JWT" })}.${encoded({ sub: id, exp: expires, aud: "authenticated" })}.mock-signature`;
      const session = { access_token: token, refresh_token: "mock-refresh-token", expires_at: expires, expires_in: 3600, token_type: "bearer", user };
      await context.addCookies([{ name: "sb-localhost-auth-token", value: `base64-${encoded(session)}`, domain: "localhost", path: "/" }]);
    },
    async close() {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    },
  };
}
