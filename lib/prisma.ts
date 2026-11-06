import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { PrismaClient } from "./generated/prisma/client";
import { createPrismaClient } from "./prisma-client";

const POOL_CLOSE_DELAY_MS = 5_000;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const perRequest = new WeakMap<object, PrismaClient>();

function requestContext() {
  try {
    return getCloudflareContext().ctx;
  } catch {
    return null;
  }
}

function clientForRequest(ctx: NonNullable<ReturnType<typeof requestContext>>) {
  const cached = perRequest.get(ctx);
  if (cached) return cached;
  const { client, pool } = createPrismaClient();
  perRequest.set(ctx, client);
  ctx.waitUntil(
    new Promise((resolve) => setTimeout(resolve, POOL_CLOSE_DELAY_MS)).then(() => pool.end()),
  );
  return client;
}

function currentClient() {
  const ctx = requestContext();
  if (ctx) return clientForRequest(ctx);
  globalForPrisma.prisma ??= createPrismaClient().client;
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = currentClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
