# Security Specification & Test-Driven Hardening

## 1. Data Invariants
- **Identity Integrity**: A user can only create or edit their own profile (`request.auth.uid == userId`). An author can only publish posts or comments with their matching `authorId == request.auth.uid`.
- **Role Elevation Guard**: Standard users cannot elevate their own role to `admin` or change `isBanned` state.
- **Master Gates & Relational Sync**: Comments must reference an existing valid `postId`.
- **Anti-Update-Gap**: Updates must only touch permitted fields (e.g. liking a post only modifies `likes` and `likedByUserIds`).
- **Denial-of-Wallet & Volumetric Boundaries**: Document IDs must be alphanumeric and <= 128 characters (`isValidId`). Content strings must strictly observe max length boundaries (e.g. text <= 3000 chars, content <= 1000 chars).
- **Default Deny**: All undefined endpoints and collections reject read/write requests.

## 2. The Dirty Dozen Payloads (Targeting PERMISSION_DENIED)
1. **Payload 1 (Identity Spoofing - Post)**: Unauthenticated user attempting to create a post.
2. **Payload 2 (Author ID Spoofing)**: Authenticated user `user-123` attempting to create a post with `authorId: 'victim-456'`.
3. **Payload 3 (Role Elevation)**: User updating their profile with `{ role: 'admin' }`.
4. **Payload 4 (Ban Evasion)**: Banned user attempting to write or modify a post.
5. **Payload 5 (Oversized Content Injection)**: Creating a post with a 10MB text string violating max length.
6. **Payload 6 (Comment Impersonation)**: Creating a comment where `authorId != request.auth.uid`.
7. **Payload 7 (Report Tampering)**: Modifying a report submitted by someone else or resolving without admin privileges.
8. **Payload 8 (Arbitrary Shadow Field)**: Updating a post with an injected ghost property `{ injectedScript: true }`.
9. **Payload 9 (ID Poisoning Attack)**: Injecting invalid control characters or a 2KB string as document ID.
10. **Payload 10 (Direct Admin Doc Hijacking)**: Non-admin trying to write to `/admins/{id}` collection.
11. **Payload 11 (Unauthenticated Delete)**: Guest or standard user trying to delete another user's post.
12. **Payload 12 (Like Count Inflation)**: Modifying post `text` or `authorId` during a like update action.

## 3. Test Runner Design
All tests must assert that unauthorized or structurally invalid mutations trigger Firestore `PERMISSION_DENIED`.
