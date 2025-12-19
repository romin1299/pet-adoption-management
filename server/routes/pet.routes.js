import express from "express";
import {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  upload,
  requestAdoption,
  getPetFilterOptions,
} from "../controllers/pet.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/authorization.middleware.js";

const router = express.Router();

router.get("/filters", getPetFilterOptions);

router.get("/", getAllPets);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  upload.single("image"),
  createPet
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  upload.single("image"),
  updatePet
);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deletePet);

router.post(
  "/:id/adopt",
  authMiddleware,
  authorizeRoles("user"),
  requestAdoption
);

export default router;
