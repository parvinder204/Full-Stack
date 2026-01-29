import { useNavigate } from "react-router-dom";
import { clearTokens } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Task Manager</span>
      <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
