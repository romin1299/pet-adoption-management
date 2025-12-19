import { useEffect, useState } from "react";
import api from "../../API/axios.js";
import { useAuth } from "../../ContextAPI/useAuth.js";
import AddAndEditModel from "./SubComponent/AddAndEditModel.jsx";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPets = async () => {
    const res = await api.get("/pets", {
      params: {
        page,
        limit: 10,
      },
      withCredentials: true,
    });
    setPets(res.data?.pets || []);
    setTotalPages(res?.data?.pagination?.totalPages);
  };

  useEffect(() => {
    if (loading) return;
    if (user?.role === "admin") {
      (async () => {
        await fetchPets();
      })();
    }
  }, [loading, user, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pet?")) return;

    await api.delete(`/pets/${id}`, {
      withCredentials: true,
    });
    if (pets?.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      fetchPets();
    }
  };

  if (loading) {
    return <h4 className="text-center mt-5">Loading...</h4>;
  }
  if (user?.role !== "admin") {
    return <h4 className="text-center mt-5">Access Denied</h4>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Pet Registration</h4>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingPet(null);
            setShowModal(true);
          }}
        >
          + Add Pet
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {pets?.map((pet) => (
            <tr key={pet._id}>
              <td>{pet.name}</td>
              <td>{pet.species}</td>
              <td>{pet.breed}</td>
              <td>{pet.age}</td>
              <td className="text-capitalize">{pet.gender}</td>
              <td className="text-capitalize">{pet.petStatus}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditingPet(pet);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(pet._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {pets?.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No pets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-sm btn-secondary me-2"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="align-self-center">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-sm btn-secondary ms-2"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <AddAndEditModel
          pet={editingPet}
          onClose={() => setShowModal(false)}
          onSuccess={fetchPets}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
