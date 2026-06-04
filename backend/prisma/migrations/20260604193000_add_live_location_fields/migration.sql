-- Separate profile address location from real-time discovery location.
ALTER TABLE "CandidateProfile"
  ADD COLUMN "liveLocationWKT" TEXT,
  ADD COLUMN "liveLocationUpdatedAt" TIMESTAMP(3);

ALTER TABLE "RecruiterProfile"
  ADD COLUMN "liveLocationWKT" TEXT,
  ADD COLUMN "liveLocationUpdatedAt" TIMESTAMP(3);
