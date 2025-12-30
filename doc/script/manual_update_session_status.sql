-- Migration to update sessions table default status from 'scheduled' to 'pending'
-- Run this in your database if Prisma migrate fails due to shadow database permissions

-- 1. Alter the default value for new sessions
ALTER TABLE sessions 
ALTER COLUMN status SET DEFAULT 'pending';

-- 2. (Optional) Update existing 'scheduled' sessions to 'pending' if needed
-- Uncomment the line below if you want to update existing sessions
-- UPDATE sessions SET status = 'pending' WHERE status = 'scheduled';

-- Note: The status column now supports the following values:
-- 'pending' - Session requested but not yet approved by mentor
-- 'scheduled' - Session approved and confirmed
-- 'completed' - Session has been completed
-- 'cancelled' - Session was cancelled by either party
-- 'rejected' - Session request was rejected by mentor
