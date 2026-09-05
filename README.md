# Ropana Wound Care

Website and content management system for Ropana Wound Care, a mobile wound care practice serving the Dallas-Fort Worth area.

The public site is a lead-generation site: its job is to get qualified booking requests and contact enquiries. The admin dashboard is what the practice uses to manage the content the public site shows, and to work through the enquiries it produces.

---

## 1. Project overview

**Public website**

| Route | Purpose |
| --- | --- |
| `/` | Homepage. Hero, credentials, services, mobile care, telehealth, why choose us, practitioner, testimonials, FAQ, closing CTA. |
| `/about` | The practice and the clinician. |
| `/services` | All published services. |
| `/services/[slug]` | Individual service page. |
| `/testimonials` | All published testimonials. |
| `/faq` | Searchable questions and answers. |
| `/booking` | Booking **request** form. |
| `/contact` | Contact details and message form. |
| `/privacy`, `/terms` | Baseline legal pages (see section 12). |

**Admin dashboard** (`/admin`, sign in at `/admin/login`)

Overview statistics, booking management, contact management, and full create/read/update/delete for services, testimonials, FAQs and site imagery.

**Content that is database-driven, not hardcoded:** services, testimonials, FAQs, contact submissions, booking requests, and the logo plus the three main site photographs.

---

## 2. Tech stack

- **Next.js 15** (App Router, React Server Components) and **React 19**
- **TypeScript** in strict mode
- **Tailwind CSS v4** with a single design-token layer
- **MongoDB** with **Mongoose**
- **Zod** for server-side validation of every request body
- **jose** (JWT) + **bcryptjs**, HTTP-only cookies, edge middleware
- **Image uploads stored as binary in MongoDB** and served through a Node route, so they survive redeploys on a read-only serverless filesystem
- **Motion** for entrance transitions, **Phosphor Icons** for iconography

---

## 3. Installation

```bash
npm install
cp .env.example .env.local
```

Then fill in `.env.local` (section 4), seed the admin account (section 7), and start the dev server:

```bash
npm run dev
```

The site runs at http://localhost:3000 and the dashboard at http://localhost:3000/admin.

---

## 4. Environment variables

Every variable lives in `.env.local`, which is git-ignored. `.env.example` is the committed template. **Never commit `.env.local` and never paste secrets into source files.**

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | yes | Full origin, no trailing slash. Used for canonical URLs, Open Graph and the sitemap. |
| `MONGODB_URI` | yes | Atlas connection string including the database name. |
| `JWT_SECRET` | yes | At least 32 characters. Sessions break if this changes. |
| `ADMIN_NAME` | seeding only | Display name for the seeded account. |
| `ADMIN_EMAIL` | seeding only | Sign-in address. |
| `ADMIN_PASSWORD` | seeding only | At least 10 characters. Hashed before storage; never read at runtime. |
| `NEXT_PUBLIC_BUSINESS_NAME` | yes | |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | yes | |
| `NEXT_PUBLIC_BUSINESS_PHONE` | yes | Ten digits, no formatting. Displayed and linked automatically. |
| `NEXT_PUBLIC_SERVICE_AREA` | yes | |

