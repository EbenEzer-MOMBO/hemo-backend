-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transfusion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" INTEGER NOT NULL,
    "bloodBagId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'brouillon',
    CONSTRAINT "Transfusion_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transfusion_bloodBagId_fkey" FOREIGN KEY ("bloodBagId") REFERENCES "BloodBag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transfusion" ("bloodBagId", "date", "id", "patientId") SELECT "bloodBagId", "date", "id", "patientId" FROM "Transfusion";
DROP TABLE "Transfusion";
ALTER TABLE "new_Transfusion" RENAME TO "Transfusion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
