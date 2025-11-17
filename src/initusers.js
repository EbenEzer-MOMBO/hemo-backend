// initUsers.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function createSuperAdmin() {
  try {
    const superAdminData = {
      username: "superadmin",
      password: "SuperAdmin123",
      role: "superadmin",
    };

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(superAdminData.password, 10);

    // Création du Super Admin
    const superAdmin = await prisma.user.create({
      data: { 
        username: superAdminData.username,
        password: hashedPassword,
        role: superAdminData.role,
      },
    });

    console.log(`Super Admin créé: ${superAdmin.username} (${superAdmin.role})`);
    console.log("Tous les utilisateurs nécessaires pour démarrer sont créés !");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de la création du Super Admin:", err.message);
    process.exit(1);
  }
}

createSuperAdmin();
