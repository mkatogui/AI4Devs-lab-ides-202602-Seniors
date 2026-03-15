/**
 * Validation for candidate create payload.
 * All messages in English.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EducationInput {
  institution: string;
  title: string;
  startDate: string;
  endDate?: string;
}

export interface WorkExperienceInput {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface CandidateCreatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: EducationInput[];
  workExperiences?: WorkExperienceInput[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function parseDate(value: unknown): Date | null {
  if (value === undefined || value === null) return null;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Validates education array. Returns array of validated items or throws with message.
 */
function validateEducations(educations: unknown): EducationInput[] {
  if (educations === undefined || educations === null) return [];
  if (!Array.isArray(educations)) {
    throw new Error('educations must be an array');
  }
  return educations.map((item, i) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`educations[${i}]: invalid entry`);
    }
    const institution = (item as Record<string, unknown>).institution;
    const title = (item as Record<string, unknown>).title;
    const startDate = (item as Record<string, unknown>).startDate;
    const endDate = (item as Record<string, unknown>).endDate;
    if (!isNonEmptyString(institution)) {
      throw new Error(`educations[${i}]: institution is required`);
    }
    if (!isNonEmptyString(title)) {
      throw new Error(`educations[${i}]: title is required`);
    }
    const start = parseDate(startDate);
    if (!start) {
      throw new Error(`educations[${i}]: startDate is required and must be a valid date`);
    }
    const end = endDate !== undefined && endDate !== null ? parseDate(endDate) : undefined;
    return { institution: institution.trim(), title: title.trim(), startDate: start.toISOString(), endDate: end?.toISOString() };
  });
}

/**
 * Validates work experience array. Returns array of validated items or throws with message.
 */
function validateWorkExperiences(workExperiences: unknown): WorkExperienceInput[] {
  if (workExperiences === undefined || workExperiences === null) return [];
  if (!Array.isArray(workExperiences)) {
    throw new Error('workExperiences must be an array');
  }
  return workExperiences.map((item, i) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`workExperiences[${i}]: invalid entry`);
    }
    const obj = item as Record<string, unknown>;
    const company = obj.company;
    const position = obj.position;
    const startDate = obj.startDate;
    const description = obj.description;
    const endDate = obj.endDate;
    if (!isNonEmptyString(company)) {
      throw new Error(`workExperiences[${i}]: company is required`);
    }
    if (!isNonEmptyString(position)) {
      throw new Error(`workExperiences[${i}]: position is required`);
    }
    const start = parseDate(startDate);
    if (!start) {
      throw new Error(`workExperiences[${i}]: startDate is required and must be a valid date`);
    }
    const end = endDate !== undefined && endDate !== null ? parseDate(endDate) : undefined;
    return {
      company: company.trim(),
      position: position.trim(),
      description: description !== undefined && description !== null ? String(description) : undefined,
      startDate: start.toISOString(),
      endDate: end?.toISOString(),
    };
  });
}

/**
 * Validates candidate create payload. Returns sanitized payload or throws with message.
 */
export function validateCandidatePayload(body: Record<string, unknown>): CandidateCreatePayload {
  const firstName = body.firstName;
  const lastName = body.lastName;
  const email = body.email;

  if (!isNonEmptyString(firstName)) {
    throw new Error('firstName is required');
  }
  if (!isNonEmptyString(lastName)) {
    throw new Error('lastName is required');
  }
  if (!isNonEmptyString(email)) {
    throw new Error('email is required');
  }
  if (!isValidEmail(email)) {
    throw new Error('email must be a valid email address');
  }

  const phone = body.phone;
  const address = body.address;
  if (phone !== undefined && phone !== null && typeof phone !== 'string') {
    throw new Error('phone must be a string');
  }
  if (address !== undefined && address !== null && typeof address !== 'string') {
    throw new Error('address must be a string');
  }

  let educations: EducationInput[] = [];
  let workExperiences: WorkExperienceInput[] = [];

  const educationsRaw = body.educations;
  if (educationsRaw !== undefined) {
    let parsed: unknown;
    try {
      parsed = typeof educationsRaw === 'string' ? JSON.parse(educationsRaw) : educationsRaw;
    } catch {
      throw new Error('educations must be valid JSON');
    }
    educations = validateEducations(parsed);
  }
  const workExperiencesRaw = body.workExperiences;
  if (workExperiencesRaw !== undefined) {
    let parsed: unknown;
    try {
      parsed = typeof workExperiencesRaw === 'string' ? JSON.parse(workExperiencesRaw) : workExperiencesRaw;
    } catch {
      throw new Error('workExperiences must be valid JSON');
    }
    workExperiences = validateWorkExperiences(parsed);
  }

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone !== undefined && phone !== null ? String(phone).trim() : undefined,
    address: address !== undefined && address !== null ? String(address).trim() : undefined,
    educations: educations.length > 0 ? educations : undefined,
    workExperiences: workExperiences.length > 0 ? workExperiences : undefined,
  };
}
