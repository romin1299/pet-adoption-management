import { useState } from "react";
import api from "../../../API/axios";

const AddAndEditModel = ({ pet, onClose, onSuccess }) => {
  const [form, setForm] = useState(
    pet || {
      name: "",
      age: "",
      breed: "",
      species: "",
      gender: "male",
      description: "",
      image_url: "",
      petStatus: "available",
    }
  );
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (image) {
      formData.append("image", image); // 🔥 must match backend key
    }

    if (pet) {
      await api.put(`/pets/${pet._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    } else {
      await api.post("/pets", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {pet ? "Edit Pet" : "Add New Pet"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  name="name"
                  placeholder="Pet Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  name="species"
                  placeholder="Species (Dog, Cat, etc.)"
                  value={form.species}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  name="breed"
                  placeholder="Breed"
                  value={form.breed}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  name="petStatus"
                  value={form.petStatus}
                  onChange={handleChange}
                >
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
              <div className="col-12">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {pet?.image_url && (
                <div className="col-12 text-center">
                  <img
                    src={`http://localhost:7000/PetUploadPhoto/${pet.image_url}`}
                    alt="preview"
                    style={{ maxHeight: "150px", borderRadius: "6px" }}
                  />
                </div>
              )}
              <div className="col-12">
                <textarea
                  className="form-control"
                  name="description"
                  placeholder="Description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAndEditModel;
