import { useEffect, useState } from "react";
import "./Harvest.css";

function Harvest() {
  const [crops, setCrops] = useState([]);
  const [harvests, setHarvests] = useState([]);

  const [editingId, setEditingId] = useState(null);

  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState("All");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [unitFilter, setUnitFilter] = useState("All");

  // =========================
  // FORM
  // =========================

  const [form, setForm] = useState({
    crop_id: "",
    harvest_date: "",
    quantity: "",
    unit: "kg",
    quality_grade: "Good",
    storage_location: "",
    notes: ""
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchCrops();
    fetchHarvests();
  }, []);

  // =========================
  // GET CROPS
  // =========================

  const fetchCrops = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/crops"
      );

      const data = await response.json();

      setCrops(data);
    } catch (error) {
      console.log(
        "Error fetching crops:",
        error
      );
    }
  };

  // =========================
  // GET HARVESTS
  // =========================

  const fetchHarvests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/harvests"
      );

      const data = await response.json();

      setHarvests(data);
    } catch (error) {
      console.log(
        "Error fetching harvests:",
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
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    if (!form.crop_id) {
      alert("Please select a crop.");
      return false;
    }

    if (!form.harvest_date) {
      alert("Please select a harvest date.");
      return false;
    }

    // Prevent future harvest dates
    const selectedDate = new Date(
      form.harvest_date + "T23:59:59"
    );

    const today = new Date();

    if (selectedDate > today) {
      alert(
        "Harvest date cannot be in the future."
      );
      return false;
    }

    if (!form.quantity) {
      alert("Please enter harvest quantity.");
      return false;
    }

    const quantity = Number(form.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      alert(
        "Harvest quantity must be greater than 0."
      );
      return false;
    }

    if (
      form.storage_location.trim().length > 200
    ) {
      alert(
        "Storage location cannot exceed 200 characters."
      );
      return false;
    }

    if (form.notes.trim().length > 500) {
      alert(
        "Notes cannot exceed 500 characters."
      );
      return false;
    }

    return true;
  };

  // =========================
  // EDIT HARVEST
  // =========================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      crop_id: item.crop_id || "",

      harvest_date: item.harvest_date
        ? String(item.harvest_date).substring(0, 10)
        : "",

      quantity: item.quantity || "",

      unit: item.unit || "kg",

      quality_grade:
        item.quality_grade || "Good",

      storage_location:
        item.storage_location || "",

      notes: item.notes || ""
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
      harvest_date: "",
      quantity: "",
      unit: "kg",
      quality_grade: "Good",
      storage_location: "",
      notes: ""
    });
  };

  // =========================
  // ADD / UPDATE
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
          `http://localhost:5000/harvests/${editingId}`,
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
          "http://localhost:5000/harvests",
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
            "Harvest updated successfully! 🌾"
          );
        } else {
          alert(
            "Harvest added successfully! 🌾"
          );
        }

        setForm({
          crop_id: "",
          harvest_date: "",
          quantity: "",
          unit: "kg",
          quality_grade: "Good",
          storage_location: "",
          notes: ""
        });

        setEditingId(null);

        fetchHarvests();
      } else {
        alert(
          data.message ||
            "Harvest operation failed!"
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
  // DELETE
  // =========================

  const deleteHarvest = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this harvest record?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/harvests/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Harvest deleted successfully! 🌾"
        );

        fetchHarvests();
      } else {
        alert(
          data.message ||
            "Harvest delete failed!"
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

  const filteredHarvests = harvests.filter(
    (item) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(item.crop_name || "")
          .toLowerCase()
          .includes(search) ||
        String(item.field_name || "")
          .toLowerCase()
          .includes(search) ||
        String(item.harvest_date || "")
          .toLowerCase()
          .includes(search) ||
        String(item.quantity || "")
          .toLowerCase()
          .includes(search) ||
        String(item.unit || "")
          .toLowerCase()
          .includes(search) ||
        String(item.quality_grade || "")
          .toLowerCase()
          .includes(search) ||
        String(item.storage_location || "")
          .toLowerCase()
          .includes(search) ||
        String(item.notes || "")
          .toLowerCase()
          .includes(search);

      const matchesCrop =
        cropFilter === "All" ||
        String(item.crop_id) ===
          String(cropFilter);

      const matchesQuality =
        qualityFilter === "All" ||
        item.quality_grade ===
          qualityFilter;

      const matchesUnit =
        unitFilter === "All" ||
        item.unit === unitFilter;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesQuality &&
        matchesUnit
      );
    }
  );

  // =========================
  // RESET SEARCH
  // =========================

  const resetSearch = () => {
    setSearchTerm("");
    setCropFilter("All");
    setQualityFilter("All");
    setUnitFilter("All");
  };

  // =========================
  // SUMMARY CALCULATIONS
  // =========================

  const totalRecords =
    filteredHarvests.length;

  const totalQuantity =
    filteredHarvests.reduce(
      (total, item) => {
        return (
          total +
          Number(item.quantity || 0)
        );
      },
      0
    );

  const excellentCount =
    filteredHarvests.filter(
      (item) =>
        item.quality_grade === "Excellent"
    ).length;

  const goodCount =
    filteredHarvests.filter(
      (item) =>
        item.quality_grade === "Good"
    ).length;

  return (
    <div className="harvest-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="harvest-hero">

        <div className="harvest-hero-content">

          <div className="harvest-hero-icon">
            🌾
          </div>

          <div>
            <p className="harvest-eyebrow">
              HARVEST MANAGEMENT
            </p>

            <h1>
              Harvest Records
            </h1>

            <p className="harvest-hero-text">
              Record, monitor and manage your
              harvested crop production with
              accurate harvest data.
            </p>
          </div>

        </div>

        <div className="harvest-hero-badge">
          <span>●</span>
          Production Tracking
        </div>

      </section>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="harvest-stat-grid">

        <div className="harvest-stat-card">

          <div className="harvest-stat-icon records-icon">
            📋
          </div>

          <div className="harvest-stat-info">
            <span>
              Harvest Records
            </span>

            <strong>
              {totalRecords}
            </strong>

            <small>
              Matching records
            </small>
          </div>

        </div>

        <div className="harvest-stat-card">

          <div className="harvest-stat-icon quantity-icon">
            ⚖️
          </div>

          <div className="harvest-stat-info">
            <span>
              Total Quantity
            </span>

            <strong>
              {totalQuantity.toFixed(2)}
            </strong>

            <small>
              Combined harvest amount
            </small>
          </div>

        </div>

        <div className="harvest-stat-card">

          <div className="harvest-stat-icon excellent-icon">
            ⭐
          </div>

          <div className="harvest-stat-info">
            <span>
              Excellent Quality
            </span>

            <strong>
              {excellentCount}
            </strong>

            <small>
              Premium harvest records
            </small>
          </div>

        </div>

        <div className="harvest-stat-card">

          <div className="harvest-stat-icon good-icon">
            🌱
          </div>

          <div className="harvest-stat-info">
            <span>
              Good Quality
            </span>

            <strong>
              {goodCount}
            </strong>

            <small>
              Good grade harvests
            </small>
          </div>

        </div>

      </section>

      {/* =========================
          FORM SECTION
      ========================= */}

      <section className="harvest-section-card">

        <div className="harvest-section-header">

          <div>

            <p className="harvest-section-label">
              HARVEST ENTRY
            </p>

            <h2>
              {editingId
                ? "✏️ Edit Harvest Record"
                : "➕ Add New Harvest"}
            </h2>

            <p>
              Enter accurate details about the
              harvested crop production.
            </p>

          </div>

          {editingId && (
            <div className="harvest-edit-indicator">
              Editing Record #{editingId}
            </div>
          )}

        </div>

        <form
          className="harvest-form"
          onSubmit={handleSubmit}
        >

          {/* CROP */}

          <div className="harvest-form-group">

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

          {/* HARVEST DATE */}

          <div className="harvest-form-group">

            <label htmlFor="harvest_date">
              Harvest Date
              <span>*</span>
            </label>

            <input
              id="harvest_date"
              type="date"
              name="harvest_date"
              value={form.harvest_date}
              onChange={handleChange}
              required
            />

          </div>

          {/* QUANTITY */}

          <div className="harvest-form-group">

            <label htmlFor="quantity">
              Harvest Quantity
              <span>*</span>
            </label>

            <input
              id="quantity"
              type="number"
              step="0.01"
              min="0"
              name="quantity"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />

          </div>

          {/* UNIT */}

          <div className="harvest-form-group">

            <label htmlFor="unit">
              Unit
            </label>

            <select
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <option value="kg">
                Kilograms (kg)
              </option>

              <option value="tons">
                Tons
              </option>

              <option value="g">
                Grams (g)
              </option>
            </select>

          </div>

          {/* QUALITY */}

          <div className="harvest-form-group">

            <label htmlFor="quality_grade">
              Quality Grade
            </label>

            <select
              id="quality_grade"
              name="quality_grade"
              value={form.quality_grade}
              onChange={handleChange}
            >
              <option value="Excellent">
                Excellent
              </option>

              <option value="Good">
                Good
              </option>

              <option value="Average">
                Average
              </option>

              <option value="Poor">
                Poor
              </option>
            </select>

          </div>

          {/* STORAGE */}

          <div className="harvest-form-group">

            <label htmlFor="storage_location">
              Storage Location
            </label>

            <input
              id="storage_location"
              type="text"
              name="storage_location"
              placeholder="Example: Main Store"
              value={form.storage_location}
              onChange={handleChange}
              maxLength="200"
            />

          </div>

          {/* NOTES */}

          <div className="harvest-form-group full-width">

            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              placeholder="Add additional harvest notes..."
              value={form.notes}
              onChange={handleChange}
              rows="4"
              maxLength="500"
            ></textarea>

            <div className="harvest-character-count">
              {form.notes.length}/500 characters
            </div>

          </div>

          {/* BUTTONS */}

          <div className="harvest-form-actions">

            <button
              type="submit"
              className="harvest-primary-btn"
            >
              {editingId
                ? "💾 Update Harvest"
                : "💾 Save Harvest"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="harvest-secondary-btn"
              >
                ✕ Cancel Edit
              </button>
            )}

          </div>

        </form>

      </section>

      {/* =========================
          PART 2 CONTINUES HERE
          SEARCH + FILTER
          TABLE
          FOOTER
      ========================= */}
            {/* =========================
          SEARCH & FILTER
      ========================= */}

      <section className="harvest-section-card">

        <div className="harvest-section-header">

          <div>

            <p className="harvest-section-label">
              RECORD DISCOVERY
            </p>

            <h2>
              🔍 Search & Filter Harvests
            </h2>

            <p>
              Quickly find harvest records using
              search and filters.
            </p>

          </div>

        </div>

        <div className="harvest-filter-grid">

          {/* SEARCH */}

          <div className="harvest-search-box">

            <label htmlFor="harvest-search">
              Search Records
            </label>

            <div className="harvest-search-input">

              <span>🔍</span>

              <input
                id="harvest-search"
                type="text"
                placeholder="Search crop, field, date, quality..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

          </div>

          {/* CROP FILTER */}

          <div className="harvest-filter-group">

            <label htmlFor="crop-filter">
              Crop
            </label>

            <select
              id="crop-filter"
              value={cropFilter}
              onChange={(e) =>
                setCropFilter(e.target.value)
              }
            >
              <option value="All">
                All Crops
              </option>

              {crops.map((crop) => (
                <option
                  key={crop.id}
                  value={crop.id}
                >
                  {crop.crop_name}
                </option>
              ))}
            </select>

          </div>

          {/* QUALITY FILTER */}

          <div className="harvest-filter-group">

            <label htmlFor="quality-filter">
              Quality
            </label>

            <select
              id="quality-filter"
              value={qualityFilter}
              onChange={(e) =>
                setQualityFilter(e.target.value)
              }
            >
              <option value="All">
                All Quality Grades
              </option>

              <option value="Excellent">
                Excellent
              </option>

              <option value="Good">
                Good
              </option>

              <option value="Average">
                Average
              </option>

              <option value="Poor">
                Poor
              </option>
            </select>

          </div>

          {/* UNIT FILTER */}

          <div className="harvest-filter-group">

            <label htmlFor="unit-filter">
              Unit
            </label>

            <select
              id="unit-filter"
              value={unitFilter}
              onChange={(e) =>
                setUnitFilter(e.target.value)
              }
            >
              <option value="All">
                All Units
              </option>

              <option value="kg">
                Kilograms (kg)
              </option>

              <option value="tons">
                Tons
              </option>

              <option value="g">
                Grams (g)
              </option>

            </select>

          </div>

        </div>

        {/* FILTER FOOTER */}

        <div className="harvest-filter-footer">

          <div className="harvest-result-info">

            <span className="result-icon">
              📊
            </span>

            <span>
              Showing{" "}
              <strong>
                {filteredHarvests.length}
              </strong>{" "}
              of{" "}
              <strong>
                {harvests.length}
              </strong>{" "}
              harvest records
            </span>

          </div>

          <button
            type="button"
            onClick={resetSearch}
            className="harvest-reset-btn"
          >
            🔄 Reset Filters
          </button>

        </div>

      </section>

      {/* =========================
          HARVEST RECORDS TABLE
      ========================= */}

      <section className="harvest-table-card">

        <div className="harvest-table-header">

          <div>

            <p className="harvest-section-label">
              HARVEST DATA
            </p>

            <h2>
              📋 Harvest Records
            </h2>

            <p>
              Review and manage all recorded
              harvest production.
            </p>

          </div>

          <div className="harvest-record-count">
            {filteredHarvests.length} Records
          </div>

        </div>

        {filteredHarvests.length === 0 ? (

          <div className="harvest-empty-state">

            <div className="harvest-empty-icon">
              🌾
            </div>

            <h3>
              No Harvest Records Found
            </h3>

            <p>
              No harvest records match your
              current search or filter settings.
            </p>

            <button
              type="button"
              onClick={resetSearch}
              className="harvest-empty-btn"
            >
              🔄 Clear Filters
            </button>

          </div>

        ) : (

          <div className="harvest-table-wrapper">

            <table className="harvest-table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Crop</th>

                  <th>Field</th>

                  <th>Harvest Date</th>

                  <th>Quantity</th>

                  <th>Quality</th>

                  <th>Storage</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredHarvests.map((item) => (

                  <tr key={item.id}>

                    {/* ID */}

                    <td>

                      <span className="harvest-id">
                        #{item.id}
                      </span>

                    </td>

                    {/* CROP */}

                    <td>

                      <div className="harvest-crop-cell">

                        <span className="crop-icon">
                          🌾
                        </span>

                        <div>

                          <strong>
                            {item.crop_name || "-"}
                          </strong>

                        </div>

                      </div>

                    </td>

                    {/* FIELD */}

                    <td>

                      <span className="harvest-field">
                        📍{" "}
                        {item.field_name || "-"}
                      </span>

                    </td>

                    {/* DATE */}

                    <td>

                      <span className="harvest-date">
                        📅{" "}
                        {item.harvest_date || "-"}
                      </span>

                    </td>

                    {/* QUANTITY */}

                    <td>

                      <span className="harvest-quantity">

                        {item.quantity
                          ? Number(
                              item.quantity
                            ).toFixed(2)
                          : "0.00"}

                        <small>
                          {" "}
                          {item.unit || ""}
                        </small>

                      </span>

                    </td>

                    {/* QUALITY */}

                    <td>

                      <span
                        className={`harvest-quality-badge ${String(
                          item.quality_grade || ""
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >

                        {item.quality_grade ===
                          "Excellent" && "⭐"}

                        {item.quality_grade ===
                          "Good" && "✓"}

                        {item.quality_grade ===
                          "Average" && "•"}

                        {item.quality_grade ===
                          "Poor" && "!"}

                        {" "}

                        {item.quality_grade ||
                          "Unknown"}

                      </span>

                    </td>

                    {/* STORAGE */}

                    <td>

                      <span className="harvest-storage">

                        {item.storage_location ? (
                          <>
                            📦{" "}
                            {item.storage_location}
                          </>
                        ) : (
                          <span className="not-available">
                            Not specified
                          </span>
                        )}

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="harvest-action-buttons">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="harvest-edit-btn"
                          title="Edit harvest"
                        >
                          ✏️
                          <span>
                            Edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteHarvest(item.id)
                          }
                          className="harvest-delete-btn"
                          title="Delete harvest"
                        >
                          🗑️
                          <span>
                            Delete
                          </span>
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
          INFORMATION FOOTER
      ========================= */}

      <div className="harvest-info-footer">

        <div className="harvest-info-icon">
          💡
        </div>

        <div>

          <strong>
            Harvest Management Tip
          </strong>

          <p>
            Keep harvest quantities and quality
            grades accurate to support better
            production planning and reporting.
          </p>

        </div>

      </div>

      {/* =========================
          PAGE FOOTER
      ========================= */}

      <div className="harvest-page-footer">

        <span>
          🌾 Paddy Field Management System
        </span>

        <span>
          Harvest Management
        </span>

      </div>

    </div>
  );
}

export default Harvest;