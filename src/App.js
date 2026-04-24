import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";
const API = "/api";
console.log(API);
function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const [experience, setExperience] = useState("");


  // =========================
  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async () => {
    try {
      const res = await axios.get(`${API}/masters`);

      setCities(res.data.cities.map(c => ({ label: c, value: c })));
      setRoles(res.data.roles.map(r => ({ label: r, value: r })));

    } catch (err) {
      console.error("Error fetching masters");
    }
  };

  // =========================
  // ✅ ONLY NUMBER + DECIMAL
  // =========================
  const handleExperienceChange = (e) => {
    const value = e.target.value;

    // allow only numbers + one decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setExperience(value);
    }
  };

  // =========================
  const uploadResume = async () => {
    if (!file) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    formData.append(
      "extra_data",
      JSON.stringify({
        city: selectedCity?.value || "",
        job_role: selectedRole?.value || "",
        experience_years: experience
      })
    );

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        `${API}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setResult(res.data);

    } catch (err) {
  console.error(err);
  alert(err.response?.data?.error || "Upload failed");
}
    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">

        {/* ✅ COMPANY LOGO */}
        <div className="text-center mb-3">
          <img
            src="logo-idonneous.png"   // 👉 put your logo file in public folder
            alt="Company Logo"
            style={{ height: "60px" }}
          />
        </div>

        <h2 className="text-center">Candidate Resume Upload</h2>

        {/* Upload */}
        <div className="mb-3">
          <label className="fw-bold">Upload Resume</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* City */}
        <div className="mb-3">
          <label className="fw-bold">City</label>
          <Select
            options={cities}
            value={selectedCity}
            onChange={setSelectedCity}
            isClearable
            placeholder="Search city..."
          />
        </div>

        {/* Job Role */}
        <div className="mb-3">
          <label className="fw-bold">Job Role looking for</label>
          <Select
            options={roles}
            value={selectedRole}
            onChange={setSelectedRole}
            isClearable
            placeholder="Search job role..."
          />
        </div>

        {/* Experience */}
        <div className="mb-3">
          <label className="fw-bold">Experience (Years)</label>
          <input
            type="text"
            className="form-control"
            value={experience}
            onChange={handleExperienceChange}
            placeholder="e.g. 1, 2.5"
          />
        </div>

        {/* Upload Button */}
        <button
          className="btn btn-primary w-100"
          onClick={uploadResume}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {/* =========================
            RESULT MESSAGE
        ========================== */}
        {result && (
          <div
            className={`mt-4 alert ${
              result.success ? "alert-success" : "alert-danger"
            }`}
          >
            {result.success ? (
              <>✅ Resume ID: {result.resume_id}</>
            ) : (
              <>⚠️ {result.message}</>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
