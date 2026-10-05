import { useEffect, useState } from "react";

function Fields() {
  const [farmers, setFarmers] = useState([]);
  const [fields, setFields] = useState([]);

  const [editingFieldId, setEditingFieldId] = useState(null);

  const [field, setField] = useState({
    farmer_id: "",
    field_name: "",
    area: "",
    location: "",
    soil_type: "",
    irrigation_type: "",
    current_crop: "",
    planting_date: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterFarmer, setFilterFarmer] = useState("All");
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchFarmers();
    fetchFields();
  }, []);

  // =========================
  // GET FARMERS
  // =========================

  const fetchFarmers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/farmers"
      );

      const data = await response.json();

      setFarmers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching farmers:", error);
    }
  };

  // =========================
  // GET FIELDS
  // =========================

  const fetchFields = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/fields"
      );

      const data = await response.json();

      setFields(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    const fieldName = field.field_name.trim();
    const area = Number(field.area);
    const location = field.location.trim();

    if (!field.farmer_id) {
      alert("Please select a farmer.");
      return false;
    }

    if (!fieldName) {
      alert("Please enter field name.");
      return false;
    }

    if (fieldName.length < 2) {
      alert("Field name must contain at least 2 characters.");
      return false;
    }

    if (!field.area) {
      alert("Please enter field area.");
      return false;
    }

    if (isNaN(area) || area <= 0) {
      alert("Field area must be greater than 0.");
      return false;
    }

    if (location && location.length < 2) {
      alert("Location must contain at least 2 characters.");
      return false;
    }

    return true;
  };

  // =========================
  // EDIT FIELD
  // =========================

  const handleEdit = (fieldItem) => {
    setEditingFieldId(fieldItem.id);

    setField({
      farmer_id: fieldItem.farmer_id || "",
      field_name: fieldItem.field_name || "",
      area: fieldItem.area || "",
      location: fieldItem.location || "",
      soil_type: fieldItem.soil_type || "",
      irrigation_type: fieldItem.irrigation_type || "",
      current_crop: fieldItem.current_crop || "",
      planting_date: fieldItem.planting_date
        ? String(fieldItem.planting_date).substring(0, 10)
        : ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingFieldId(null);

    setField({
      farmer_id: "",
      field_name: "",
      area: "",
      location: "",
      soil_type: "",
      irrigation_type: "",
      current_crop: "",
      planting_date: ""
    });
  };

  // =========================
  // ADD / UPDATE FIELD
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let response;

      const cleanField = {
        farmer_id: field.farmer_id,
        field_name: field.field_name.trim(),
        area: Number(field.area),
        location: field.location.trim(),
        soil_type: field.soil_type.trim(),
        irrigation_type: field.irrigation_type.trim(),
        current_crop: field.current_crop.trim(),
        planting_date: field.planting_date
      };

      // UPDATE
      if (editingFieldId) {
        response = await fetch(
          `http://localhost:5000/fields/${editingFieldId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(cleanField)
          }
        );
      }

      // ADD
      else {
        response = await fetch(
          "http://localhost:5000/fields",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(cleanField)
          }
        );
      }

      const data = await response.json();

      if (response.ok) {
        if (editingFieldId) {
          alert("Field updated successfully! 🌱");
        } else {
          alert("Field added successfully! 🌱");
        }

        setField({
          farmer_id: "",
          field_name: "",
          area: "",
          location: "",
          soil_type: "",
          irrigation_type: "",
          current_crop: "",
          planting_date: ""
        });

        setEditingFieldId(null);

        fetchFields();
      } else {
        alert(data.message || "Operation failed!");
      }
    } catch (error) {
      console.log("Field save/update error:", error);

      alert("Backend connection failed!");
    }
  };

  // =========================
  // DELETE FIELD
  // =========================

  const deleteField = async (id) => {
    console.log("Delete Field Clicked:", id);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this field?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/fields/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Field deleted successfully! 🌱");

        fetchFields();
      } else {
        alert(
          data.message || "Field delete failed!"
        );
      }
    } catch (error) {
      console.log("Delete field error:", error);

      alert("Backend connection failed!");
    }
  };

  // =========================
  // RESET SEARCH + FILTER
  // =========================

  const resetSearchAndFilter = () => {
    setSearchTerm("");
    setFilterFarmer("All");
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredFields = fields.filter((fieldItem) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      String(fieldItem.field_name || "")
        .toLowerCase()
        .includes(search) ||
      String(fieldItem.farmer_name || "")
        .toLowerCase()
        .includes(search) ||
      String(fieldItem.location || "")
        .toLowerCase()
        .includes(search) ||
      String(fieldItem.soil_type || "")
        .toLowerCase()
        .includes(search) ||
      String(fieldItem.irrigation_type || "")
        .toLowerCase()
        .includes(search) ||
      String(fieldItem.current_crop || "")
        .toLowerCase()
        .includes(search);

    const matchesFarmer =
      filterFarmer === "All" ||
      String(fieldItem.farmer_id) === String(filterFarmer);

    return matchesSearch && matchesFarmer;
  });

  // =========================
  // STATISTICS
  // =========================

  const totalArea = fields.reduce(
    (total, item) => total + Number(item.area || 0),
    0
  );

  const uniqueLocations = new Set(
    fields
      .map((item) => item.location)
      .filter(Boolean)
  ).size;

  // =========================
  // RENDER
  // =========================

  return (
    <div className="fields-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="fields-hero">

        <div className="hero-content">

          <div className="hero-icon">
            🌾
          </div>

          <div>
            <div className="hero-title-row">
              <h1>Paddy Fields Management</h1>

              <span className="system-badge">
                ● System Active
              </span>
            </div>

            <p>
              Manage farmer fields, land information,
              irrigation and cultivation details.
            </p>
          </div>

        </div>

        <div className="hero-right">
          <span>🌱</span>
          <small>Smart Agriculture</small>
        </div>

      </section>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="field-stats">

        <div className="stat-card">

          <div className="stat-icon">
            🌾
          </div>

          <div>
            <span>Total Fields</span>
            <strong>{fields.length}</strong>
            <small>Registered fields</small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            📐
          </div>

          <div>
            <span>Total Area</span>
            <strong>{totalArea.toFixed(2)}</strong>
            <small>Acres under management</small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            📍
          </div>

          <div>
            <span>Locations</span>
            <strong>{uniqueLocations}</strong>
            <small>Active field locations</small>
          </div>

        </div>

      </section>

      {/* =========================
          FORM CARD
      ========================= */}

      <section className="content-card form-card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              FIELD REGISTRATION
            </span>

            <h2>
              {editingFieldId
                ? "✏️ Edit Field Information"
                : "➕ Add New Field"}
            </h2>

            <p>
              {editingFieldId
                ? "Update the selected field information below."
                : "Register a new farmer field in the system."}
            </p>
          </div>

          <div className="section-icon">
            {editingFieldId ? "✏️" : "🌱"}
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* FARMER */}

            <div className="form-group">

              <label>
                Farmer <span>*</span>
              </label>

              <select
                name="farmer_id"
                value={field.farmer_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Farmer
                </option>

                {farmers.map((farmer) => (
                  <option
                    key={farmer.id}
                    value={farmer.id}
                  >
                    {farmer.farmer_name}
                  </option>
                ))}
              </select>

            </div>

            {/* FIELD NAME */}

            <div className="form-group">

              <label>
                Field Name <span>*</span>
              </label>

              <input
                type="text"
                name="field_name"
                placeholder="e.g. North Paddy Field"
                value={field.field_name}
                onChange={handleChange}
              />

            </div>

            {/* AREA */}

            <div className="form-group">

              <label>
                Area (Acres) <span>*</span>
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="area"
                placeholder="e.g. 2.50"
                value={field.area}
                onChange={handleChange}
              />

            </div>

            {/* LOCATION */}

            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Badulla"
                value={field.location}
                onChange={handleChange}
              />

            </div>

            {/* SOIL TYPE */}

            <div className="form-group">

              <label>
                Soil Type
              </label>

              <input
                type="text"
                name="soil_type"
                placeholder="e.g. Clay Soil"
                value={field.soil_type}
                onChange={handleChange}
              />

            </div>

            {/* IRRIGATION */}

            <div className="form-group">

              <label>
                Irrigation Type
              </label>

              <input
                type="text"
                name="irrigation_type"
                placeholder="e.g. Canal Irrigation"
                value={field.irrigation_type}
                onChange={handleChange}
              />

            </div>

            {/* CURRENT CROP */}

            <div className="form-group">

              <label>
                Current Crop
              </label>

              <input
                type="text"
                name="current_crop"
                placeholder="e.g. Paddy"
                value={field.current_crop}
                onChange={handleChange}
              />

            </div>

            {/* PLANTING DATE */}

            <div className="form-group">

              <label>
                Planting Date
              </label>

              <input
                type="date"
                name="planting_date"
                value={field.planting_date}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* FORM ACTIONS */}

          <div className="form-actions">

            <button
              type="submit"
              className="primary-btn"
            >
              {editingFieldId
                ? "💾 Update Field"
                : "💾 Save Field"}
            </button>

            {editingFieldId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="secondary-btn"
              >
                ✕ Cancel Edit
              </button>
            )}

          </div>

        </form>

      </section>

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <section className="content-card search-card">

        <div className="search-heading">

          <div>
            <span className="section-label">
              FIELD DIRECTORY
            </span>

            <h2>🔎 Search & Filter Fields</h2>

            <p>
              Quickly find fields using farmer, location,
              crop or soil information.
            </p>
          </div>

          <div className="result-counter">
            <strong>{filteredFields.length}</strong>
            <span>Results</span>
          </div>

        </div>

        <div className="search-grid">

          <div className="form-group search-input">

            <label>
              Search Fields
            </label>

            <div className="input-with-icon">

              <span>🔎</span>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search field, farmer, location, soil, irrigation or crop..."
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Filter by Farmer
            </label>

            <select
              value={filterFarmer}
              onChange={(e) =>
                setFilterFarmer(e.target.value)
              }
            >
              <option value="All">
                All Farmers
              </option>

              {farmers.map((farmer) => (
                <option
                  key={farmer.id}
                  value={farmer.id}
                >
                  {farmer.farmer_name}
                </option>
              ))}
            </select>

          </div>

          <button
            type="button"
            onClick={resetSearchAndFilter}
            className="reset-btn"
          >
            🔄 Reset
          </button>

        </div>

        <div className="result-bar">

          <span>
            Showing{" "}
            <strong>{filteredFields.length}</strong>{" "}
            of{" "}
            <strong>{fields.length}</strong>{" "}
            fields
          </span>

          {(searchTerm || filterFarmer !== "All") && (
            <span className="filter-active">
              Active filter
            </span>
          )}

        </div>

      </section>

      {/* =========================
          TABLE
      ========================= */}

      <section className="content-card table-card">

        <div className="table-heading">

          <div>
            <span className="section-label">
              FIELD RECORDS
            </span>

            <h2>🌾 Fields List</h2>

            <p>
              Complete list of registered paddy fields.
            </p>
          </div>

          <div className="table-count">
            {filteredFields.length} Fields
          </div>

        </div>

        {loading ? (

          <div className="loading-state">

            <div className="spinner"></div>

            <h3>Loading fields...</h3>

            <p>
              Please wait while field records are loaded.
            </p>

          </div>

        ) : filteredFields.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🌱
            </div>

            <h3>
              {fields.length === 0
                ? "No Fields Found"
                : "No Matching Fields"}
            </h3>

            <p>
              {fields.length === 0
                ? "Start by adding your first paddy field."
                : "Try changing your search or filter criteria."}
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Farmer</th>
                  <th>Field</th>
                  <th>Area</th>
                  <th>Location</th>
                  <th>Soil</th>
                  <th>Irrigation</th>
                  <th>Crop</th>
                  <th>Planting Date</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredFields.map((fieldItem) => (

                  <tr key={fieldItem.id}>

                    <td>
                      <span className="id-badge">
                        #{fieldItem.id}
                      </span>
                    </td>

                    <td>

                      <div className="farmer-cell">

                        <div className="farmer-avatar">
                          {String(
                            fieldItem.farmer_name || "F"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {fieldItem.farmer_name || "-"}
                        </strong>

                      </div>

                    </td>

                    <td>

                      <div className="field-name-cell">

                        <span className="field-icon">
                          🌾
                        </span>

                        <strong>
                          {fieldItem.field_name || "-"}
                        </strong>

                      </div>

                    </td>

                    <td>

                      <span className="area-badge">
                        {fieldItem.area
                          ? `${fieldItem.area} acres`
                          : "-"}
                      </span>

                    </td>

                    <td>
                      {fieldItem.location ? (
                        <span className="location-text">
                          📍 {fieldItem.location}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {fieldItem.soil_type ? (
                        <span className="info-badge">
                          {fieldItem.soil_type}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {fieldItem.irrigation_type ? (
                        <span className="irrigation-badge">
                          💧 {fieldItem.irrigation_type}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {fieldItem.current_crop ? (
                        <span className="crop-badge">
                          🌱 {fieldItem.current_crop}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {fieldItem.planting_date
                        ? String(
                            fieldItem.planting_date
                          ).substring(0, 10)
                        : "-"}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          onClick={() =>
                            handleEdit(fieldItem)
                          }
                          className="edit-btn"
                          title="Edit field"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            deleteField(fieldItem.id)
                          }
                          className="delete-btn"
                          title="Delete field"
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* =========================
          PAGE STYLES
      ========================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .fields-page {
          min-height: 100vh;
          padding: 28px;
          background: #f4f7f4;
          color: #1f2937;
        }

        /* HERO */

        .fields-hero {
          max-width: 1400px;
          margin: 0 auto 20px;
          min-height: 125px;
          padding: 25px 30px;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            #1b5e20,
            #2e7d32,
            #43a047
          );
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 10px 25px rgba(46, 125, 50, 0.18);
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .hero-icon {
          width: 58px;
          height: 58px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .hero-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hero-title-row h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }

        .fields-hero p {
          margin: 7px 0 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .system-badge {
          padding: 5px 10px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-size: 11px;
          font-weight: 600;
        }

        .hero-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          opacity: 0.9;
        }

        .hero-right span {
          font-size: 30px;
        }

        .hero-right small {
          font-size: 11px;
        }

        /* STATISTICS */

        .field-stats {
          max-width: 1400px;
          margin: 0 auto 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-card {
          min-height: 108px;
          padding: 18px 20px;
          border-radius: 15px;
          background: white;
          border: 1px solid #e7ece7;
          box-shadow: 0 5px 16px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          background: #e8f5e9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          flex-shrink: 0;
        }

        .stat-card span {
          display: block;
          color: #667085;
          font-size: 12px;
          font-weight: 600;
        }

        .stat-card strong {
          display: block;
          margin-top: 2px;
          font-size: 25px;
          color: #1b5e20;
          line-height: 1.2;
        }

        .stat-card small {
          display: block;
          margin-top: 3px;
          color: #98a2b3;
          font-size: 11px;
        }

        /* COMMON CARD */

        .content-card {
          max-width: 1400px;
          margin: 0 auto 20px;
          background: white;
          border: 1px solid #e7ece7;
          border-radius: 16px;
          box-shadow: 0 5px 18px rgba(0, 0, 0, 0.045);
        }

        .form-card {
          padding: 25px;
        }

        .section-heading,
        .search-heading,
        .table-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .section-label {
          display: block;
          color: #2e7d32;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .section-heading h2,
        .search-heading h2,
        .table-heading h2 {
          margin: 0;
          font-size: 19px;
          color: #182230;
        }

        .section-heading p,
        .search-heading p,
        .table-heading p {
          margin: 5px 0 0;
          color: #7a8699;
          font-size: 12px;
        }

        .section-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: #e8f5e9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        /* FORM */

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 17px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 7px;
          color: #344054;
          font-size: 12px;
          font-weight: 700;
        }

        .form-group label span {
          color: #d32f2f;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          height: 43px;
          padding: 0 13px;
          border: 1px solid #d8dee6;
          border-radius: 9px;
          background: #fff;
          color: #344054;
          font-size: 13px;
          outline: none;
          transition: 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #43a047;
          box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.10);
        }

        .form-group input::placeholder {
          color: #a0a9b5;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid #edf0ed;
        }

        .primary-btn,
        .secondary-btn {
          border: none;
          height: 42px;
          padding: 0 18px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .primary-btn {
          background: #2e7d32;
          color: white;
        }

        .primary-btn:hover {
          background: #1b5e20;
          transform: translateY(-1px);
        }

        .secondary-btn {
          background: #eef1f0;
          color: #475467;
        }

        .secondary-btn:hover {
          background: #e1e5e3;
        }

        /* SEARCH */

        .search-card {
          padding: 22px 25px;
        }

        .search-heading {
          margin-bottom: 18px;
        }

        .result-counter {
          min-width: 82px;
          padding: 10px 14px;
          border-radius: 11px;
          background: #f1f8f2;
          text-align: center;
        }

        .result-counter strong {
          display: block;
          color: #2e7d32;
          font-size: 20px;
        }

        .result-counter span {
          color: #7a8699;
          font-size: 10px;
          font-weight: 600;
        }

        .search-grid {
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: 14px;
          align-items: end;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon span {
          position: absolute;
          left: 13px;
          top: 12px;
          font-size: 14px;
        }

        .input-with-icon input {
          padding-left: 38px;
        }

        .reset-btn {
          height: 43px;
          padding: 0 17px;
          border: none;
          border-radius: 9px;
          background: #475467;
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .reset-btn:hover {
          background: #344054;
        }

        .result-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid #edf0ed;
          color: #667085;
          font-size: 12px;
        }

        .result-bar strong {
          color: #344054;
        }

        .filter-active {
          padding: 4px 9px;
          border-radius: 15px;
          background: #fff4d6;
          color: #9a6700;
          font-size: 10px;
          font-weight: 700;
        }

        /* TABLE */

        .table-card {
          padding: 24px;
        }

        .table-heading {
          margin-bottom: 18px;
        }

        .table-count {
          padding: 7px 11px;
          border-radius: 20px;
          background: #e8f5e9;
          color: #2e7d32;
          font-size: 11px;
          font-weight: 700;
        }

        .table-wrapper {
          overflow-x: auto;
          border: 1px solid #e7ece7;
          border-radius: 11px;
        }

        table {
          width: 100%;
          min-width: 1150px;
          border-collapse: collapse;
        }

        thead {
          background: #f7f9f7;
        }

        th {
          padding: 12px 13px;
          border-bottom: 1px solid #e3e8e3;
          color: #667085;
          font-size: 10px;
          font-weight: 800;
          text-align: left;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        td {
          padding: 12px 13px;
          border-bottom: 1px solid #eef1ee;
          color: #475467;
          font-size: 12px;
          white-space: nowrap;
        }

        tbody tr {
          transition: 0.15s ease;
        }

        tbody tr:hover {
          background: #fafdfb;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .id-badge {
          color: #667085;
          font-weight: 700;
          font-size: 11px;
        }

        .farmer-cell {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .farmer-avatar {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          background: #e8f5e9;
          color: #2e7d32;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }

        .farmer-cell strong {
          color: #344054;
          font-size: 12px;
        }

        .field-name-cell {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .field-icon {
          font-size: 15px;
        }

        .field-name-cell strong {
          color: #182230;
        }

        .area-badge,
        .info-badge,
        .irrigation-badge,
        .crop-badge {
          display: inline-block;
          padding: 5px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
        }

        .area-badge {
          background: #edf7ee;
          color: #2e7d32;
        }

        .info-badge {
          background: #f0f3f6;
          color: #596579;
        }

        .irrigation-badge {
          background: #edf7fb;
          color: #1877a8;
        }

        .crop-badge {
          background: #f0f8e9;
          color: #558b2f;
        }

        .location-text {
          color: #596579;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .edit-btn,
        .delete-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          font-size: 13px;
          transition: 0.2s ease;
        }

        .edit-btn {
          background: #eaf3ff;
          color: #1976d2;
        }

        .delete-btn {
          background: #fff0f0;
          color: #d32f2f;
        }

        .edit-btn:hover,
        .delete-btn:hover {
          transform: translateY(-1px);
        }

        /* LOADING */

        .loading-state {
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .spinner {
          width: 35px;
          height: 35px;
          border: 3px solid #e2eee3;
          border-top-color: #2e7d32;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-state h3 {
          margin: 13px 0 4px;
          color: #344054;
          font-size: 14px;
        }

        .loading-state p {
          margin: 0;
          color: #98a2b3;
          font-size: 11px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* EMPTY */

        .empty-state {
          min-height: 230px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #f1f8f2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 27px;
        }

        .empty-state h3 {
          margin: 12px 0 4px;
          color: #344054;
          font-size: 15px;
        }

        .empty-state p {
          margin: 0;
          color: #98a2b3;
          font-size: 12px;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {

          .field-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .search-grid {
            grid-template-columns: 1fr 1fr;
          }

          .reset-btn {
            width: 100%;
          }

        }

        @media (max-width: 700px) {

          .fields-page {
            padding: 15px;
          }

          .fields-hero {
            padding: 20px;
            min-height: auto;
          }

          .hero-title-row h1 {
            font-size: 21px;
          }

          .hero-right {
            display: none;
          }

          .field-stats {
            grid-template-columns: 1fr;
          }

          .form-card,
          .search-card,
          .table-card {
            padding: 18px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .search-grid {
            grid-template-columns: 1fr;
          }

          .section-heading,
          .search-heading,
          .table-heading {
            align-items: flex-start;
          }

          .section-icon {
            display: none;
          }

          .result-counter {
            min-width: 70px;
          }

        }

        @media (max-width: 480px) {

          .fields-hero {
            border-radius: 13px;
          }

          .hero-icon {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }

          .hero-content {
            gap: 12px;
          }

          .hero-title-row h1 {
            font-size: 18px;
          }

          .fields-hero p {
            font-size: 11px;
          }

          .form-actions {
            flex-direction: column;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
}

export default Fields;