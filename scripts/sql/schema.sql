DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS projectData;

DROP TABLE IF EXISTS projectImages;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS userAccess;
DROP TABLE IF EXISTS userSettings;

CREATE TABLE "projects" (
	"id"	INTEGER,
	"guid" INTEGER,
	"name"	TEXT,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "projects" ("id","guid","name") VALUES(1, '99ad01ac-062d-44f1-3c9d-69e1bf815700','Project 1');

CREATE TABLE "projectData" (
	"id" INTEGER,
	"projectId" INTEGER,
	"name" TEXT,
	"url" TEXT,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "projectData" ("projectId","name","url") VALUES(1,'purdy home page','https://purdyandfigg.com');


CREATE TABLE "projectImages" (
	"id"	INTEGER,
	"propertyId" INTEGER,
	"cfid"	INTEGER,
	"filename"	TEXT,
	"url" TEXT,
	"draft" INTEGER DEFAULT 1,
	"isDeleted" INTEGER DEFAULT 0,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);


INSERT INTO "project_images" ("propertyId","cfid","filename","url") VALUES(1, '99ad01ac-062d-44f1-3c9d-69e1bf815700','Dcondo-Sign-Chiang-Mai-rental-condos-1.webp','https://imagedelivery.net/9dYZtR12J2uzlEZe4Joa5w/99ad01ac-062d-44f1-3c9d-69e1bf815700/public');



CREATE TABLE "user" (
	"id"	INTEGER,
	"name"	TEXT,
	"email" TEXT,
	"phone" TEXT,
	"cryptoAddress" TEXT,
	"username" TEXT,
	"password" TEXT,
	"apiSecret" TEXT,
	"confirmed" TEXT DEFAULT 0,
	"verifyCode" TEXT,
	"isVerified" INTEGER DEFAULT 0,
	"isBlocked" INTEGER DEFAULT 0,
	"isAdmin" INTEGER DEFAULT 0,
	"resetPassword" INTEGER DEFAULT 0,
	"adminId" INTEGER,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "user" ("name","email","phone","cryptoAddress","username","password","apiSecret","confirmed","isBlocked","isAdmin","isDeleted","adminId") VALUES ('cryptoskillz','test@orbitlabs.xyz','123456789','0x1521a6B56fFF63c9e97b9adA59716efF9D3A60eB','cryptoskillz','test','a7fd098f-79cf-4c37-a527-2c9079a6e6a1',1,0,1,0,0);
INSERT INTO "user" ("name","email","phone","cryptoAddress","username","password","apiSecret","confirmed","isBlocked","isAdmin","isDeleted","adminId") VALUES ('seller 2','test@test.com','123456789','0x060A17B831BFB09Fe95B244aaf4982ae7E8662B7','test','test','a7fd098f-79cf-4c37-a527-2c9079a6e6a1',1,0,0,0,1);


CREATE TABLE "userAccess" (
	"id"	INTEGER,
	"userId"	INTEGER,
	"foreignId" INTEGER,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "userAccess" ("userId","foreignId") VALUES (1,1);
INSERT INTO "userAccess" ("userId","foreignId") VALUES (2,1);


CREATE TABLE "userSettings" (
	"id"	INTEGER,
	"companyName"  TEXT,
	"userId" INTEGER,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "userSettings" ("companyName","userId") VALUES ('good company',1);