Generate a `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

---

## 5. MongoDB setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write access.
3. Under **Network Access**, allow the IP addresses that will connect. For Vercel, `0.0.0.0/0` is the usual choice because deployment IPs are not fixed; restrict it if your plan supports static egress.
4. Copy the connection string and append the database name, for example `.../ropana?retryWrites=true&w=majority`.
5. Paste it into `MONGODB_URI`.

Indexes are declared on the models and created automatically on first connection.

---

## 6. Image uploads

There is no third-party media service and no disk storage to configure. Uploads work as soon as `MONGODB_URI` is set.

**Why it is built this way.** Vercel and comparable serverless hosts give each deployment a read-only or ephemeral filesystem. Anything written to `public/uploads` disappears on the next deploy, and is invisible to other instances in the meantime. Storing the bytes in MongoDB means an uploaded image is durable, is immediately available to every instance, and needs no extra credentials.

**How it works.**

1. The admin image field posts `multipart/form-data` to `POST /api/upload` with two fields: `file` and `folder`.
2. The route requires an admin session, checks `folder` against the whitelist (`products`, `gallery`, `pages`, `misc`), checks the mime type (JPEG, PNG, WebP, GIF) and the 8 MB size cap, then generates a filename of `${Date.now()}-${randomHex}.${ext}`.
3. The bytes are written to the `StoredUpload` collection with a unique index on `(folder, filename)`.
4. The route returns `{ success: true, url, filename, size, folder }`, where `url` is `/api/uploads/<folder>/<filename>`.
5. `GET /api/uploads/[folder]/[filename]` sanitises the path, loads the document and streams the binary with the correct `Content-Type`, `Content-Length` and `Cache-Control: public, max-age=31536000, immutable`.

**What the content documents store.** Only the returned URL string. A service has a single `image: string`; a site image slot has a single `value: string`. The binary is never duplicated onto the document.

**Cleanup.** Whenever an image reference changes, the old binary is deleted. `deleteUploadByUrl` in `src/lib/uploads.server.ts` only acts on `/api/uploads/...` URLs, so external URLs are left alone. It runs when a service is updated or deleted, when a site image slot is replaced or cleared, and, via `DELETE /api/upload?url=...`, when the admin field replaces an image it uploaded during the current editing session before the form was saved.

**Caching cost.** Because the filename contains a timestamp and random hex, a given URL always returns the same bytes, so the `immutable` header is safe and the CDN absorbs repeat requests. Note the trade-off: each cache miss is a function invocation plus a database read, rather than a static file served from the edge.

**Size limits.** The 8 MB cap keeps every document well inside MongoDB's 16 MB BSON document limit. The cap is enforced twice: once against the browser-reported `file.size`, and again against the real buffer length after reading.

**Legacy `/uploads/...` URLs.** If any value in the database still points at the old disk path, `resolveImageSrc` degrades it to `/placeholder-image.svg` rather than rendering a broken image, and the Media screen shows a warning telling the admin which slots to re-upload.

---

## 7. Admin setup

With `ADMIN_EMAIL` and `ADMIN_PASSWORD` set in `.env.local`:

```bash
npm run seed:admin
```

The script hashes the password with bcrypt before storing it. Running it again for the same email updates that account's password, which is how you perform a password reset.

Optionally, seed starter services and FAQs so the site is not empty on first load:

```bash
npm run seed:content
```

This creates four services and seven questions, all editable in the dashboard. It skips anything that already exists, so it is safe to re-run. **It deliberately seeds no testimonials.** Those must be real feedback, added by the practice.

---

## 8. Development commands

```bash
npm run dev            # start the dev server
npm run build          # production build
npm run start          # serve the production build
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm run seed:admin     # create or update the admin account
npm run seed:content   # seed starter services and FAQs
```

---

## 9. Admin login

Sign in at `/admin/login` with the seeded email and password.

- The session is a signed JWT in an HTTP-only, `SameSite=Lax` cookie, `Secure` in production, expiring after 8 hours.
- `src/middleware.ts` redirects unauthenticated visitors away from every `/admin` route before a page renders.
- The dashboard layout re-checks the session server-side, and every admin API route calls `requireAdmin()`. A middleware bypass alone cannot expose data.
- No token is ever written to `localStorage` or exposed to client JavaScript.

---

## 10. Production deployment (Vercel)

1. Push the repository to GitHub, GitLab or Bitbucket.
2. Import it in Vercel. The framework preset, build command and output are detected automatically.
3. Add every variable from section 4 under **Settings → Environment Variables**, for the Production environment. Set `NEXT_PUBLIC_APP_URL` to the real domain, for example `https://ropanawoundcare.com`.
4. Allow Vercel's egress in MongoDB Atlas **Network Access** (section 5).
5. Deploy.
6. Seed the admin account against the production database. The simplest route is to point `MONGODB_URI` in your local `.env.local` at production temporarily and run `npm run seed:admin`, then change it back.
7. Sign in at `https://your-domain/admin/login` and add the real content and photography.

There are no hardcoded localhost URLs; everything derives from `NEXT_PUBLIC_APP_URL`. `/admin` and `/api` are excluded from `robots.txt`, and admin pages send `noindex`.

---

## 11. Design tokens and branding

**Every colour in this project is defined in one place: `src/app/globals.css`.**

The current palette is a placeholder chosen for the brief's "calm, clinical, premium" direction. **The client's logo had not been supplied when this was built.** When it arrives:

1. Sample its dominant colours.
2. Replace only the `--brand-*` values in the `:root` block and in the two dark-mode blocks directly beneath it.
3. Nothing else needs to change. Buttons, links, navigation, icons, section accents, form focus states, CTA sections and the admin dashboard all resolve from those variables.

