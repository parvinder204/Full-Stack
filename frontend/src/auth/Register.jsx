import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name:"", last_name:"", email:"", password:"", confirmPassword:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("auth/register/", form);
      navigate("/login");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ width: "450px", backgroundColor: "#1f1f1f" }}>
        <h3 className="text-center mb-3 text-white">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col mb-3">
              <label className="form-label text-white">First Name</label>
              <input name="first_name" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col mb-3">
              <label className="form-label text-white">Last Name</label>
              <input name="last_name" className="form-control" onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input name="email" type="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Password</label>
            <input name="password" type="password" className="form-control" onChange={handleChange} required minLength={6}/>
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Confirm Password</label>
            <input name="confirmPassword" type="password" className="form-control" onChange={handleChange} required minLength={6}/>
          </div>
          <button className="btn btn-success w-100" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <div className="text-center mt-3 text-white">
          <small>Already have an account? <Link to="/login" className="text-info">Login</Link></small>
        </div>
      </div>
    </div>
  );
};

export default Register;
