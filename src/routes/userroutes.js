// routes/userroutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller");
const { verifyToken, verifyRole } = require("../middleware/auth");

// ✅ Créer un utilisateur (seul superadmin)
router.post("/", verifyToken, verifyRole(["superadmin"]), userController.createUser);

// ✅ Récupérer tous les utilisateurs (vue Super Admin)
router.get("/", verifyToken, verifyRole(["superadmin"]), userController.getUsers);

// ✅ Supprimer un utilisateur
router.delete("/:id", verifyToken, verifyRole(["superadmin"]), userController.deleteUser);

// ✅ Login (publique)
router.post("/login", userController.login);

// Modifier un utilisateur
router.put("/:id", verifyToken, verifyRole(["superadmin"]), userController.updateUser);

module.exports = router;
