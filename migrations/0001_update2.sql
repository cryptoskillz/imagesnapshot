-- Migration number: 0001 	 2023-06-05T10:58:36.658Z
ALTER TABLE projectData ADD COLUMN snapshotId INTEGER;
ALTER TABLE projectData ADD COLUMN previewUrl TEXT;
ALTER TABLE projectData ADD COLUMN previewSnapshotId INTEGER;
ALTER TABLE projectData ADD COLUMN previousSnapshotId INTEGER;
ALTER TABLE projectImages ADD COLUMN preview INTEGER;
