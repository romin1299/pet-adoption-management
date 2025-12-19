import "./Navbar.scss";
import { useAuth } from "../../ContextAPI/useAuth.js";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const isVisitor = !user;
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar app-navbar">
      <div className="nav-left p-2" onClick={() => navigate("/")}>
        <span className="brand-name">Pet Adoption</span>
      </div>

      <div className="nav-center">
        {!isVisitor && !isAdmin && (
          <>
            <NavLink to="/" className="nav-link-item">
              Dashboard
            </NavLink>
            <NavLink to="/adoptions" className="nav-link-item">
              My Adoptions
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink to="/admin/pet-registration" className="nav-link-item">
              Pet Management
            </NavLink>
            <NavLink to="/adoptions" className="nav-link-item">
              Adoption Requests
            </NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        {isVisitor ? (
          <>
            <NavLink to="/login" className="nav-link-item p-2">
              Login/SignUp
            </NavLink>
          </>
        ) : (
          <span className="nav-link-item nav-logout p-2" onClick={handleLogout}>
            Logout
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
