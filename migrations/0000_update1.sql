-- Migration number: 0000 	 2023-06-05T10:52:38.205Z
ALTER TABLE projectData ADD COLUMN snapshotId INTEGER;
ALTER TABLE projectData ADD COLUMN previewUrl TEXT;
ALTER TABLE projectData ADD COLUMN previewSnapshotId INTEGER;
ALTER TABLE projectData ADD COLUMN previousSnapshotId INTEGER;
ALTER TABLE projectImages ADD COLUMN preview INTEGER;
