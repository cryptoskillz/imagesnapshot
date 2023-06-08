DROP TABLE IF EXISTS userAgents;
DROP TABLE IF EXISTS userBrowsers;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS projectSnapShots;
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

INSERT INTO "projects" ("id","guid","name") VALUES (1, '99ad01ac-062d-44f1-3c9d-69e1bf815700','Purdy');

CREATE TABLE "projectSnapShots" (
	"id"	INTEGER,
	"projectId" INTEGER,
	"screenWidth" INTEGER,
	"screenHeight" INTEGER,	
	"userBrowserId" INTEGER,
	"browserOs" TEXT,
	"browserName"	TEXT,
	"browserDefault" TEXT,
	"agent" TEXT,
	"isActive" INTEGER DEFAULT 1,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1920,1080,1,'Windows 10','Chrome','Chrome (Standard)',1);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1920,1080,2,'macOS','Chrome','Chrome on MacOs',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1284,2778,3,'Iphone','Chrome','Chrome on Iphone',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,2778,2732,4,'Ipad','Chrome','Chrome on Ipad',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1440,1920,5,'Android','Chrome','Chrome on Android',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1440,1920,6,'Android','Chrome','Chrome on Samsung',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1440,1920,7,'Android','Chrome','Chrome on LG',0);

INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1920,1080,8,'Windows 10','Firefox','Firefox (Standard)',0);

INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1920,1080,9,'macOS','Safari','Safari (Standard)',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1284,2778,10,'Iphone','Safari','Safari on Iphone',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,2778,2732,11,'Ipad','Safari','Safari on Ipad',0);

INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1920,1080,12,'Windows 10','Edge','Edge (Standard)',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1920,1080,13,'macOS','Edge','Edge on MacOs',0);
INSERT INTO "projectSnapShots"  ("projectId","screenWidth","screenHeight","userBrowserId","browserOs","browserName","browserDefault","isActive") VALUES(1,1440,1920,14,'Android','Edge','Edge on Android',0);


CREATE TABLE "projectData" (
	"id" INTEGER,
	"projectId" INTEGER,
	"name" TEXT,
	"url" TEXT,
	"previewUrl" TEXT,
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
	"projectId" INTEGER,
	"projectDataId" INTEGER,
	"kvId" TEXT,
	"cfid"	INTEGER,
	"filename"	TEXT,
	"screenWidth" INTEGER,
	"screenHeight" INTEGER,	
	"userBrowserId" INTEGER,
	"browserOs" TEXT,
	"browserName"	TEXT,
	"browserDefault" TEXT,
	"url" TEXT,
	"baseUrl" TEXT,
	"draft" INTEGER DEFAULT 1,
	"isLatest" INTEGER,
	"isBaseline" INTEGER,
	"isPreview" INTEGER,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);


CREATE TABLE "userBrowsers" (
	"id"	INTEGER,
	"browserOs" TEXT,
	"browserName"	TEXT,
	"browserDefault" TEXT,
	"agent" TEXT,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(1,'Windows 10','Chrome','Chrome (Standard)','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(2,'macOS','Chrome','Chrome on MacOs','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(3,'Iphone','Chrome','Chrome on Iphone','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(4,'Ipad','Chrome','Chrome on Ipad','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(5,'Android','Chrome','Chrome on Android','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(6,'Android','Chrome','Chrome on Samsung','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(7,'Android','Chrome','Chrome on LG','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(8,'Windows 10','Firefox','Firefox (Standard)','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(9,'macOS','Safari','Safari (Standard)','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(10,'Iphone','Safari','Safari on Iphone','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(11,'Ipad','Chrome','Safari on Ipad','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(12,'Windows 10','Edge','Edge (Standard)','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(13,'macOS','Edge','Edge on MacOs','');
INSERT INTO "userBrowsers" ("id","browserOs","browserDefault","browserName","agent") VALUES(14,'Android','Edge','Edge on Android','');


CREATE TABLE "userAgents" (
	"id"	INTEGER,
	"userBrowserId" INTEGER,
	"agentName"	TEXT,
	"isActive" INTEGER DEFAULT 1,
	"isDeleted" INTEGER DEFAULT 0,
	"createdAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT,
	"publishedAt" TEXT DEFAULT CURRENT_TIMESTAMP,
	"deletedAt" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(1,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',1);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(1,'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(1,'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(2,'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',1);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(3,'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.50 Mobile/15E148 Safari/604.1',1);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(4,'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.50 Mobile/15E148 Safari/604.1',1);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(5,'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.57 Mobile Safari/537.36',1);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(6,'Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.57 Mobile Safari/537.36',1);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(7,'Mozilla/5.0 (Linux; Android 10; LM-Q720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.57 Mobile Safari/537.36',1);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(8,'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(9,'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(10,'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(11,'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(12,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/113.0.1774.57',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(13,'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/113.0.1774.57',0);
INSERT INTO "userAgents" ("userBrowserId","agentName","isActive") VALUES(14,'Mozilla/5.0 (Linux; Android 10; HD1913) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.60 Mobile Safari/537.36 EdgA/113.0.1774.63',0);



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
