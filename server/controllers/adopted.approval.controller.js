import Pet from "../model/pet.model.js";

export const getAdoptionRequests = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === "admin") {
        filter.petStatus = { $in: ["under approval", "adopted"] };
    } else {
        filter.owner = req.user._id;
        filter.petStatus = { $in: ["under approval", "adopted"] };
    }

    const pets = await Pet.find(filter).populate("owner", "name email");
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch adoption requests" });
  }
};

export const ApprovalAndRejectOfRequest = async (req, res) => {
  try {
    const { decision } = req.body;
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.petStatus !== "under approval") {
      return res.status(400).json({ message: "Pet is not under approval" });
    }

    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    // Approve
    if (decision === "approved") {
      pet.petStatus = "adopted";
      pet.adminApproval.status = "approved";
    }

    // Reject
    if (decision === "rejected") {
      pet.petStatus = "available";
      pet.owner = null;
      pet.adminApproval.status = "rejected";
    }

    pet.adminApproval.dateAndTime = new Date();

    await pet.save();

    res.status(200).json({
      message: `Adoption ${decision} successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to process decision" });
  }
};
