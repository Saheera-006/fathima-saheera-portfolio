# Firestore portfolio structure

The portfolio is now stored in separate documents inside the existing `portfolio` collection:

- `portfolio/profile` — profile, education, social links, SEO, and contact details as direct fields.
- `portfolio/storyStages` — `{ items: [...] }` for the story stages.
- `portfolio/projects` — `{ items: [...] }` for projects.
- `portfolio/experience` — `{ items: [...] }` for experience.
- `portfolio/skills` — `{ items: [...] }` for skills.
- `portfolio/certifications` — `{ items: [...] }` for certificates.

Each section document also has an `updatedAt` timestamp. The app listens to the collection and combines these documents into the same in-memory portfolio shape, so existing page components and UI do not need to change. Saves write only the section that changed.

## Existing data migration

When the admin opens the dashboard and the new section documents do not exist, the app checks the old `portfolio/content` document. If found, it copies the existing data into the new documents. It intentionally leaves the old document in place as a backup; after verifying the website works, it can be removed manually from Firestore.

## Security rules

The included `firestore.rules` permits public reads and only allows writes from the configured admin UID. Deploy these rules to Firebase Console only after confirming the UID matches `adminUid` in `firebase-applet-config.json`.
