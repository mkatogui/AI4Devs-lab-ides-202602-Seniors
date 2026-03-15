import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const TEST_USERS = [
  { email: 'recruiter@lti.demo', password: 'demo123', name: 'Recruiter' },
  { email: 'test@lti.demo', password: 'test123', name: 'Test User' },
];

async function main() {
  for (const { email, password, name } of TEST_USERS) {
    const normalizedEmail = email.trim().toLowerCase();
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: { passwordHash: hash, name },
      create: { email: normalizedEmail, name, passwordHash: hash },
    });
    console.log('Seed: created/updated', email, '(password:', password + ')');
  }
  console.log('\nLocal test users (use at http://localhost:3000/login):');
  console.log('  1. recruiter@lti.demo / demo123');
  console.log('  2. test@lti.demo / test123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
