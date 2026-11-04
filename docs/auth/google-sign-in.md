# Google sign-in

PACE uses Supabase's Google OAuth flow with a PKCE callback at `/auth/callback`.
The login layout follows Figma's Auth desktop frame `128:184` and mobile frame
`128:337` in file `DkEUeJcwgYA7jklHsH6HpT`.

The existing shadcn Card and Button were retained using the CLI, and the Funnel
Display wordmark font was added through a CLI font registry item. The official
shadcn registry has no standalone header or footer component matching this frame;
its header search yields a sidebar block and its footer search only font items.
The simple header and footer therefore use semantic landmarks to preserve Figma.
Mobile recording text retains the 12px font and 17px line height with a small
letter-spacing correction for browser font metrics to keep the three-line notice.

## Hosted provider setup

1. In Google Cloud, create a Web application OAuth client for PACE.
2. Configure the consent screen for an External audience. Publish it for production
   so users do not have to be individually added as test users. Do not restrict
   sign-in by school domain.
3. Add `https://hqlvekxkwaghkuktydmj.supabase.co/auth/v1/callback` as an authorized
   Google redirect URI. This is the Supabase callback, not the Next.js callback.
4. In the `gait` Supabase project's Authentication provider settings, enable Google
   and enter the Google client ID and secret. Keep nonce checking enabled and
   require an email address.
5. In Supabase Authentication URL Configuration, set the deployed Site URL and
   allow the deployed `/auth/callback` URL, `http://localhost:3000/auth/callback`,
   and `http://127.0.0.1:3000/auth/callback` as needed.
6. Verify first sign-in and returning sign-in with an existing verified email,
   dashboard access, login-page redirection, and sign-out in a real browser.

The Supabase MCP currently available to this workspace can inspect the database
but does not expose Auth provider settings. Google credentials must be configured
through an authenticated dashboard or the Supabase Management API.

## Identity and profile preservation

Supabase automatically links Google identities to existing Auth users with the
same verified email. This preserves the Auth user ID used by every PACE relation.
The callback validates the user with Supabase, requires a confirmed email and a
Google identity, and upserts by that ID. Updates change only name and email.
Existing roles, approval status, Classes, enrollments, and submissions stay intact.
New rows receive the temporary `student` role until the contract ticket removes it.
The existing hosted `handle_new_user` trigger also defaults to `student`.

An email uniqueness conflict fails sign-in and clears the session rather than
replacing another user or moving their relations. Unexpected legacy identity
conflicts need investigation; the callback never deletes an account to fix them.
Dashboard routing uses the stored role, not user-editable metadata.

## Verification

Run `npx tsc --noEmit`, `npm run build`, and
`npx vitest run app/auth/callback/route.test.ts`.
For the full test suite, set `DATABASE_URL` to an isolated database with the Prisma
schema applied. Existing server-action tests insert and delete real rows.

References:
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/auth-identity-linking
