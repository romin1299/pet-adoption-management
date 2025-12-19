import Pet from "../model/pet.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllPets = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Pet.countDocuments();

    const { searchByNameAndBreed, species, breed, age } = req.query;

    const filter = {};

    if (searchByNameAndBreed) {
      filter.$or = [
        { name: { $regex: searchByNameAndBreed, $options: "i" } },
        { breed: { $regex: searchByNameAndBreed, $options: "i" } },
      ];
    }
    if (species) filter.species = species;
    if (breed) filter.breed = breed;
    if (age) filter.age = Number(age);

    const pets = await Pet.find(filter)
      .populate("owner", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      pets,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch pets" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "PetUploadPhoto/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});

export const createPet = async (req, res) => {
  try {
    const { name, age, breed, species, gender, description, petStatus } =
      req.body;

    const pet = await Pet.create({
      name,
      age,
      breed,
      species,
      gender,
      description,
      image_url: req.file ? req.file.filename : null,
      petStatus,
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ message: "Failed to create pet" });
  }
};

export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    Object.assign(pet, req.body);

    if (req.file) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "PetUploadPhoto",
        pet.image_url
      );

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err.message);
        } else {
          console.log("Old image deleted successfully");
        }
      });
      pet.image_url = req.file.filename;
    }
    await pet.save();

    res.status(200).json(pet);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to update pet" });
  }
};

export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await pet.deleteOne();
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete pet" });
  }
};

export const requestAdoption = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.petStatus !== "available") {
      return res
        .status(400)
        .json({ message: "Pet is not available for adoption" });
    }

    pet.petStatus = "under approval";
    pet.owner = req.user._id;
    pet.RequestedAt = new Date();
    pet.adminApproval = {
      status: "pending",
      dateAndTime: new Date(),
    };

    await pet.save();

    res.status(200).json({
      message: "Adoption request submitted, pending admin approval",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to request adoption" });
  }
};

export const getPetFilterOptions = async (req, res) => {
  try {
    const species = await Pet.distinct("species");
    const breeds = await Pet.distinct("breed");
    const ages = await Pet.distinct("age");

    res.status(200).json({
      species: species.sort(),
      breeds: breeds.sort(),
      ages: ages.sort((a, b) => a - b),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch filter options",
    });
  }
};

