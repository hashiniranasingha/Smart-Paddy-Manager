import { useEffect, useState } from "react";
import "./FieldMonitoring.css";

function FieldMonitoring() {

  const [crops, setCrops] = useState([]);
  const [records, setRecords] = useState([]);

  const [editingId, setEditingId] = useState(null);

  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [pestFilter, setPestFilter] = useState("All");
  const [diseaseFilter, setDiseaseFilter] = useState("All");

  // =========================
  // FORM
  // =========================

  const [form, setForm] = useState({
    crop_id: "",
    monitoring_date: "",
    plant_height: "",
    water_level: "",
    pest_status: "No Pest",
    disease_status: "No Disease",
    growth_stage: "",
    notes: ""
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchCrops();
    fetchRecords();

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
  // GET MONITORING RECORDS
  // =========================

  const fetchRecords = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/field-monitoring"
      );

      const data = await response.json();

      setRecords(data);

    } catch (error) {

      console.log(
        "Error fetching monitoring records:",
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

    if (!form.monitoring_date) {

      alert("Please select a monitoring date.");

      return false;

    }

    const selectedDate =
      new Date(form.monitoring_date);

    const today = new Date();

    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {

      alert(
        "Monitoring date cannot be in the future."
      );

      return false;

    }

    if (form.plant_height !== "") {

      const height =
        Number(form.plant_height);

      if (isNaN(height) || height < 0) {

        alert(
          "Plant height must be 0 or greater."
        );

        return false;

      }

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
  // EDIT
  // =========================

  const handleEdit = (item) => {

    setEditingId(item.id);

    setForm({
      crop_id: item.crop_id || "",

      monitoring_date:
        item.monitoring_date
          ? String(
              item.monitoring_date
            ).substring(0, 10)
          : "",

      plant_height:
        item.plant_height || "",

      water_level:
        item.water_level || "",

      pest_status:
        item.pest_status || "No Pest",

      disease_status:
        item.disease_status || "No Disease",

      growth_stage:
        item.growth_stage || "",

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
      monitoring_date: "",
      plant_height: "",
      water_level: "",
      pest_status: "No Pest",
      disease_status: "No Disease",
      growth_stage: "",
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
          `http://localhost:5000/field-monitoring/${editingId}`,
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
          "http://localhost:5000/field-monitoring",
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
            "Monitoring record updated successfully! 🌾"
          );

        } else {

          alert(
            "Monitoring record added successfully! 🌾"
          );

        }

        setForm({
          crop_id: "",
          monitoring_date: "",
          plant_height: "",
          water_level: "",
          pest_status: "No Pest",
          disease_status: "No Disease",
          growth_stage: "",
          notes: ""
        });

        setEditingId(null);

        fetchRecords();

      } else {

        alert(
          data.message ||
          "Monitoring operation failed!"
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

  const deleteRecord = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this monitoring record?"
    );

    if (!confirmDelete) return;

    try {

      const response = await fetch(
        `http://localhost:5000/field-monitoring/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(
          "Monitoring record deleted successfully! 🌾"
        );

        fetchRecords();

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
  // FILTER RECORDS
  // =========================

  const filteredRecords = records.filter((item) => {

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

      String(item.monitoring_date || "")
        .toLowerCase()
        .includes(search) ||

      String(item.water_level || "")
        .toLowerCase()
        .includes(search) ||

      String(item.pest_status || "")
        .toLowerCase()
        .includes(search) ||

      String(item.disease_status || "")
        .toLowerCase()
        .includes(search) ||

      String(item.growth_stage || "")
        .toLowerCase()
        .includes(search) ||

      String(item.notes || "")
        .toLowerCase()
        .includes(search);

    const matchesPest =
      pestFilter === "All" ||
      item.pest_status === pestFilter;

    const matchesDisease =
      diseaseFilter === "All" ||
      item.disease_status === diseaseFilter;

    return (
      matchesSearch &&
      matchesPest &&
      matchesDisease
    );

  });

  // =========================
  // RESET SEARCH / FILTER
  // =========================

  const resetSearch = () => {

    setSearchTerm("");
    setPestFilter("All");
    setDiseaseFilter("All");

  };

  // =========================
  // STATISTICS
  // =========================

  const totalRecords = records.length;

  const healthyRecords = records.filter(
    (item) =>
      item.pest_status === "No Pest" &&
      item.disease_status === "No Disease"
  ).length;

  const pestRecords = records.filter(
    (item) =>
      item.pest_status !== "No Pest"
  ).length;

  const diseaseRecords = records.filter(
    (item) =>
      item.disease_status !== "No Disease"
  ).length;

  return (
        <div className="monitoring-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <div className="monitoring-hero">

        <div className="monitoring-hero-content">

          <div className="monitoring-hero-icon">
            🌾
          </div>

          <div>

            <h1>
              Field Monitoring
            </h1>

            <p>
              Monitor crop growth, water levels,
              pests and diseases.
            </p>

          </div>

        </div>

        <div className="monitoring-hero-badge">
          Smart Agriculture
        </div>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="monitoring-stats">

        <div className="monitoring-stat-card">

          <div className="monitoring-stat-icon total">
            📊
          </div>

          <div>

            <span>
              Total Records
            </span>

            <strong>
              {totalRecords}
            </strong>

          </div>

        </div>


        <div className="monitoring-stat-card">

          <div className="monitoring-stat-icon healthy">
            🌱
          </div>

          <div>

            <span>
              Healthy
            </span>

            <strong>
              {healthyRecords}
            </strong>

          </div>

        </div>


        <div className="monitoring-stat-card">

          <div className="monitoring-stat-icon pest">
            🐛
          </div>

          <div>

            <span>
              Pest Alerts
            </span>

            <strong>
              {pestRecords}
            </strong>

          </div>

        </div>


        <div className="monitoring-stat-card">

          <div className="monitoring-stat-icon disease">
            🦠
          </div>

          <div>

            <span>
              Disease Alerts
            </span>

            <strong>
              {diseaseRecords}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          FORM CARD
      ========================= */}

      <div className="monitoring-card monitoring-form-card">

        <div className="monitoring-card-header">

          <div>

            <h2>
              {editingId
                ? "✏️ Edit Monitoring Record"
                : "➕ Add Monitoring Record"}
            </h2>

            <p>
              {editingId
                ? "Update the selected field monitoring information."
                : "Record the latest condition of your crop field."}
            </p>

          </div>

          {editingId && (

            <span className="editing-badge">
              Editing Record #{editingId}
            </span>

          )}

        </div>


        <form onSubmit={handleSubmit}>

          <div className="monitoring-form-grid">

            {/* CROP */}

            <div className="monitoring-form-group">

              <label>
                Crop <span>*</span>
              </label>

              <select
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


            {/* MONITORING DATE */}

            <div className="monitoring-form-group">

              <label>
                Monitoring Date <span>*</span>
              </label>

              <input
                type="date"
                name="monitoring_date"
                value={form.monitoring_date}
                onChange={handleChange}
                required
              />

            </div>


            {/* PLANT HEIGHT */}

            <div className="monitoring-form-group">

              <label>
                Plant Height
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="plant_height"
                  placeholder="Enter height"
                  value={form.plant_height}
                  onChange={handleChange}
                />

                <span>
                  cm
                </span>

              </div>

            </div>


            {/* WATER LEVEL */}

            <div className="monitoring-form-group">

              <label>
                Water Level
              </label>

              <select
                name="water_level"
                value={form.water_level}
                onChange={handleChange}
              >

                <option value="">
                  Select Water Level
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Normal">
                  Normal
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>


            {/* PEST STATUS */}

            <div className="monitoring-form-group">

              <label>
                Pest Status
              </label>

              <select
                name="pest_status"
                value={form.pest_status}
                onChange={handleChange}
              >

                <option value="No Pest">
                  No Pest
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>


            {/* DISEASE STATUS */}

            <div className="monitoring-form-group">

              <label>
                Disease Status
              </label>

              <select
                name="disease_status"
                value={form.disease_status}
                onChange={handleChange}
              >

                <option value="No Disease">
                  No Disease
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>


            {/* GROWTH STAGE */}

            <div className="monitoring-form-group">

              <label>
                Growth Stage
              </label>

              <select
                name="growth_stage"
                value={form.growth_stage}
                onChange={handleChange}
              >

                <option value="">
                  Select Growth Stage
                </option>

                <option value="Seedling">
                  Seedling
                </option>

                <option value="Vegetative">
                  Vegetative
                </option>

                <option value="Tillering">
                  Tillering
                </option>

                <option value="Flowering">
                  Flowering
                </option>

                <option value="Grain Filling">
                  Grain Filling
                </option>

                <option value="Mature">
                  Mature
                </option>

              </select>

            </div>


            {/* NOTES */}

            <div className="monitoring-form-group monitoring-full-width">

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                placeholder="Enter observations about the crop or field..."
                value={form.notes}
                onChange={handleChange}
                rows="4"
                maxLength="500"
              ></textarea>

              <small>
                {form.notes.length}/500 characters
              </small>

            </div>

          </div>


          {/* FORM ACTIONS */}

          <div className="monitoring-form-actions">

            <button
              type="submit"
              className="monitoring-primary-button"
            >

              {editingId
                ? "💾 Update Record"
                : "💾 Save Record"}

            </button>


            {editingId && (

              <button
                type="button"
                onClick={cancelEdit}
                className="monitoring-secondary-button"
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* =========================
          SEARCH & FILTER
      ========================= */}

      <div className="monitoring-card monitoring-filter-card">

        <div className="monitoring-card-header">

          <div>

            <h2>
              🔎 Search & Filter
            </h2>

            <p>
              Find monitoring records quickly.
            </p>

          </div>

          <div className="monitoring-result-count">
            Showing <strong>{filteredRecords.length}</strong> of{" "}
            <strong>{records.length}</strong> records
          </div>

        </div>


        <div className="monitoring-filter-grid">

          {/* SEARCH */}

          <div className="monitoring-search-wrapper">

            <span className="monitoring-search-icon">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search crop, field, water, growth..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>


          {/* PEST FILTER */}

          <select
            value={pestFilter}
            onChange={(e) =>
              setPestFilter(e.target.value)
            }
          >

            <option value="All">
              All Pest Status
            </option>

            <option value="No Pest">
              No Pest
            </option>

            <option value="Low">
              Low Pest
            </option>

            <option value="Medium">
              Medium Pest
            </option>

            <option value="High">
              High Pest
            </option>

          </select>


          {/* DISEASE FILTER */}

          <select
            value={diseaseFilter}
            onChange={(e) =>
              setDiseaseFilter(e.target.value)
            }
          >

            <option value="All">
              All Disease Status
            </option>

            <option value="No Disease">
              No Disease
            </option>

            <option value="Low">
              Low Disease
            </option>

            <option value="Medium">
              Medium Disease
            </option>

            <option value="High">
              High Disease
            </option>

          </select>


          {/* RESET */}

          <button
            type="button"
            onClick={resetSearch}
            className="monitoring-reset-button"
          >
            🔄 Reset
          </button>

        </div>

      </div>
            {/* =========================
          MONITORING TABLE
      ========================= */}

      <div className="monitoring-card monitoring-table-card">

        <div className="monitoring-card-header">

          <div>

            <h2>
              📋 Monitoring Records
            </h2>

            <p>
              Current crop field monitoring information.
            </p>

          </div>

          <div className="table-record-count">
            {filteredRecords.length} Records
          </div>

        </div>


        {filteredRecords.length === 0 ? (

          <div className="monitoring-empty-state">

            <div className="monitoring-empty-icon">
              🌱
            </div>

            <h3>
              {records.length === 0
                ? "No Monitoring Records"
                : "No Matching Records"}
            </h3>

            <p>
              {records.length === 0
                ? "Start by adding your first field monitoring record."
                : "Try changing your search or filter options."}
            </p>

            {records.length === 0 && (

              <button
                type="button"
                className="monitoring-empty-button"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  })
                }
              >
                ➕ Add First Record
              </button>

            )}

          </div>

        ) : (

          <div className="monitoring-table-wrapper">

            <table className="monitoring-table">

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
                    Date
                  </th>

                  <th>
                    Height
                  </th>

                  <th>
                    Water
                  </th>

                  <th>
                    Pest
                  </th>

                  <th>
                    Disease
                  </th>

                  <th>
                    Growth
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredRecords.map((item) => (

                  <tr key={item.id}>

                    {/* ID */}

                    <td>

                      <span className="monitoring-id">
                        #{item.id}
                      </span>

                    </td>


                    {/* CROP */}

                    <td>

                      <div className="monitoring-crop-cell">

                        <span className="crop-icon">
                          🌾
                        </span>

                        <span>
                          {item.crop_name || "-"}
                        </span>

                      </div>

                    </td>


                    {/* FIELD */}

                    <td>
                      {item.field_name || "-"}
                    </td>


                    {/* DATE */}

                    <td>

                      {item.monitoring_date
                        ? String(
                            item.monitoring_date
                          ).substring(0, 10)
                        : "-"}

                    </td>


                    {/* HEIGHT */}

                    <td>

                      {item.plant_height !== null &&
                      item.plant_height !== undefined &&
                      item.plant_height !== ""
                        ? `${item.plant_height} cm`
                        : "-"}

                    </td>


                    {/* WATER */}

                    <td>

                      {item.water_level ? (

                        <span
                          className={`monitoring-badge water-${String(
                            item.water_level
                          ).toLowerCase()}`}
                        >
                          {item.water_level}
                        </span>

                      ) : (
                        "-"
                      )}

                    </td>


                    {/* PEST */}

                    <td>

                      {item.pest_status ? (

                        <span
                          className={`monitoring-badge pest-${String(
                            item.pest_status
                          )
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.pest_status}
                        </span>

                      ) : (
                        "-"
                      )}

                    </td>


                    {/* DISEASE */}

                    <td>

                      {item.disease_status ? (

                        <span
                          className={`monitoring-badge disease-${String(
                            item.disease_status
                          )
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.disease_status}
                        </span>

                      ) : (
                        "-"
                      )}

                    </td>


                    {/* GROWTH */}

                    <td>

                      {item.growth_stage ? (

                        <span className="growth-stage-badge">
                          {item.growth_stage}
                        </span>

                      ) : (
                        "-"
                      )}

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="monitoring-action-buttons">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="monitoring-edit-button"
                        >
                          ✏️ Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            deleteRecord(item.id)
                          }
                          className="monitoring-delete-button"
                        >
                          🗑 Delete
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

    </div>
  );
}

export default FieldMonitoring;