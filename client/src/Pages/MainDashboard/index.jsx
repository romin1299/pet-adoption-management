import { useEffect, useState } from "react";
import api from "../../API/axios";
import { useAuth } from "../../ContextAPI/useAuth";
import shield from "../../assets/shield.png";

const MainDashboard = () => {
  const { user, loading } = useAuth();

  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [confirmPet, setConfirmPet] = useState(null);

  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    age: "",
    searchByNameAndBreed: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    species: [],
    breeds: [],
    ages: [],
  });

  useEffect(() => {
    api.get("/pets/filters").then((res) => {
      setFilterOptions(res.data);
    });
  }, []);

  const fetchPets = async () => {
    const res = await api.get("/pets", {
      params: {
        page,
        limit: 8,
        species: filters.species || undefined,
        breed: filters.breed || undefined,
        age: filters.age || undefined,
        searchByNameAndBreed: filters.searchByNameAndBreed || undefined,
      },
    });

    setPets(res.data.pets);
    setTotalPages(res.data.pagination.totalPages);
  };

  useEffect(() => {
    (async () => {
      await fetchPets();
    })();
  }, [page, filters]);

  useEffect(() => {
    async () => {
      setPage(1);
    };
  }, [filters]);

  const canAdopt = (pet) => {
    return user && user.role === "user" && pet.petStatus === "available";
  };

  if (loading) {
    return <h4 className="text-center mt-5">Loading...</h4>;
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row mb-4 g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or breed"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.species}
              onChange={(e) =>
                setFilters({ ...filters, species: e.target.value })
              }
            >
              <option value="">All Species</option>
              {filterOptions.species.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.breed}
              onChange={(e) =>
                setFilters({ ...filters, breed: e.target.value })
              }
            >
              <option value="">All Breeds</option>
              {filterOptions.breeds.map((br) => (
                <option key={br} value={br}>
                  {br}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.age}
              onChange={(e) => setFilters({ ...filters, age: e.target.value })}
            >
              <option value="">All Ages</option>
              {filterOptions.ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-4">
          {pets.map((pet) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={pet._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`http://localhost:7000/PetUploadPhoto/${pet.image_url}`}
                  alt={pet.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{pet.name}</h6>
                      <p className="text-muted mb-2">{pet.breed}</p>
                    </div>

                    {pet.petStatus === "adopted" && (
                      <div className="d-flex align-items-center">
                        <img
                          src={shield}
                          alt="Shield"
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <p className="text-muted mb-0">Adopted</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setSelectedPet(pet);
                        setShowDetails(true);
                      }}
                    >
                      More Info
                    </button>

                    <button
                      className="btn btn-sm btn-primary"
                      disabled={!canAdopt(pet)}
                      onClick={() => setConfirmPet(pet)}
                    >
                      {pet.petStatus === "under approval"
                        ? "Pending Approval"
                        : "Want to Adopt"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {pets.length === 0 && (
            <div className="text-center mt-5">
              <h5>No pets found</h5>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
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
      </div>

      {showDetails && selectedPet && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedPet.name}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowDetails(false)}
                />
              </div>

              <div className="modal-body">
                <img
                  src={`http://localhost:7000/PetUploadPhoto/${selectedPet.image_url}`}
                  alt={selectedPet.name}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />

                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Species:</strong> {selectedPet.species}
                  </li>
                  <li className="list-group-item">
                    <strong>Breed:</strong> {selectedPet.breed}
                  </li>
                  <li className="list-group-item">
                    <strong>Age:</strong> {selectedPet.age}
                  </li>
                  <li className="list-group-item">
                    <strong>Gender:</strong> {selectedPet.gender}
                  </li>
                  <li className="list-group-item">
                    <strong>Status:</strong> {selectedPet.petStatus}
                  </li>
                  <li className="list-group-item">
                    <strong>Description:</strong>
                    <p className="mb-0">{selectedPet.description}</p>
                  </li>
                </ul>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>

                <button
                  className="btn btn-primary"
                  disabled={!canAdopt(selectedPet)}
                >
                  {selectedPet.petStatus === "under approval"
                    ? "Pending Approval"
                    : "Want to Adopt"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmPet && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Confirm Adoption</h6>
                <button
                  className="btn-close"
                  onClick={() => setConfirmPet(null)}
                />
              </div>

              <div className="modal-body text-center">
                <p>
                  Are you sure you want to adopt{" "}
                  <strong>{confirmPet.name}</strong>?
                </p>
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setConfirmPet(null)}
                >
                  No
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={async () => {
                    await api.post(
                      `/pets/${confirmPet._id}/adopt`,
                      {},
                      { withCredentials: true }
                    );

                    setConfirmPet(null);
                    fetchPets();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainDashboard;
