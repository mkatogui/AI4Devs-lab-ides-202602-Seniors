# Data Model — LTI Talent Tracking System

This document describes the data model for the LTI ATS application. Defined in `backend/prisma/schema.prisma`.

## Current schema

### User

- `id`: Int, PK, auto-increment  
- `email`: String, unique  
- `name`: String?, optional  

### Candidate (Add Candidate feature)

Represents a job candidate in the ATS.

| Field       | Type     | Constraints / Notes                    |
|------------|----------|----------------------------------------|
| id         | Int      | PK, auto-increment                     |
| firstName  | String   | Required                               |
| lastName   | String   | Required                               |
| email      | String   | Required, unique                       |
| phone      | String?  | Optional                               |
| address    | String?  | Optional                               |
| cvFilePath | String?  | Path to stored CV file (see CV storage) |
| createdAt  | DateTime | @default(now())                        |
| updatedAt  | DateTime | @updatedAt                             |
| educations | Education[] | One-to-many relation               |
| workExperiences | WorkExperience[] | One-to-many relation        |

**Validation (backend):** Email format, required fields non-empty, CV file type PDF or DOCX, max file size (e.g. 10MB).

### Education

- `id`: Int, PK, auto-increment  
- `institution`: String  
- `title`: String (degree/certification)  
- `startDate`: DateTime  
- `endDate`: DateTime?  
- `candidateId`: Int, FK to Candidate (onDelete: Cascade)  

### WorkExperience

- `id`: Int, PK, auto-increment  
- `company`: String  
- `position`: String  
- `description`: String?  
- `startDate`: DateTime  
- `endDate`: DateTime?  
- `candidateId`: Int, FK to Candidate (onDelete: Cascade)  

### CV storage

- **Upload directory:** `backend/uploads/cvs/`. Uploaded CV files (PDF/DOCX) are stored here. The path (relative or absolute) is saved in `Candidate.cvFilePath`.
- **.gitignore:** `backend/uploads` is ignored so uploaded files are not committed.
- The backend creates the directory at startup or on first upload (see Ticket 2).

---

## Implementation notes

- Migrations: `npx prisma migrate dev` from `backend/`.
- Keep API and validation rules aligned with [api-spec.yml](./api-spec.yml) and [backend-standards.mdc](./backend-standards.mdc).
- All names and documentation in **English**.
