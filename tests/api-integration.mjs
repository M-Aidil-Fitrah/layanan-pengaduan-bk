import assert from "node:assert/strict";

import { Client } from "pg";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const connectionString = process.env.DATABASE_URL;

assert.ok(connectionString, "DATABASE_URL is required for the API integration check");

const anonymousSubmission = {
  audience: "STUDENT",
  category: "PERSONAL",
  consent: true,
  contact: "should-not-be-stored@example.test",
  details: "Data fiktif untuk memeriksa alur pengaduan anonim.",
  isAnonymous: true,
  name: "Should not be stored",
  title: "Pengujian alur anonim",
  urgency: "CONSULTATION",
};

const identifiedSubmission = {
  audience: "PARENT_OR_GUARDIAN",
  category: "ACADEMIC",
  consent: true,
  contact: "contact@example.test",
  details: "Data fiktif untuk memeriksa penyimpanan kontak opsional.",
  isAnonymous: false,
  name: "Pelapor Uji",
  title: "Pengujian alur dengan identitas",
  urgency: "SOON",
};

async function submitComplaint(body) {
  const response = await fetch(`${baseUrl}/api/v1/complaints`, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  const payload = await response.json();

  assert.equal(response.status, 201);
  assert.equal(payload.data.status, "RECEIVED");
  assert.match(payload.data.trackingCode, /^BK-[A-F0-9]{20}$/);
  assert.ok(Number.isFinite(Date.parse(payload.data.createdAt)));

  return payload.data;
}

const database = new Client({ connectionString });

try {
  await database.connect();

  const anonymousResult = await submitComplaint(anonymousSubmission);
  const anonymousRecord = await database.query(
    'SELECT "name", "contact", "isAnonymous" FROM "Complaint" WHERE "trackingCode" = $1',
    [anonymousResult.trackingCode],
  );

  assert.equal(anonymousRecord.rowCount, 1);
  assert.equal(anonymousRecord.rows[0].isAnonymous, true);
  assert.equal(anonymousRecord.rows[0].name, null);
  assert.equal(anonymousRecord.rows[0].contact, null);

  const identifiedResult = await submitComplaint(identifiedSubmission);
  assert.notEqual(identifiedResult.trackingCode, anonymousResult.trackingCode);

  const identifiedRecord = await database.query(
    'SELECT "name", "contact", "isAnonymous" FROM "Complaint" WHERE "trackingCode" = $1',
    [identifiedResult.trackingCode],
  );

  assert.equal(identifiedRecord.rowCount, 1);
  assert.equal(identifiedRecord.rows[0].isAnonymous, false);
  assert.equal(identifiedRecord.rows[0].name, identifiedSubmission.name);
  assert.equal(identifiedRecord.rows[0].contact, identifiedSubmission.contact);

  const trackingResponse = await fetch(
    `${baseUrl}/api/v1/complaints/${anonymousResult.trackingCode}`,
    { cache: "no-store" },
  );
  const trackingPayload = await trackingResponse.json();

  assert.equal(trackingResponse.status, 200);
  assert.deepEqual(
    Object.keys(trackingPayload.data).sort(),
    ["createdAt", "status", "trackingCode"],
  );
  assert.equal(trackingPayload.data.trackingCode, anonymousResult.trackingCode);

  const invalidSubmission = await fetch(`${baseUrl}/api/v1/complaints`, {
    body: JSON.stringify({}),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  assert.equal(invalidSubmission.status, 422);

  const unknownTrackingCode = await fetch(
    `${baseUrl}/api/v1/complaints/BK-FFFFFFFFFFFFFFFFFFFF`,
    { cache: "no-store" },
  );
  assert.equal(unknownTrackingCode.status, 404);

  console.log(JSON.stringify({
    anonymousIdentityRemoved: true,
    createdComplaints: 2,
    publicTrackingFields: Object.keys(trackingPayload.data).sort(),
  }, null, 2));
} finally {
  await database.end();
}
