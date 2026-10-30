# Portfolio update notes

## Included in this package
- Skills category labels removed from the public skills constellation and admin skills list/editor. Existing stored category values are retained only for backward compatibility.
- Project editor now supports manually entered implementation detail rows. Enter one per line using `Type: details`, for example `Database: Firebase Firestore`, `Frontend: React`, `Tools: Git, GitHub`. Any custom type is accepted.
- Hero section content is explicitly left-aligned.

## Important status
This source package is based on the latest portfolio ZIP available in the conversation. The requested persistent homepage section ordering and multi-record Education CRUD still require further integration with the current Firestore data model; they are not represented as complete in this package. The production build could not be verified in this environment because dependencies were unavailable to install. Please run `npm ci` and `npm run build` locally before deploying.
