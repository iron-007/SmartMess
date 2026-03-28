import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for proper routing

function Register() {
  const navigate = useNavigate(); // Initialize navigation

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    urn: "",
    crn: "",
    degree: "",
    department: "",
    batch: "",
    year: "",
    hostel: "",
    messAccount: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Removed auto password generator

  const validate = () => {
    let err = {};

    if (!form.firstName) err.firstName = "First name required";
    if (!form.lastName) err.lastName = "Last name required";
    if (!form.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email format";
    if (!form.urn) err.urn = "URN required";
    if (!form.crn) err.crn = "CRN required";
    if (!form.degree) err.degree = "Degree required";
    if (!form.department) err.department = "Department required";
    if (!form.batch) err.batch = "Batch required";
    if (!form.year) err.year = "Year required";
    if (!form.hostel) err.hostel = "Hostel required";
    if (!form.messAccount) err.messAccount = "Mess account required";
    if (!form.password) err.password = "Password required";
    else if (form.password.length < 6) err.password = "Password must be at least 6 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Call backend API
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User registered successfully") {
          navigate("/login"); // Redirect to login page
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Registration failed");
      });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4 fw-bold text-primary">Student Registration</h2>
          <p className="text-center text-muted mb-4">Create your account to get started</p>

          <form onSubmit={handleSubmit}>
            
            {/* FIX: Properly closed the Row and Error blocks here */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label fw-semibold">First Name</label>
                <input
                  name="firstName"
                  id="firstName"
                  className="form-control form-control-lg"
                  placeholder="Enter first name"
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <small className="text-danger mt-1 d-block">{errors.firstName}</small>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label fw-semibold">Last Name</label>
                <input
                  name="lastName"
                  id="lastName"
                  className="form-control form-control-lg"
                  placeholder="Enter last name"
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <small className="text-danger mt-1 d-block">{errors.lastName}</small>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
              <input
                name="email"
                id="email"
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter email address"
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger mt-1 d-block">{errors.email}</small>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="urn" className="form-label fw-semibold">URN</label>
                <input
                  name="urn"
                  id="urn"
                  className="form-control form-control-lg"
                  placeholder="Enter URN"
                  onChange={handleChange}
                />
                {errors.urn && (
                  <small className="text-danger mt-1 d-block">{errors.urn}</small>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="crn" className="form-label fw-semibold">CRN</label>
                <input
                  name="crn"
                  id="crn"
                  className="form-control form-control-lg"
                  placeholder="Enter CRN"
                  onChange={handleChange}
                />
                {errors.crn && (
                  <small className="text-danger mt-1 d-block">{errors.crn}</small>
                )}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="degree" className="form-label fw-semibold">Degree</label>
                <select
                  name="degree"
                  id="degree"
                  className="form-select form-select-lg"
                  value={form.degree}
                  onChange={handleChange}
                >
                  <option value="">Select Degree</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
                {errors.degree && (
                  <small className="text-danger mt-1 d-block">{errors.degree}</small>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="department" className="form-label fw-semibold">Department</label>
                <select
                  name="department"
                  id="department"
                  className="form-select form-select-lg"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="VLSI Design">VLSI Design</option>
                  <option value="Power Systems">Power Systems</option>
                  <option value="Structural Engineering">Structural Engineering</option>
                </select>
                {errors.department && (
                  <small className="text-danger mt-1 d-block">{errors.department}</small>
                )}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="batch" className="form-label fw-semibold">Batch</label>
                <input
                  name="batch"
                  id="batch"
                  className="form-control form-control-lg"
                  placeholder="Enter batch"
                  onChange={handleChange}
                />
                {errors.batch && (
                  <small className="text-danger mt-1 d-block">{errors.batch}</small>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="year" className="form-label fw-semibold">Year</label>
                <select
                  name="year"
                  id="year"
                  className="form-select form-select-lg"
                  value={form.year}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                {errors.year && (
                  <small className="text-danger mt-1 d-block">{errors.year}</small>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="hostel" className="form-label fw-semibold">Hostel</label>
                <select
                  name="hostel"
                  id="hostel"
                  className="form-select form-select-lg"
                  value={form.hostel}
                  onChange={handleChange}
                >
                  <option value="">Select Hostel</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {errors.hostel && (
                  <small className="text-danger mt-1 d-block">{errors.hostel}</small>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="messAccount" className="form-label fw-semibold">Mess Account No.</label>
              <input
                name="messAccount"
                id="messAccount"
                className="form-control form-control-lg"
                placeholder="Enter mess account number"
                onChange={handleChange}
              />
              {errors.messAccount && (
                <small className="text-danger mt-1 d-block">{errors.messAccount}</small>
              )}
            </div>

            {/* FIX: Added proper label and formatting for the Role selector */}
            <div className="mb-3">
               <label htmlFor="role" className="form-label fw-semibold">System Role</label>
               <select
                 name="role"
                 id="role"
                 className="form-select form-select-lg"
                 value={form.role}
                 onChange={handleChange}
               >
                 <option value="student">Student</option>
                 <option value="admin">Admin</option>
               </select>
               {errors.role && (
                 <small className="text-danger mt-1 d-block">{errors.role}</small>
               )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control form-control-lg"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <small className="text-danger mt-1 d-block">{errors.password}</small>
            )}
          </div>

            <button type="submit" className="btn btn-success btn-lg w-100 mb-3 fw-semibold">Register</button>
          </form>

          <div className="text-center">
            <small className="text-muted">Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-semibold">Sign in here</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;