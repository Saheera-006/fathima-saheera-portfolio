# Saheera Portfolio — Updated Source

The visual design and existing UI have been preserved. This update focuses on safer image uploads, Firestore persistence, and preventing the homepage from crashing when optional data is missing.

## Image save flow

1. The selected image is optimized in the browser.
2. The image is uploaded to Cloudinary using the configured cloud name and an **unsigned upload preset**.
3. The returned HTTPS `secure_url` is stored in the portfolio data.
4. The portfolio data (including that URL) is written to Firestore at `portfolio/content`.

## Before testing uploads

- In the admin panel, open **Cloud & Storage**.
- Confirm the Cloudinary cloud name shown is the one belonging to your Cloudinary account.
- Enter the exact **unsigned** upload preset configured in that account, save it, and click **Test Connection**. A preset name cannot be verified from source code alone.
- Log in with the Firebase admin account whose UID matches `adminUid` in `firebase-applet-config.json`.
- For images uploaded inside an edit modal, click the modal's **Save** button after the upload completes. The upload places the URL into the form; saving the form persists it to Firestore.

## Verify a saved image

After a successful save, open Firebase Console → Firestore Database → `portfolio` → `content`. Find the corresponding project/certification/profile field and confirm it contains the Cloudinary `https://res.cloudinary.com/...` URL.

## Run locally

```bash
npm install
npm run dev
```

To check TypeScript:

```bash
npm run lint
```

To build production assets:

```bash
npm run build
```

Cloudinary credentials/preset settings and Firebase permissions are external account settings. They must be valid for uploads and writes to succeed; source code cannot guarantee a live save without testing against those accounts.
