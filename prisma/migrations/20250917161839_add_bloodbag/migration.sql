-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BloodBag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorId" INTEGER NOT NULL,
    "bloodType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "collectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disponible',
    CONSTRAINT "BloodBag_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BloodBag" ("bloodType", "collectedAt", "donorId", "expiresAt", "id", "quantity", "status") SELECT "bloodType", "collectedAt", "donorId", "expiresAt", "id", "quantity", "status" FROM "BloodBag";
DROP TABLE "BloodBag";
ALTER TABLE "new_BloodBag" RENAME TO "BloodBag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
