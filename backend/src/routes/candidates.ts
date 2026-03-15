/**
 * POST /candidates — create candidate (JSON or multipart/form-data with optional CV).
 */

import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import prisma from '../db';
import { validateCandidatePayload } from '../validation/candidates';

const CVS_DIR = path.join(__dirname, '..', '..', 'uploads', 'cvs');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, CVS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const safeExt = ['.pdf', '.docx'].includes(ext.toLowerCase()) ? ext : '.bin';
    cb(null, `${randomUUID()}${safeExt}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('CV must be PDF or DOCX, max 10MB'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const router = Router();

/**
 * GET /candidates — list candidates (newest first). Auth required.
 */
async function listCandidates(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
        cvFilePath: true,
      },
    });
    res.json({ data: candidates });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /candidates
 * Body: JSON { firstName, lastName, email, phone?, address?, educations?, workExperiences? }
 *   or multipart/form-data with same fields + optional file field "cv" (PDF/DOCX, max 10MB).
 */
async function createCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let body: Record<string, unknown> = req.body as Record<string, unknown>;
    let cvFilePath: string | undefined;

    const file = req.file as Express.Multer.File | undefined;
    if (file && file.path) {
      cvFilePath = path.relative(path.join(__dirname, '..', '..'), file.path);
    }

    const payload = validateCandidatePayload(body);

    const candidate = await prisma.candidate.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone ?? null,
        address: payload.address ?? null,
        cvFilePath: cvFilePath ?? null,
        educations: payload.educations?.length
          ? {
              create: payload.educations.map((e) => ({
                institution: e.institution,
                title: e.title,
                startDate: new Date(e.startDate),
                endDate: e.endDate ? new Date(e.endDate) : null,
              })),
            }
          : undefined,
        workExperiences: payload.workExperiences?.length
          ? {
              create: payload.workExperiences.map((w) => ({
                company: w.company,
                position: w.position,
                description: w.description ?? null,
                startDate: new Date(w.startDate),
                endDate: w.endDate ? new Date(w.endDate) : null,
              })),
            }
          : undefined,
      },
      include: {
        educations: true,
        workExperiences: true,
      },
    });

    res.status(201).json({
      message: 'Candidate created successfully',
      data: {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        address: candidate.address,
        cvFilePath: candidate.cvFilePath,
        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,
        educations: candidate.educations,
        workExperiences: candidate.workExperiences,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Run multer only for multipart/form-data; otherwise next() so body stays from express.json().
 */
function optionalMulter(req: Request, res: Response, next: NextFunction): void {
  const contentType = req.get('Content-Type') || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('cv')(req, res, next);
  }
  next();
}

router.get('/', listCandidates);
router.post('/', optionalMulter, createCandidate);

export const candidatesRouter = router;
export { CVS_DIR };
export { createCandidate };
