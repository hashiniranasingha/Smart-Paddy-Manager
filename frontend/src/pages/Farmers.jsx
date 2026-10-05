import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/farmers";

function Farmers() {
  const [farmers, setFarmers] = useState([]);

  const [farmer, setFarmer] = useState({
    farmer_name: "",
    email: "",
    phone: "",
    village: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVillage, setFilterVillage] = useState("All");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD FARMERS
  // =====================================================

  const fetchFarmers = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load farmers");
      }

      const data = await response.json();

      setFarmers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading farmers:", error);
      alert(
        "Unable to load farmers. Please check the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFarmer({
      ...farmer,
      [name]: value,
    });
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const name = farmer.farmer_name.trim();
    const email = farmer.email.trim();
    const phone = farmer.phone.trim();
    const village = farmer.village.trim();

    if (!name) {
      alert("Please enter farmer name.");
      return false;
    }

    if (name.length < 2) {
      alert("Farmer name must contain at least 2 characters.");
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!phone) {
      alert("Please enter phone number.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 digits.");
      return false;
    }

    if (!village) {
      alert("Please enter village.");
      return false;
    }

    return true;
  };

  // =====================================================
  // ADD / UPDATE FARMER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const cleanFarmer = {
        farmer_name: farmer.farmer_name.trim(),
        email: farmer.email.trim(),
        phone: farmer.phone.trim(),
        village: farmer.village.trim(),
      };

      let response;

      if (editingId) {
        // UPDATE
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanFarmer),
        });
      } else {
        // ADD
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanFarmer),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      if (editingId) {
        alert("Farmer updated successfully!");
      } else {
        alert("Farmer added successfully!");
      }

      setFarmer({
        farmer_name: "",
        email: "",
        phone: "",
        village: "",
      });

      setEditingId(null);

      fetchFarmers();
    } catch (error) {
      console.error("Save farmer error:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  // =====================================================
  // EDIT FARMER
  // =====================================================

  const handleEdit = (selectedFarmer) => {
    setEditingId(selectedFarmer.id);

    setFarmer({
      farmer_name: selectedFarmer.farmer_name || "",
      email: selectedFarmer.email || "",
      phone: selectedFarmer.phone || "",
      village: selectedFarmer.village || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFarmer({
      farmer_name: "",
      email: "",
      phone: "",
      village: "",
    });
  };

  // =====================================================
  // DELETE FARMER
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this farmer?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete farmer");
      }

      alert("Farmer deleted successfully!");

      fetchFarmers();
    } catch (error) {
      console.error("Delete farmer error:", error);
      alert(error.message || "Unable to delete farmer.");
    }
  };

  // =====================================================
  // RESET SEARCH / FILTER
  // =====================================================

  const resetSearchAndFilter = () => {
    setSearchTerm("");
    setFilterVillage("All");
  };

  // =====================================================
  // GET UNIQUE VILLAGES
  // =====================================================

  const villages = [
    "All",
    ...new Set(
      farmers
        .map((item) => item.village)
        .filter(
          (village) => village && village.trim() !== ""
        )
    ),
  ];

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredFarmers = farmers.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      String(item.farmer_name || "")
        .toLowerCase()
        .includes(search) ||
      String(item.email || "")
        .toLowerCase()
        .includes(search) ||
      String(item.phone || "")
        .toLowerCase()
        .includes(search) ||
      String(item.village || "")
        .toLowerCase()
        .includes(search);

    const matchesVillage =
      filterVillage === "All" ||
      String(item.village || "").toLowerCase() ===
        filterVillage.toLowerCase();

    return matchesSearch && matchesVillage;
  });

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalFarmers = farmers.length;

  const totalVillages = new Set(
    farmers
      .map((item) => item.village)
      .filter(
        (village) => village && village.trim() !== ""
      )
  ).size;

  const filteredCount = filteredFarmers.length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="farmers-page">

      {/* =================================================
          PAGE HERO
      ================================================= */}

      <div className="farmers-hero">

        <div className="hero-content">

          <div className="hero-icon">
            👨‍🌾
          </div>

          <div>
            <div className="hero-label">
              FARM MANAGEMENT
            </div>

            <h1>
              Farmers Management
            </h1>

            <p>
              Manage farmer profiles, contact details,
              villages and agricultural records.
            </p>
          </div>

        </div>

        <div className="hero-status">
          <span className="status-dot"></span>
          System Active
        </div>

      </div>


      {/* =================================================
          STATISTICS CARDS
      ================================================= */}

      <div className="farmer-stat-grid">

        <div className="farmer-stat-card">

          <div className="stat-icon green">
            👨‍🌾
          </div>

          <div className="stat-content">
            <span>Total Farmers</span>
            <strong>{totalFarmers}</strong>
            <small>Registered farmers</small>
          </div>

        </div>


        <div className="farmer-stat-card">

          <div className="stat-icon blue">
            📍
          </div>

          <div className="stat-content">
            <span>Villages</span>
            <strong>{totalVillages}</strong>
            <small>Active locations</small>
          </div>

        </div>


        <div className="farmer-stat-card">

          <div className="stat-icon orange">
            🔎
          </div>

          <div className="stat-content">
            <span>Current Results</span>
            <strong>{filteredCount}</strong>
            <small>Matching records</small>
          </div>

        </div>

      </div>


      {/* =================================================
          ADD / EDIT FARMER
      ================================================= */}

      <div className="farmer-form-card">

        <div className="section-heading">

          <div className="section-heading-left">

            <div className="section-icon">
              {editingId ? "✏️" : "➕"}
            </div>

            <div>
              <h2>
                {editingId
                  ? "Edit Farmer"
                  : "Add New Farmer"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected farmer's information."
                  : "Enter farmer information to create a new record."}
              </p>
            </div>

          </div>

          {editingId && (
            <div className="editing-badge">
              Editing Record #{editingId}
            </div>
          )}

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* FARMER NAME */}

            <div className="form-group">

              <label>
                Farmer Name
                <span className="required">*</span>
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  name="farmer_name"
                  value={farmer.farmer_name}
                  onChange={handleChange}
                  placeholder="Enter farmer name"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  value={farmer.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone Number
                <span className="required">*</span>
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  📱
                </span>

                <input
                  type="text"
                  name="phone"
                  value={farmer.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit phone number"
                  maxLength="10"
                />

              </div>

            </div>


            {/* VILLAGE */}

            <div className="form-group">

              <label>
                Village
                <span className="required">*</span>
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  📍
                </span>

                <input
                  type="text"
                  name="village"
                  value={farmer.village}
                  onChange={handleChange}
                  placeholder="Enter village"
                />

              </div>

            </div>

          </div>


          {/* FORM BUTTONS */}

          <div className="form-buttons">

            <button
              type="submit"
              className="btn-primary"
            >
              {editingId
                ? "💾 Update Farmer"
                : "➕ Add Farmer"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelEdit}
              >
                ✕ Cancel Edit
              </button>
            )}

          </div>

        </form>

      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="search-filter-card">

        <div className="search-filter-header">

          <div>
            <h2>
              🔎 Find Farmers
            </h2>

            <p>
              Search and filter your farmer records.
            </p>
          </div>

          <button
            type="button"
            className="btn-reset"
            onClick={resetSearchAndFilter}
          >
            ↻ Reset Filters
          </button>

        </div>


        <div className="search-filter-grid">

          <div className="form-group">

            <label>
              Search Farmers
            </label>

            <div className="input-wrapper search-input">

              <span className="input-icon">
                🔍
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search by name, email, phone or village..."
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Filter by Village
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                📍
              </span>

              <select
                value={filterVillage}
                onChange={(e) =>
                  setFilterVillage(e.target.value)
                }
              >
                {villages.map((village, index) => (
                  <option
                    key={index}
                    value={village}
                  >
                    {village}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          RESULT INFORMATION
      ================================================= */}

      <div className="result-bar">

        <div className="result-left">

          <span className="result-icon">
            📊
          </span>

          <span>
            Showing
            <strong> {filteredFarmers.length} </strong>
            of
            <strong> {farmers.length} </strong>
            farmer records
          </span>

        </div>

        {(searchTerm || filterVillage !== "All") && (
          <span className="filter-active">
            Filters Active
          </span>
        )}

      </div>


      {/* =================================================
          FARMERS TABLE
      ================================================= */}

      <div className="table-card">

        <div className="table-header">

          <div className="table-title">

            <div className="table-title-icon">
              👥
            </div>

            <div>
              <h2>
                Farmers Directory
              </h2>

              <p>
                Registered farmer information
              </p>
            </div>

          </div>

          <div className="total-badge">
            {farmers.length} Records
          </div>

        </div>


        {loading ? (

          <div className="empty-message loading-state">

            <div className="loading-spinner"></div>

            <strong>
              Loading farmers...
            </strong>

            <span>
              Please wait while records are retrieved.
            </span>

          </div>

        ) : filteredFarmers.length === 0 ? (

          <div className="empty-message">

            <div className="empty-icon">
              {farmers.length === 0
                ? "👨‍🌾"
                : "🔍"}
            </div>

            <strong>
              {farmers.length === 0
                ? "No farmers found"
                : "No matching farmers"}
            </strong>

            <span>
              {farmers.length === 0
                ? "Add your first farmer using the form above."
                : "Try changing your search or village filter."}
            </span>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>ID</th>

                  <th>FARMER</th>

                  <th>EMAIL</th>

                  <th>PHONE</th>

                  <th>VILLAGE</th>

                  <th>ACTIONS</th>

                </tr>

              </thead>

              <tbody>

                {filteredFarmers.map((item) => (

                  <tr key={item.id}>

                    <td>

                      <span className="id-badge">
                        #{item.id}
                      </span>

                    </td>


                    <td>

                      <div className="farmer-name-cell">

                        <div className="farmer-avatar">
                          {String(
                            item.farmer_name || "F"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {item.farmer_name}
                          </strong>

                          <small>
                            Farmer
                          </small>
                        </div>

                      </div>

                    </td>


                    <td>

                      <span className="email-cell">
                        {item.email || "-"}
                      </span>

                    </td>


                    <td>

                      <span className="phone-cell">
                        📱 {item.phone || "-"}
                      </span>

                    </td>


                    <td>

                      <span className="village-badge">
                        📍 {item.village || "-"}
                      </span>

                    </td>


                    <td>

                      <div className="action-buttons">

                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleEdit(item)
                          }
                          title="Edit farmer"
                        >
                          ✏️
                          <span>Edit</span>
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          title="Delete farmer"
                        >
                          🗑️
                          <span>Delete</span>
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =================================================
          PAGE STYLES
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .farmers-page {
          min-height: 100vh;
          padding: 30px;
          max-width: 1500px;
          margin: 0 auto;
          background: #f6f8f7;
        }

        /* ================= HERO ================= */

        .farmers-hero {
          background:
            linear-gradient(
              135deg,
              #173f2a 0%,
              #21643d 55%,
              #2f8050 100%
            );

          border-radius: 20px;
          padding: 28px 32px;
          color: white;

          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 22px;

          box-shadow:
            0 12px 30px rgba(23, 63, 42, 0.16);

          position: relative;
          overflow: hidden;
        }

        .farmers-hero::after {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          right: -70px;
          top: -100px;
          background: rgba(255,255,255,0.07);
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .hero-icon {
          width: 62px;
          height: 62px;
          border-radius: 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 31px;

          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
        }

        .hero-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          opacity: 0.72;
          margin-bottom: 4px;
        }

        .farmers-hero h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .farmers-hero p {
          margin: 7px 0 0;
          font-size: 14px;
          opacity: 0.82;
        }

        .hero-status {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 9px 14px;
          border-radius: 30px;

          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.15);

          font-size: 13px;
          font-weight: 700;

          position: relative;
          z-index: 2;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #7ee2a4;
          box-shadow: 0 0 0 4px rgba(126,226,164,0.15);
        }

        /* ================= STAT CARDS ================= */

        .farmer-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .farmer-stat-card {
          background: white;
          border: 1px solid #e7ece9;
          border-radius: 16px;

          min-height: 115px;
          padding: 20px;

          display: flex;
          align-items: center;
          gap: 16px;

          box-shadow:
            0 5px 18px rgba(22, 45, 32, 0.06);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .farmer-stat-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 24px rgba(22, 45, 32, 0.10);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;

          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 23px;
        }

        .stat-icon.green {
          background: #e8f6ec;
        }

        .stat-icon.blue {
          background: #eaf3fb;
        }

        .stat-icon.orange {
          background: #fff3df;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-content span {
          font-size: 12px;
          color: #758078;
          font-weight: 600;
        }

        .stat-content strong {
          font-size: 27px;
          color: #1c2921;
          line-height: 1.2;
          margin: 2px 0;
        }

        .stat-content small {
          color: #929a95;
          font-size: 11px;
        }

        /* ================= COMMON CARDS ================= */

        .farmer-form-card,
        .search-filter-card,
        .table-card {
          background: white;
          border: 1px solid #e7ece9;
          border-radius: 18px;
          margin-bottom: 22px;

          box-shadow:
            0 5px 18px rgba(22, 45, 32, 0.055);
        }

        .farmer-form-card {
          padding: 26px;
        }

        /* ================= SECTION HEADER ================= */

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #edf0ee;
        }

        .section-heading-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .section-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;

          background: #eaf6ed;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 20px;
        }

        .section-heading h2 {
          margin: 0;
          color: #1d2922;
          font-size: 19px;
        }

        .section-heading p {
          margin: 4px 0 0;
          color: #7b857f;
          font-size: 12px;
        }

        .editing-badge {
          padding: 8px 12px;
          background: #fff5df;
          color: #9a6500;
          border: 1px solid #f1dfb5;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        /* ================= FORM ================= */

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #36423a;
          font-size: 13px;
          font-weight: 700;
        }

        .required {
          color: #d32f2f;
          margin-left: 3px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          z-index: 1;
        }

        input,
        select {
          width: 100%;
          height: 45px;

          padding: 0 13px 0 40px;

          border: 1px solid #dce3df;
          border-radius: 10px;

          background: #fbfcfb;

          color: #253029;
          font-size: 13px;

          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        input::placeholder {
          color: #a1aaa5;
        }

        input:focus,
        select:focus {
          background: white;
          border-color: #2e7d4b;
          box-shadow:
            0 0 0 3px rgba(46,125,75,0.10);
        }

        select {
          appearance: auto;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
          margin-top: 23px;
        }

        button {
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-weight: 700;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            opacity 0.15s ease;
        }

        button:hover {
          transform: translateY(-1px);
        }

        .btn-primary {
          min-height: 43px;
          padding: 0 19px;

          background: #267344;
          color: white;

          border-radius: 9px;

          box-shadow:
            0 5px 12px rgba(38,115,68,0.18);
        }

        .btn-primary:hover {
          background: #1e6038;
        }

        .btn-secondary {
          min-height: 43px;
          padding: 0 17px;

          background: #eef1ef;
          color: #56625a;

          border-radius: 9px;
        }

        /* ================= SEARCH FILTER ================= */

        .search-filter-card {
          padding: 23px 26px;
        }

        .search-filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .search-filter-header h2 {
          margin: 0;
          color: #1e2a23;
          font-size: 18px;
        }

        .search-filter-header p {
          margin: 4px 0 0;
          color: #818a84;
          font-size: 12px;
        }

        .search-filter-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 18px;
        }

        .btn-reset {
          min-height: 40px;
          padding: 0 15px;

          background: #f1f4f2;
          color: #526057;

          border: 1px solid #dfe6e1;
          border-radius: 9px;

          font-size: 12px;
        }

        .btn-reset:hover {
          background: #e7ece9;
        }

        /* ================= RESULT BAR ================= */

        .result-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;

          min-height: 42px;
          margin-bottom: 12px;
          padding: 0 5px;
        }

        .result-left {
          display: flex;
          align-items: center;
          gap: 8px;

          color: #707a73;
          font-size: 13px;
        }

        .result-icon {
          font-size: 16px;
        }

        .result-left strong {
          color: #29362e;
        }

        .filter-active {
          padding: 6px 10px;
          border-radius: 20px;

          background: #eaf6ed;
          color: #287142;

          font-size: 11px;
          font-weight: 800;
        }

        /* ================= TABLE ================= */

        .table-card {
          overflow: hidden;
        }

        .table-header {
          padding: 21px 25px;

          display: flex;
          justify-content: space-between;
          align-items: center;

          border-bottom: 1px solid #edf0ee;
        }

        .table-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .table-title-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #eef6f0;
          border-radius: 11px;

          font-size: 19px;
        }

        .table-header h2 {
          margin: 0;
          font-size: 18px;
          color: #1d2922;
        }

        .table-header p {
          margin: 3px 0 0;
          color: #8a928c;
          font-size: 11px;
        }

        .total-badge {
          background: #f3f6f4;
          color: #5d6861;

          padding: 7px 12px;
          border-radius: 20px;

          font-size: 11px;
          font-weight: 800;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        th {
          padding: 13px 18px;

          background: #f8faf9;
          color: #7a847d;

          font-size: 10px;
          letter-spacing: 0.7px;
          font-weight: 800;

          text-align: left;
          border-bottom: 1px solid #e8ece9;
        }

        td {
          padding: 15px 18px;

          color: #47534b;
          font-size: 13px;

          border-bottom: 1px solid #edf0ee;
          vertical-align: middle;
        }

        tbody tr {
          transition: background 0.15s ease;
        }

        tbody tr:hover {
          background: #fbfdfb;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        /* ================= TABLE CELLS ================= */

        .id-badge {
          display: inline-flex;
          align-items: center;

          padding: 5px 8px;
          border-radius: 7px;

          background: #f0f3f1;
          color: #68736c;

          font-size: 11px;
          font-weight: 800;
        }

        .farmer-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .farmer-avatar {
          width: 37px;
          height: 37px;
          flex-shrink: 0;

          border-radius: 11px;

          background: #e5f3e9;
          color: #287243;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;
          font-weight: 800;
        }

        .farmer-name-cell div:last-child {
          display: flex;
          flex-direction: column;
        }

        .farmer-name-cell strong {
          color: #27342c;
          font-size: 13px;
        }

        .farmer-name-cell small {
          margin-top: 2px;
          color: #929a95;
          font-size: 10px;
        }

        .email-cell {
          color: #58635c;
        }

        .phone-cell {
          color: #58635c;
          white-space: nowrap;
        }

        .village-badge {
          display: inline-flex;
          align-items: center;

          padding: 6px 10px;

          background: #f0f7f2;
          color: #35734b;

          border-radius: 20px;

          font-size: 11px;
          font-weight: 700;
        }

        /* ================= ACTIONS ================= */

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .btn-edit,
        .btn-delete {
          min-height: 34px;
          padding: 0 10px;

          border-radius: 7px;

          color: white;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;

          font-size: 11px;
        }

        .btn-edit {
          background: #2878c7;
        }

        .btn-edit:hover {
          background: #2168ad;
        }

        .btn-delete {
          background: #d64b4b;
        }

        .btn-delete:hover {
          background: #bd3838;
        }

        /* ================= EMPTY STATE ================= */

        .empty-message {
          min-height: 260px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 6px;

          color: #858e88;
        }

        .empty-message strong {
          color: #47534b;
          font-size: 14px;
        }

        .empty-message span {
          font-size: 12px;
          color: #969e99;
        }

        .empty-icon {
          width: 58px;
          height: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #f0f5f1;
          border-radius: 50%;

          font-size: 25px;
          margin-bottom: 7px;
        }

        /* ================= LOADING ================= */

        .loading-spinner {
          width: 30px;
          height: 30px;

          border: 3px solid #e1e9e3;
          border-top-color: #2e7d4b;

          border-radius: 50%;

          animation: spin 0.8s linear infinite;

          margin-bottom: 7px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1000px) {

          .farmer-stat-grid {
            grid-template-columns: 1fr;
          }

          .search-filter-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 800px) {

          .farmers-page {
            padding: 18px;
          }

          .farmers-hero {
            padding: 22px;
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }

          .farmers-hero h1 {
            font-size: 25px;
          }

          .hero-status {
            align-self: flex-start;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .search-filter-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .result-bar {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

        }

        @media (max-width: 500px) {

          .farmers-page {
            padding: 12px;
          }

          .farmer-form-card,
          .search-filter-card {
            padding: 18px;
          }

          .hero-content {
            align-items: flex-start;
          }

          .hero-icon {
            width: 50px;
            height: 50px;
            font-size: 24px;
          }

          .farmers-hero h1 {
            font-size: 22px;
          }

          .farmers-hero p {
            line-height: 1.5;
          }

          .form-buttons {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
}

export default Farmers;