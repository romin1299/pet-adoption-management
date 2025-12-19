import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../ContextAPI/useAuth.js";
import api from "../../API/axios.js";
import "./Login.scss";

const LoginPage = () => {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === "admin" ? "/admin/pet-registration" : "/", {
        replace: true,
      });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
      } else {
        await api.post("/auth/register", form);
        setMode("login");
      }
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div
        className="card shadow-sm"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="card-body">
          {/* Tabs */}
          <div className="d-flex mb-3">
            <button
              className={`btn btn-sm flex-fill ${
                mode === "login" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`btn btn-sm flex-fill ms-2 ${
                mode === "signup" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="alert alert-danger py-1">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="mb-3">
                <input
                  className="form-control"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <input
                className="form-control"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
