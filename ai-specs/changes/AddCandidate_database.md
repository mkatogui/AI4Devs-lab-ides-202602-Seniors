# Ticket 1 — Database and storage: Add Candidate

## Goal

Persist candidates and CV files so the backend can create and read them. This ticket covers only the data model, migration, and file storage location—no API or frontend.

## Reference

- User story: **Add Candidate to the System** (recruiter adds candidates with name, surname, email, phone, address, education, experience, CV upload).
- Schema file: [backend/prisma/schema.prisma](../../backend/prisma/schema.prisma).
- Data model spec: [ai-specs/specs/data-model.md](../specs/data-model.md).

---

## Scope

### 1. Prisma schema

**File:** `backend/prisma/schema.prisma`

**Decision:** Use a **normalized** model (separate `Education` and `WorkExperience` models) to support future autocomplete and listing. Store a single CV path on `Candidate` (no separate `Resume` table for this ticket).

**Add the following:**

- **Model `Candidate`**
  - `id` — Int, @id, @default(autoincrement())
  - `firstName` — String
  - `lastName` — String
  - `email` — String, @unique
  - `phone` — String?
  - `address` — String?
  - `cvFilePath` — String? (path to stored file, e.g. relative to upload root)
  - `createdAt` — DateTime, @default(now())
  - `updatedAt` — DateTime, @updatedAt
  - Relation: `educations` — Education[] (one-to-many)
  - Relation: `workExperiences` — WorkExperience[] (one-to-many)

- **Model `Education`**
  - `id` — Int, @id, @default(autoincrement())
  - `institution` — String
  - `title` — String (degree/certification)
  - `startDate` — DateTime
  - `endDate` — DateTime?
  - `candidateId` — Int, relation to Candidate
  - `candidate` — Candidate relation (many-to-one)

- **Model `WorkExperience`**
  - `id` — Int, @id, @default(autoincrement())
  - `company` — String
  - `position` — String
  - `description` — String?
  - `startDate` — DateTime
  - `endDate` — DateTime?
  - `candidateId` — Int, relation to Candidate
  - `candidate` — Candidate relation (many-to-one)

Keep the existing `User` model unchanged.

### 2. Migration

- Run: `npx prisma migrate dev --name add_candidate_education_work_experience`
- Verify that the migration is created under `backend/prisma/migrations/` and applied to the database.
- Run `npx prisma generate` if needed so the Prisma Client is up to date.

### 3. CV file storage

- **Directory:** Store uploaded CVs under `backend/uploads/cvs/` (or `backend/storage/cvs/`). Choose one and use it consistently.
- **.gitignore:** Add the upload directory so uploaded files are not committed, e.g.:
  - `backend/uploads/` or `backend/storage/`
- **Runtime:** The backend (Ticket 2) will create the directory at startup or on first upload if it does not exist. This ticket only defines the path and .gitignore; implementation of creation logic is in the backend ticket.
- **No DB table for files:** A single `cvFilePath` on `Candidate` is sufficient for this feature. A separate `Resume` model can be added later if multiple CVs per candidate are required.

---

## Out of scope (this ticket)

- API implementation (POST /candidates, file upload handler).
- Validation logic (email format, required fields, file type/size).
- Frontend or any UI.

---

## Definition of done

- [ ] `Candidate`, `Education`, and `WorkExperience` models added to `backend/prisma/schema.prisma` with correct relations.
- [ ] Migration created and applied; PostgreSQL has the new tables.
- [ ] Upload directory path defined (e.g. `backend/uploads/cvs/`) and that path (or parent) added to `.gitignore`.
- [ ] `npx prisma generate` runs successfully; Prisma Client types include the new models.
- [ ] All names and comments in English.

---

## Implementation order (for developer/AI)

1. Edit `backend/prisma/schema.prisma`: add `Candidate`, `Education`, `WorkExperience` as above.
2. Run `npx prisma migrate dev --name add_candidate_education_work_experience` from `backend/`.
3. Add upload directory path to `backend/.gitignore` (e.g. `uploads/` or `storage/`).
4. Run `npx prisma generate` and confirm no errors.
5. Optionally document the chosen upload path in [ai-specs/specs/development_guide.md](../specs/development_guide.md) or [ai-specs/specs/data-model.md](../specs/data-model.md).