Other locked conventions:

- **One accent colour**, used identically across every section.
- **One radius scale**: controls 10px, cards 14px, badges pill.
- **Typography**: Geist, loaded through `next/font` and self-hosted at build time.
- **Dark mode** follows the visitor's system preference. Both modes are defined from the same token names, so hierarchy and contrast hold in each.

---

## 12. Content that still needs the client

These are deliberate gaps, not oversights. Each is marked with a `TODO(client)` comment in the code.

**Photography.** The hero, practitioner portrait, mobile care image and service images currently use stable placeholder URLs from `picsum.photos`. Replace them in **Admin → Media** and in each service's edit screen; no code change is needed. Real images are needed for:

| Placement | Suggested shape |
| --- | --- |
| Homepage hero | Portrait or landscape, 1200px+ wide |
| Practitioner portrait (homepage and About) | Portrait, 900px+ wide |
| Mobile care section | Landscape, 1100px+ wide |
| Each service card and detail page | Landscape 16:10, 800px+ wide |

**Logo.** Upload in **Admin → Media**. Until then the header and footer show a Ropana wordmark.

**Testimonials.** None are seeded, and none should be invented. Add real feedback, with the patient's permission, in **Admin → Testimonials**. The public site shows a tidy empty state until the first one is published.

**Legal pages.** `/privacy` and `/terms` are conservative baselines covering website use only. They make no claim about HIPAA status, business associate agreements or clinical record handling, because those depend on the practice's own agreements. **Both need client and legal review before launch.**

**Claims.** No certifications, affiliations, accreditations, awards or healing outcomes are asserted anywhere. The only credential stated is the board certification supplied in the brief. Keep it that way unless the client provides verifiable evidence.

---

## 13. Project structure

```
src/
  app/
    (site)/          public website, wrapped in header/footer
    admin/
      login/         unauthenticated sign-in screen
      (dashboard)/   authenticated dashboard, sidebar shell
    api/             route handlers
    globals.css      DESIGN TOKENS - the only place colours are defined
  components/
    site/            public-site sections and forms
    admin/           dashboard shell, managers, uploader, toasts
    ui/              buttons, fields, section primitives, states
  lib/
    site.ts          business facts and client-supplied selling points
    db.ts            cached Mongoose connection
    auth.ts          JWT signing and verification
    content.ts       public read queries
    admin-data.ts    dashboard read queries
    validation.ts    Zod schemas
    api.ts           route-handler helpers and the admin guard
    uploads.ts        upload whitelists and URL helpers (client-safe)
    uploads.server.ts binary cleanup helpers
  models/            Mongoose schemas
  middleware.ts      edge auth gate for /admin
scripts/             seed scripts
```

---

## 14. API reference

| Method | Route | Access |
| --- | --- | --- |
| `POST` | `/api/auth/login` | public |
| `POST` | `/api/auth/logout` | public |
| `GET` | `/api/auth/me` | admin |
| `POST` | `/api/contact` | public |
| `GET` | `/api/contact` | admin |
| `PATCH` `DELETE` | `/api/contact/[id]` | admin |
| `POST` | `/api/bookings` | public |
| `GET` | `/api/bookings` | admin |
| `PATCH` `DELETE` | `/api/bookings/[id]` | admin |
| `GET` | `/api/services` | public (published only; `?all=1` is admin) |
| `POST` | `/api/services` | admin |
| `GET` `PATCH` `DELETE` | `/api/services/[id]` | admin |
| `GET` | `/api/testimonials` | public (published only; `?all=1` is admin) |
| `POST` | `/api/testimonials` | admin |
| `PATCH` `DELETE` | `/api/testimonials/[id]` | admin |
| `GET` | `/api/faqs` | public (published only; `?all=1` is admin) |
| `POST` | `/api/faqs` | admin |
| `PATCH` `DELETE` | `/api/faqs/[id]` | admin |
| `POST` | `/api/upload` | admin. Multipart `file` + `folder`. Returns `{ success, url, filename, size, folder }`. |
| `DELETE` | `/api/upload?url=` | admin. Discards an unreferenced upload. |
| `GET` | `/api/uploads/[folder]/[filename]` | public. Streams the stored image. |
| `GET` `PUT` | `/api/settings` | admin |

Responses use a consistent envelope: `{ ok: true, data }` or `{ ok: false, error, fields? }`, where `fields` maps a form field name to its first validation message.

---

## 15. Troubleshooting

