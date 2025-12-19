import { useEffect, useState } from "react";
import api from "../../API/axios";
import { useAuth } from "../../ContextAPI/useAuth";

const AdminAdoptionDashboard = () => {
  const { user, loading } = useAuth();
  const [pets, setPets] = useState([]);

  const fetchAdoptions = async () => {
    const res = await api.get("/approveView/adoptions", {
      withCredentials: true,
    });
    setPets(res.data);
  };

  useEffect(() => {
    if (!loading) {
      (async () => {
        fetchAdoptions();
      })();
    }
  }, [loading, user]);

  const handleDecision = async (id, decision) => {
    await api.post(
      `/approveView/${id}/decision`,
      { decision },
      { withCredentials: true }
    );
    fetchAdoptions();
  };

  if (loading) return <h5 className="text-center mt-5">Loading...</h5>;

  return (
    <div className="container mt-4">
      <h4 className="mb-3">
        {user.role === "admin" ? "Adoption Requests" : "My Adoptions"}
      </h4>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Requested At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {pets.map((pet) => (
            <tr key={pet._id}>
              <td>{pet.name}</td>
              <td>{pet.species}</td>
              <td>{pet.breed}</td>
              <td className="text-capitalize">{pet.petStatus}</td>
              <td>
                {pet.owner ? `${pet.owner.name} (${pet.owner.email})` : "-"}
              </td>
              <td>
                {pet.RequestedAt
                  ? new Date(pet.RequestedAt).toLocaleString()
                  : "-"}
              </td>
              <td>
                {pet.petStatus === "under approval" ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleDecision(pet._id, "approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDecision(pet._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-muted text-capitalize">
                    {pet.adminApproval?.status}
                  </span>
                )}
              </td>
            </tr>
          ))}

          {pets.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No adoption records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAdoptionDashboard;
