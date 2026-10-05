import { useEffect, useState } from "react";
import "./Cultivation.css";

function Cultivation() {
  const [crops, setCrops] = useState([]);
  const [cultivations, setCultivations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [form, setForm] = useState({
    crop_id: "",
    planting_method: "",
    seed_quantity: "",
    seed_unit: "kg",
    planting_date: "",
    expected_harvest_date: "",
    water_schedule: "",
    status: "Planned",
    notes: ""
  });

  useEffect(() => {
    fetchCrops();
    fetchCultivations();
  }, []);

  // =========================
  // FETCH CROPS
  // =========================

  const fetchCrops = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/crops"
      );

      const data = await response.json();

      setCrops(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.log(
        "Error fetching crops:",
        error
      );
    }
  };

  // =========================
  // FETCH CULTIVATIONS
  // =========================

  const fetchCultivations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/cultivations"
      );

      const data = await response.json();

      setCultivations(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.log(
        "Error fetching cultivations:",
        error
      );
    }
  };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    if (!form.crop_id) {
      alert(
        "Please select a crop."
      );
      return false;
    }

    if (
      form.seed_quantity &&
      Number(form.seed_quantity) <= 0
    ) {
      alert(
        "Seed quantity must be greater than 0."
      );
      return false;
    }

    if (
      form.planting_date &&
      form.expected_harvest_date &&
      form.expected_harvest_date <
        form.planting_date
    ) {
      alert(
        "Expected harvest date cannot be earlier than planting date."
      );
      return false;
    }

    return true;
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      crop_id:
        item.crop_id || "",

      planting_method:
        item.planting_method || "",

      seed_quantity:
        item.seed_quantity || "",

      seed_unit:
        item.seed_unit || "kg",

      planting_date:
        item.planting_date
          ? String(
              item.planting_date
            ).substring(0, 10)
          : "",

      expected_harvest_date:
        item.expected_harvest_date
          ? String(
              item.expected_harvest_date
            ).substring(0, 10)
          : "",

      water_schedule:
        item.water_schedule || "",

      status:
        item.status || "Planned",

      notes:
        item.notes || ""
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
    setEditingId(null);

    setForm({
      crop_id: "",
      planting_method: "",
      seed_quantity: "",
      seed_unit: "kg",
      planting_date: "",
      expected_harvest_date: "",
      water_schedule: "",
      status: "Planned",
      notes: ""
    });
  };
  // =========================
  // ADD / UPDATE CULTIVATION
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `http://localhost:5000/cultivations/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/cultivations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
          }
        );
      }

      const data = await response.json();

      if (response.ok) {
        if (editingId) {
          alert(
            "Cultivation updated successfully! 🌱"
          );
        } else {
          alert(
            "Cultivation added successfully! 🌱"
          );
        }

        setForm({
          crop_id: "",
          planting_method: "",
          seed_quantity: "",
          seed_unit: "kg",
          planting_date: "",
          expected_harvest_date: "",
          water_schedule: "",
          status: "Planned",
          notes: ""
        });

        setEditingId(null);

        fetchCultivations();
      } else {
        alert(
          data.message ||
            "Cultivation operation failed!"
        );
      }
    } catch (error) {
      console.log(error);

      alert(
        "Backend connection failed!"
      );
    }
  };

  // =========================
  // DELETE CULTIVATION
  // =========================

  const deleteCultivation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this cultivation record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/cultivations/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Cultivation deleted successfully! 🌱"
        );

        fetchCultivations();
      } else {
        alert(
          data.message ||
            "Delete failed!"
        );
      }
    } catch (error) {
      console.log(error);

      alert(
        "Backend connection failed!"
      );
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredCultivations =
    cultivations.filter((item) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        (item.crop_name || "")
          .toLowerCase()
          .includes(search) ||
        (item.field_name || "")
          .toLowerCase()
          .includes(search) ||
        (item.planting_method || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        filterStatus === "All"
          ? true
          : item.status === filterStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =========================
  // STATISTICS
  // =========================

  const totalCultivations =
    cultivations.length;

  const plannedCount =
    cultivations.filter(
      (item) =>
        item.status === "Planned"
    ).length;

  const growingCount =
    cultivations.filter(
      (item) =>
        item.status === "Growing"
    ).length;

  const readyCount =
    cultivations.filter(
      (item) =>
        item.status === "Ready"
    ).length;

  // =========================
  // STATUS BADGE CLASS
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "Planned":
        return "status-badge status-planned";

      case "Planted":
        return "status-badge status-planted";

      case "Growing":
        return "status-badge status-growing";

      case "Ready":
        return "status-badge status-ready";

      case "Harvested":
        return "status-badge status-harvested";

      default:
        return "status-badge";
    }
  };

  // =========================
  // RESET FILTERS
  // =========================

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("All");
  };

  return (
    <div className="cultivation-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="cultivation-hero">

        <div className="cultivation-hero-content">

          <div className="hero-icon">
            🌱
          </div>

          <div>
            <span className="hero-label">
              SMART AGRICULTURE
            </span>

            <h1>
              Cultivation Management
            </h1>

            <p>
              Plan, monitor and manage
              your crop cultivation
              activities efficiently.
            </p>
          </div>

        </div>

        <div className="hero-decoration">
          🌾
        </div>

      </section>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="cultivation-stats">

        <div className="cultivation-stat-card">

          <div className="stat-icon">
            🌱
          </div>

          <div className="stat-info">
            <span>
              Total Cultivations
            </span>

            <strong>
              {totalCultivations}
            </strong>
          </div>

        </div>

        <div className="cultivation-stat-card">

          <div className="stat-icon planned-icon">
            📋
          </div>

          <div className="stat-info">
            <span>
              Planned
            </span>

            <strong>
              {plannedCount}
            </strong>
          </div>

        </div>

        <div className="cultivation-stat-card">

          <div className="stat-icon growing-icon">
            🌿
          </div>

          <div className="stat-info">
            <span>
              Growing
            </span>

            <strong>
              {growingCount}
            </strong>
          </div>

        </div>

        <div className="cultivation-stat-card">

          <div className="stat-icon ready-icon">
            🌾
          </div>

          <div className="stat-info">
            <span>
              Ready
            </span>

            <strong>
              {readyCount}
            </strong>
          </div>

        </div>

      </section>

      {/* =========================
          FORM CARD
      ========================= */}

      <section className="cultivation-card">

        <div className="card-header">

          <div className="card-title-area">

            <div className="section-icon">
              {editingId
                ? "✏️"
                : "➕"}
            </div>

            <div>
              <h2>
                {editingId
                  ? "Edit Cultivation"
                  : "Add New Cultivation"}
              </h2>

              <p>
                {editingId
                  ? "Update the cultivation record details below."
                  : "Enter the details to create a new cultivation record."}
              </p>
            </div>

          </div>

          {editingId && (
            <span className="editing-indicator">
              Editing Record
            </span>
          )}

        </div>

        <form
          className="cultivation-form"
          onSubmit={handleSubmit}
        >

          {/* CROP */}

          <div className="form-group">

            <label htmlFor="crop_id">
              Crop
              <span>*</span>
            </label>

            <select
              id="crop_id"
              name="crop_id"
              value={form.crop_id}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Crop
              </option>

              {crops.map((crop) => (
                <option
                  key={crop.id}
                  value={crop.id}
                >
                  {crop.crop_name}
                  {crop.field_name
                    ? ` - ${crop.field_name}`
                    : ""}
                </option>
              ))}
            </select>

          </div>

          {/* PLANTING METHOD */}

          <div className="form-group">

            <label htmlFor="planting_method">
              Planting Method
            </label>

            <input
              id="planting_method"
              type="text"
              name="planting_method"
              value={
                form.planting_method
              }
              onChange={handleChange}
              placeholder="e.g. Direct Seeding"
            />

          </div>

          {/* SEED QUANTITY */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="seed_quantity">
                Seed Quantity
              </label>

              <input
                id="seed_quantity"
                type="number"
                step="0.01"
                min="0"
                name="seed_quantity"
                value={
                  form.seed_quantity
                }
                onChange={handleChange}
                placeholder="Enter quantity"
              />

            </div>

            <div className="form-group">

              <label htmlFor="seed_unit">
                Seed Unit
              </label>

              <select
                id="seed_unit"
                name="seed_unit"
                value={form.seed_unit}
                onChange={handleChange}
              >
                <option value="kg">
                  Kilograms (kg)
                </option>

                <option value="g">
                  Grams (g)
                </option>
              </select>

            </div>

          </div>

          {/* DATES */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="planting_date">
                Planting Date
              </label>

              <input
                id="planting_date"
                type="date"
                name="planting_date"
                value={
                  form.planting_date
                }
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label htmlFor="expected_harvest_date">
                Expected Harvest Date
              </label>

              <input
                id="expected_harvest_date"
                type="date"
                name="expected_harvest_date"
                value={
                  form.expected_harvest_date
                }
                onChange={handleChange}
              />

            </div>

          </div>

          {/* WATER + STATUS */}

          <div className="form-row">

            <div className="form-group">

              <label htmlFor="water_schedule">
                Water Schedule
              </label>

              <input
                id="water_schedule"
                type="text"
                name="water_schedule"
                value={
                  form.water_schedule
                }
                onChange={handleChange}
                placeholder="e.g. Every 3 days"
              />

            </div>

            <div className="form-group">

              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Planned">
                  Planned
                </option>

                <option value="Planted">
                  Planted
                </option>

                <option value="Growing">
                  Growing
                </option>

                <option value="Ready">
                  Ready
                </option>

                <option value="Harvested">
                  Harvested
                </option>
              </select>

            </div>

          </div>

          {/* NOTES */}

          <div className="form-group full-width">

            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any additional cultivation notes..."
            />

          </div>

          {/* FORM BUTTONS */}

          <div className="form-actions">

            <button
              type="submit"
              className="btn-primary"
            >
              {editingId
                ? "💾 Update Cultivation"
                : "➕ Save Cultivation"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelEdit}
              >
                ✕ Cancel
              </button>
            )}

          </div>

        </form>

      </section>
            {/* =========================
          SEARCH & FILTER
      ========================= */}

      <section className="cultivation-card filter-card">

        <div className="card-header filter-header">

          <div className="card-title-area">

            <div className="section-icon">
              🔎
            </div>

            <div>
              <h2>
                Search & Filter
              </h2>

              <p>
                Find cultivation records quickly.
              </p>
            </div>

          </div>

          {(searchTerm ||
            filterStatus !== "All") && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={resetFilters}
            >
              ↻ Clear Filters
            </button>
          )}

        </div>

        <div className="filter-controls">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by crop, field or planting method..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          <div className="status-filter">

            <label htmlFor="filterStatus">
              Status
            </label>

            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Planned">
                Planned
              </option>

              <option value="Planted">
                Planted
              </option>

              <option value="Growing">
                Growing
              </option>

              <option value="Ready">
                Ready
              </option>

              <option value="Harvested">
                Harvested
              </option>
            </select>

          </div>

        </div>

      </section>


      {/* =========================
          CULTIVATION RECORDS
      ========================= */}

      <section className="cultivation-card records-card">

        <div className="card-header">

          <div className="card-title-area">

            <div className="section-icon">
              🌾
            </div>

            <div>
              <h2>
                Cultivation Records
              </h2>

              <p>
                View and manage all cultivation activities.
              </p>
            </div>

          </div>

          <div className="record-count">
            {filteredCultivations.length}{" "}
            Records
          </div>

        </div>


        {/* =========================
            TABLE
        ========================= */}

        {filteredCultivations.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🌱
            </div>

            <h3>
              No Cultivation Records Found
            </h3>

            <p>
              {searchTerm ||
              filterStatus !== "All"
                ? "Try changing your search or filter."
                : "Start by adding your first cultivation record."}
            </p>

            {(searchTerm ||
              filterStatus !== "All") && (
              <button
                type="button"
                className="empty-clear-btn"
                onClick={resetFilters}
              >
                Clear Search & Filter
              </button>
            )}

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="cultivation-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Crop
                  </th>

                  <th>
                    Field
                  </th>

                  <th>
                    Planting Method
                  </th>

                  <th>
                    Seed Quantity
                  </th>

                  <th>
                    Planting Date
                  </th>

                  <th>
                    Harvest Date
                  </th>

                  <th>
                    Water Schedule
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCultivations.map(
                  (item) => (

                    <tr
                      key={item.id}
                    >

                      {/* ID */}

                      <td>
                        <span className="id-badge">
                          #{item.id}
                        </span>
                      </td>


                      {/* CROP */}

                      <td>

                        <div className="crop-cell">

                          <div className="crop-avatar">
                            🌱
                          </div>

                          <div>

                            <strong>
                              {item.crop_name ||
                                "N/A"}
                            </strong>

                            <small>
                              Crop
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* FIELD */}

                      <td>

                        <span className="field-name">
                          📍{" "}
                          {item.field_name ||
                            "N/A"}
                        </span>

                      </td>


                      {/* METHOD */}

                      <td>
                        {item.planting_method ||
                          "—"}
                      </td>


                      {/* SEED QUANTITY */}

                      <td>

                        {item.seed_quantity
                          ? `${item.seed_quantity} ${
                              item.seed_unit ||
                              "kg"
                            }`
                          : "—"}

                      </td>


                      {/* PLANTING DATE */}

                      <td>

                        {item.planting_date
                          ? String(
                              item.planting_date
                            ).substring(0, 10)
                          : "—"}

                      </td>


                      {/* HARVEST DATE */}

                      <td>

                        {item.expected_harvest_date
                          ? String(
                              item.expected_harvest_date
                            ).substring(0, 10)
                          : "—"}

                      </td>


                      {/* WATER SCHEDULE */}

                      <td>

                        {item.water_schedule
                          ? item.water_schedule
                          : "—"}

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={getStatusClass(
                            item.status
                          )}
                        >
                          <span className="status-dot">
                            ●
                          </span>

                          {item.status ||
                            "Unknown"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="table-actions">

                          <button
                            type="button"
                            className="action-btn edit-btn"
                            onClick={() =>
                              handleEdit(item)
                            }
                            title="Edit cultivation"
                          >
                            ✏️
                            <span>
                              Edit
                            </span>
                          </button>


                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() =>
                              deleteCultivation(
                                item.id
                              )
                            }
                            title="Delete cultivation"
                          >
                            🗑️
                            <span>
                              Delete
                            </span>
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* =========================
          FOOTER INFORMATION
      ========================= */}

      <div className="cultivation-footer">

        <span>
          🌱 Cultivation Management
        </span>

        <span>
          Showing{" "}
          <strong>
            {filteredCultivations.length}
          </strong>{" "}
          of{" "}
          <strong>
            {cultivations.length}
          </strong>{" "}
          records
        </span>

      </div>

    </div>
  );
}

export default Cultivation;