**Admin pages show "We could not reach the database."**
`MONGODB_URI` is wrong, or your IP is not in the Atlas Network Access list. The server console shows the underlying Mongoose error.

**Sign-in returns 500.**
`JWT_SECRET` is missing or shorter than 32 characters.

**Everyone is signed out after a deploy.**
`JWT_SECRET` changed between environments. Existing cookies no longer verify. Set one value and keep it.

**Image upload returns 413 or 415.**
413 means the file is over the 8 MB cap; 415 means the type is not JPEG, PNG, WebP or GIF. Both limits live in `src/lib/uploads.ts` and are enforced server-side.

**Image upload returns 401.**
The admin session expired. Sign in again.

**An uploaded image 404s.**
The `StoredUpload` document is missing, which normally means the owning document was deleted (its binary is cleaned up with it) or the URL was edited by hand. Re-upload the image.

**Images show the placeholder instead of a photo.**
The stored value is either empty or a legacy `/uploads/...` disk path. Re-upload it in the admin dashboard.

**`next/image` throws an error about a local or remote path.**
Local paths are restricted by `images.localPatterns` and remote hosts by `images.remotePatterns`, both in `next.config.ts`. Add the path or host there.

**Content edited in the dashboard does not appear on the public site.**
Mutations call `revalidatePath`. If a page still looks stale, hard-refresh; in production, confirm the mutation returned success rather than a validation error.

**`npm run seed:admin` says a variable is not set.**
It reads `.env.local` from the project root. Confirm the placeholder values from `.env.example` have actually been replaced.

**A seed command fails with "Could not determine Node.js install directory".**
This is npm's own launcher failing intermittently, not the script. It was observed roughly once in five runs on Windows with npm 11 and a project path containing spaces (`Ropona Wound care`). Re-run the command, or bypass the wrapper:

```bash
./node_modules/.bin/tsx scripts/seed-admin.ts
```

Direct invocation was stable across repeated runs. Moving the project to a path without spaces also avoids it.

**The dev server floods the console with `ENOENT ... .next/routes-manifest.json`.**
`npm run dev` and `npm run build` both write to `.next` and will corrupt each other's output if run at the same time. Stop the dev server, delete `.next`, and start again. Run one or the other, never both.

**A page returns HTTP 200 while showing not-found content.**
That is a soft 404 and search engines will index it. The cause is a `loading.tsx` in a segment at or above a page that calls `notFound()`: it creates a Suspense boundary, the response shell flushes with 200, and the status can no longer be changed. See section 17 before adding any new `loading.tsx`.

---

## 16. Two constraints to preserve

These both come from defects found during end-to-end verification. Re-introducing either is easy, and neither is caught by `npm run build`, `tsc` or ESLint.

**Do not add `loading.tsx` at or above `services/[slug]`.**

A `loading.tsx` creates a Suspense boundary around everything in its segment and below. The response shell then flushes with HTTP 200 before the page body runs, so a later `notFound()` cannot set the status: `/services/<unknown-slug>` returned **200 with not-found content**, a soft 404. There is no way for a child segment to opt out of an inherited boundary, so the boundaries live on leaf segments that never call `notFound()` (`about`, `faq`, `testimonials`, `contact`, `booking`) and there is deliberately none at the `(site)` root or under `services`. If you need a loading state for the services list, wrap the grid in an explicit `<Suspense>` inside `services/page.tsx` rather than adding a `loading.tsx`.

**Keep `export const dynamic = "force-dynamic"` on `services/[slug]`.**

With static generation, Next cached the `notFound()` result for an unknown slug as a successful prerender and served it under `Cache-Control: s-maxage=31536000`. That is a soft 404 held for a year, and it would also serve stale not-found content if a service were later created at that slug. Services are created and deleted from the dashboard at any time, so this route must not be statically cached. `generateStaticParams` was removed for the same reason; the sitemap still lists every published service, so discovery is unaffected.

---

## 17. Notes on scope

- A booking submission is a **request**, never an automatically confirmed appointment. The wording in the form, the success state, the terms page and the dashboard all say so. Do not change that language without clinical and legal sign-off.
- Contact and booking forms ask visitors **not** to submit sensitive medical information, and they are not designed to receive it.
- Emergency guidance pointing to 911 appears on both forms, in the footer disclaimer and on the terms page.
- Uploads are never written to the local filesystem. Do not reintroduce `public/uploads` storage: it breaks on any host with a read-only or per-deployment filesystem.
