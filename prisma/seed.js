import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import { prisma } from '../src/db/prisma.js';
import { hashPassword } from '../src/utils/password.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, 'data', 'jobs_rows.csv');

const seedUserInput = {
  email: 'seed.jobs@example.com',
  name: 'Seed Jobs User',
  passwordHash: hashPassword('SeedPassword123!'),
};

function parseBoolean(value) {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();

  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;

  throw new Error(`Invalid boolean value: ${value}`);
}

function parseDate(value, fieldName) {
  const date = new Date(String(value ?? '').trim());

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date for ${fieldName}: ${value}`);
  }

  return date;
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeNullableText(value) {
  const normalized = normalizeText(value);
  return normalized || null;
}

function normalizeMultiValue(value) {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(', ');
}

function getJobSignature(job) {
  return [job.authorId, job.company, job.position, job.postedAt.toISOString()].join('::');
}

function mapRowToJob(row, authorId) {
  return {
    company: normalizeText(row.company),
    position: normalizeText(row.position),
    role: normalizeText(row.role),
    level: normalizeText(row.level),
    contract: normalizeText(row.contract),
    languages: normalizeMultiValue(row.languages),
    tools: normalizeMultiValue(row.tools),
    logoUrl: normalizeNullableText(row.logo_url),
    location: normalizeText(row.location),
    jobDesc: normalizeText(row.jobdesc),
    responsibilities: normalizeText(row.responsibilities),
    nice2have: normalizeNullableText(row.nice2have),
    about: normalizeNullableText(row.about),
    eoeStatement: normalizeNullableText(row.eoestatement),
    requirements: normalizeNullableText(row.requirements),
    isNew: parseBoolean(row.is_new),
    isFeatured: parseBoolean(row.is_featured),
    postedAt: parseDate(row.posted_at, 'posted_at'),
    createdAt: parseDate(row.created_at, 'created_at'),
    authorId,
  };
}

async function readJobsCsv() {
  const csvText = await fs.promises.readFile(csvPath, 'utf8');

  return parse(csvText, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: false,
  });
}

async function ensureSeedUser() {
  const existingUser = await prisma.user.findUnique({
    where: { email: seedUserInput.email },
  });

  if (existingUser) {
    return existingUser;
  }

  return prisma.user.create({
    data: seedUserInput,
  });
}

async function main() {
  const seedUser = await ensureSeedUser();
  const rows = await readJobsCsv();
  const jobs = rows.map((row) => mapRowToJob(row, seedUser.id));
  const existingJobs = await prisma.job.findMany({
    where: { authorId: seedUser.id },
    select: {
      authorId: true,
      company: true,
      position: true,
      postedAt: true,
    },
  });
  const existingSignatures = new Set(existingJobs.map((job) => getJobSignature(job)));
  const seenCsvSignatures = new Set();
  const jobsToCreate = jobs.filter((job) => {
    const signature = getJobSignature(job);

    if (existingSignatures.has(signature) || seenCsvSignatures.has(signature)) {
      return false;
    }

    seenCsvSignatures.add(signature);
    return true;
  });

  if (jobsToCreate.length > 0) {
    await prisma.job.createMany({
      data: jobsToCreate,
    });
  }

  console.log(
    `Processed ${jobs.length} jobs: created ${jobsToCreate.length}, skipped ${jobs.length - jobsToCreate.length} for ${seedUser.email}`,
  );
}

main()
  .catch((error) => {
    console.error('Seed failed');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
