import { useEffect, useState } from "react";

function Crops() {
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [editingCropId, setEditingCropId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [crop, setCrop] = useState({
    field_id: "",
    crop_name: "",
    variety: "",
    season: "",
    planting_date: "",
    expected_harvest_date: "",
    status: "Planted",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeason, setFilterSeason] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchFields();
    fetchCrops();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await fetch("http://localhost:5000/fields");
      const data = await response.json();
      setFields(data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  const fetchCrops = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/crops");
      const data = await response.json();

      setCrops(data);
    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCrop((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!crop.field_id) {
      alert("Please select a field.");
      return false;
    }

    if (!crop.crop_name.trim()) {
      alert("Please enter crop name.");
      return false;
    }

    if (crop.crop_name.trim().length < 2) {
      alert("Crop name must contain at least 2 characters.");
      return false;
    }

    if (crop.variety.trim() && crop.variety.trim().length < 2) {
      alert("Variety must contain at least 2 characters.");
      return false;
    }

    if (
      crop.planting_date &&
      crop.expected_harvest_date &&
      crop.expected_harvest_date < crop.planting_date
    ) {
      alert("Expected harvest date cannot be earlier than planting date.");
      return false;
    }

    if (!crop.status) {
      alert("Please select crop status.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setCrop({
      field_id: "",
      crop_name: "",
      variety: "",
      season: "",
      planting_date: "",
      expected_harvest_date: "",
      status: "Planted",
    });

    setEditingCropId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanCrop = {
      field_id: crop.field_id,
      crop_name: crop.crop_name.trim(),
      variety: crop.variety.trim(),
      season: crop.season,
      planting_date: crop.planting_date,
      expected_harvest_date: crop.expected_harvest_date,
      status: crop.status,
    };

    try {
      if (editingCropId) {
        const response = await fetch(
          `http://localhost:5000/crops/${editingCropId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cleanCrop),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update crop");
        }

        alert("Crop updated successfully!");
      } else {
        const response = await fetch("http://localhost:5000/crops", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanCrop),
        });

        if (!response.ok) {
          throw new Error("Failed to add crop");
        }

        alert("Crop added successfully!");
      }

      resetForm();
      fetchCrops();
    } catch (error) {
      console.error("Save crop error:", error);
      alert("Something went wrong while saving the crop.");
    }
  };

  const handleEdit = (cropItem) => {
    setEditingCropId(cropItem.id);

    setCrop({
      field_id: cropItem.field_id || "",
      crop_name: cropItem.crop_name || "",
      variety: cropItem.variety || "",
      season: cropItem.season || "",
      planting_date: cropItem.planting_date
        ? String(cropItem.planting_date).substring(0, 10)
        : "",
      expected_harvest_date: cropItem.expected_harvest_date
        ? String(cropItem.expected_harvest_date).substring(0, 10)
        : "",
      status: cropItem.status || "Planted",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this crop?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/crops/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete crop");
      }

      alert("Crop deleted successfully!");
      fetchCrops();
    } catch (error) {
      console.error("Delete crop error:", error);
      alert("Something went wrong while deleting the crop.");
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterSeason("All");
    setFilterStatus("All");
  };

  const formatDate = (date) =>
    date ? String(date).substring(0, 10) : "-";

  const filteredCrops = crops.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      (item.crop_name || "").toLowerCase().includes(search) ||
      (item.variety || "").toLowerCase().includes(search) ||
      (item.field_name || "").toLowerCase().includes(search) ||
      (item.season || "").toLowerCase().includes(search) ||
      (item.status || "").toLowerCase().includes(search);

    const matchesSeason =
      filterSeason === "All" || item.season === filterSeason;

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesSeason && matchesStatus;
  });

  const activeCrops = crops.filter(
    (item) => item.status === "Planted" || item.status === "Growing"
  ).length;

  const readyCrops = crops.filter(
    (item) => item.status === "Ready"
  ).length;

  const harvestedCrops = crops.filter(
    (item) => item.status === "Harvested"
  ).length;

  const getStatusClass = (status) => {
    if (status === "Planted") return "status-planted";
    if (status === "Growing") return "status-growing";
    if (status === "Ready") return "status-ready";
    if (status === "Harvested") return "status-harvested";

    return "";
  };

  const getSeasonClass = (season) => {
    if (season === "Yala") return "season-yala";
    if (season === "Maha") return "season-maha";

    return "season-other";
  };

  return (
    <div className="crops-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .crops-page {
          min-height: 100vh;
          background: #f4f7f4;
          padding: 28px;
          font-family: Arial, Helvetica, sans-serif;
          color: #1d2b21;
        }

        .page-container {
          max-width: 1450px;
          margin: 0 auto;
        }

        .hero {
          min-height: 130px;
          background: linear-gradient(135deg, #176b3a, #269653);
          color: white;
          border-radius: 22px;
          padding: 26px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
          box-shadow: 0 12px 30px rgba(22, 107, 58, 0.18);
        }

        .hero-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .hero-icon {
          width: 68px;
          height: 68px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          flex-shrink: 0;
        }

        .hero h1 {
          margin: 0 0 7px;
          font-size: 30px;
          font-weight: 800;
        }

        .hero p {
          margin: 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: 14px;
          line-height: 1.5;
        }

        .hero-badge {
          padding: 10px 15px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          white-space: nowrap;
          font-size: 13px;
          font-weight: 700;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .stat-card {
          min-height: 112px;
          background: white;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 7px 22px rgba(0, 0, 0, 0.06);
          border: 1px solid #e7eee8;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          background: #eef8f1;
        }

        .stat-content small {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          color: #6d7c71;
          font-weight: 600;
        }

        .stat-content strong {
          font-size: 28px;
          color: #174b2d;
        }

        .card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border: 1px solid #e4ece6;
          overflow: hidden;
          margin-bottom: 22px;
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #edf1ee;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .card-title {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .card-title-icon {
          width: 42px;
          height: 42px;
          background: #eef8f1;
          color: #19804a;
          border-radius: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 19px;
          color: #173d27;
        }

        .card-header p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #7c8b80;
        }

        .edit-badge {
          padding: 7px 12px;
          border-radius: 20px;
          background: #fff4d8;
          color: #8a5b00;
          font-size: 12px;
          font-weight: 700;
        }

        .form-body {
          padding: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #405446;
        }

        .required {
          color: #d43838;
        }

        .input,
        .select {
          width: 100%;
          min-height: 45px;
          border: 1px solid #d8e2da;
          border-radius: 11px;
          padding: 11px 13px;
          font-size: 14px;
          color: #26382c;
          background: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .input:focus,
        .select:focus {
          border-color: #27a15c;
          box-shadow: 0 0 0 3px rgba(39, 161, 92, 0.1);
        }

        .form-actions {
          margin-top: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .primary-btn,
        .secondary-btn,
        .reset-btn,
        .edit-btn,
        .delete-btn {
          border: none;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .primary-btn {
          min-height: 44px;
          padding: 0 20px;
          border-radius: 11px;
          background: #198c4d;
          color: white;
        }

        .primary-btn:hover {
          background: #12753e;
        }

        .secondary-btn {
          min-height: 44px;
          padding: 0 20px;
          border-radius: 11px;
          background: #edf1ee;
          color: #3d5143;
        }

        .secondary-btn:hover {
          background: #dde5df;
        }

        .filter-body {
          padding: 20px 24px;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 12px;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: 700;
          color: #536458;
        }

        .reset-btn {
          min-height: 45px;
          padding: 0 18px;
          background: #f0f3f1;
          color: #47574c;
          border-radius: 11px;
        }

        .reset-btn:hover {
          background: #e2e7e4;
        }

        .results-bar {
          padding: 14px 24px;
          background: #f9fbf9;
          border-top: 1px solid #edf1ee;
          color: #647168;
          font-size: 13px;
        }

        .results-bar strong {
          color: #198c4d;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1100px;
        }

        thead {
          background: #f3f7f4;
        }

        th {
          padding: 14px 16px;
          text-align: left;
          font-size: 12px;
          color: #536459;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 1px solid #e4ebe6;
        }

        td {
          padding: 15px 16px;
          border-bottom: 1px solid #edf1ee;
          font-size: 13px;
          color: #394b3f;
          vertical-align: middle;
        }

        tbody tr:hover {
          background: #fbfdfb;
        }

        .crop-cell {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .crop-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #edf8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .crop-name {
          font-weight: 800;
          color: #25402f;
        }

        .crop-sub {
          font-size: 11px;
          color: #819086;
          margin-top: 3px;
        }

        .season-badge,
        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 72px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
        }

        .season-yala {
          background: #fff5d8;
          color: #8a6505;
        }

        .season-maha {
          background: #e8f1ff;
          color: #225da8;
        }

        .season-other {
          background: #f0edf7;
          color: #65537e;
        }

        .status-planted {
          background: #e8f7ed;
          color: #1f7b43;
        }

        .status-growing {
          background: #e7f4ff;
          color: #1f68a3;
        }

        .status-ready {
          background: #fff0cd;
          color: #9b6800;
        }

        .status-harvested {
          background: #eee9f8;
          color: #6b4fa0;
        }

        .actions {
          display: flex;
          gap: 7px;
        }

        .edit-btn,
        .delete-btn {
          padding: 7px 11px;
          border-radius: 9px;
          font-size: 12px;
        }

        .edit-btn {
          background: #e9f4ff;
          color: #1f68a3;
        }

        .edit-btn:hover {
          background: #d9ebfa;
        }

        .delete-btn {
          background: #fff0f0;
          color: #c63636;
        }

        .delete-btn:hover {
          background: #fde0e0;
        }

        .empty-state {
          padding: 50px 20px;
          text-align: center;
          color: #738077;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .empty-state h3 {
          margin: 0 0 7px;
          color: #3c5043;
        }

        .empty-state p {
          margin: 0;
          font-size: 13px;
        }

        .loading-container {
          padding: 52px 20px;
          text-align: center;
          color: #607067;
        }

        .spinner {
          width: 36px;
          height: 36px;
          margin: 0 auto 12px;
          border-radius: 50%;
          border: 4px solid #e4ebe6;
          border-top-color: #239453;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1050px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filter-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .crops-page {
            padding: 16px;
          }

          .hero {
            flex-direction: column;
            align-items: flex-start;
            padding: 22px;
          }

          .hero-left {
            align-items: flex-start;
          }

          .hero h1 {
            font-size: 24px;
          }

          .hero-badge {
            align-self: flex-start;
          }

          .stats-grid,
          .form-grid,
          .filter-grid {
            grid-template-columns: 1fr;
          }

          .card-header {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .hero-left {
            flex-direction: column;
          }

          .stat-card {
            min-height: 100px;
          }

          .form-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .primary-btn,
          .secondary-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="page-container">
        <section className="hero">
          <div className="hero-left">
            <div className="hero-icon">🌾</div>

            <div>
              <h1>Crop Management</h1>
              <p>
                Manage crop planting, growing stages, seasons and harvesting
                information efficiently.
              </p>
            </div>
          </div>

          <div className="hero-badge">🌱 Smart Crop Management</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🌾</div>
            <div className="stat-content">
              <small>Total Crops</small>
              <strong>{crops.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <small>Active Crops</small>
              <strong>{activeCrops}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🟡</div>
            <div className="stat-content">
              <small>Ready for Harvest</small>
              <strong>{readyCrops}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧺</div>
            <div className="stat-content">
              <small>Harvested</small>
              <strong>{harvestedCrops}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">
                {editingCropId ? "✏️" : "➕"}
              </div>

              <div>
                <h2>{editingCropId ? "Update Crop" : "Add New Crop"}</h2>
                <p>
                  {editingCropId
                    ? "Edit the selected crop information."
                    : "Enter crop cultivation information below."}
                </p>
              </div>
            </div>

            {editingCropId && (
              <div className="edit-badge">Editing Crop #{editingCropId}</div>
            )}
          </div>

          <form className="form-body" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Field <span className="required">*</span>
                </label>

                <select
                  className="select"
                  name="field_id"
                  value={crop.field_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Field</option>

                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.field_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Crop Name <span className="required">*</span>
                </label>

                <input
                  className="input"
                  type="text"
                  name="crop_name"
                  value={crop.crop_name}
                  onChange={handleChange}
                  placeholder="Example: Paddy"
                  required
                />
              </div>

              <div className="form-group">
                <label>Variety</label>

                <input
                  className="input"
                  type="text"
                  name="variety"
                  value={crop.variety}
                  onChange={handleChange}
                  placeholder="Example: BG 352"
                />
              </div>

              <div className="form-group">
                <label>Season</label>

                <select
                  className="select"
                  name="season"
                  value={crop.season}
                  onChange={handleChange}
                >
                  <option value="">Select Season</option>
                  <option value="Yala">Yala</option>
                  <option value="Maha">Maha</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Planting Date</label>

                <input
                  className="input"
                  type="date"
                  name="planting_date"
                  value={crop.planting_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Expected Harvest Date</label>

                <input
                  className="input"
                  type="date"
                  name="expected_harvest_date"
                  value={crop.expected_harvest_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Status <span className="required">*</span>
                </label>

                <select
                  className="select"
                  name="status"
                  value={crop.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Planted">Planted</option>
                  <option value="Growing">Growing</option>
                  <option value="Ready">Ready for Harvest</option>
                  <option value="Harvested">Harvested</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingCropId ? "💾 Update Crop" : "➕ Add Crop"}
              </button>

              {editingCropId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCancel}
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">🔎</div>

              <div>
                <h2>Search & Filter</h2>
                <p>Find crops quickly using search, season or status.</p>
              </div>
            </div>
          </div>

          <div className="filter-body">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Search</label>

                <input
                  className="input"
                  type="text"
                  placeholder="Search crop, variety, field, season or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Season</label>

                <select
                  className="select"
                  value={filterSeason}
                  onChange={(e) => setFilterSeason(e.target.value)}
                >
                  <option value="All">All Seasons</option>
                  <option value="Yala">Yala</option>
                  <option value="Maha">Maha</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>

                <select
                  className="select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Planted">Planted</option>
                  <option value="Growing">Growing</option>
                  <option value="Ready">Ready for Harvest</option>
                  <option value="Harvested">Harvested</option>
                </select>
              </div>

              <button
                type="button"
                className="reset-btn"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="results-bar">
            Showing <strong>{filteredCrops.length}</strong> of{" "}
            <strong>{crops.length}</strong> crop records
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">📋</div>

              <div>
                <h2>Crop Records</h2>
                <p>View and manage all crop information.</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              Loading crop records...
            </div>
          ) : filteredCrops.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌾</div>
              <h3>No crops found</h3>
              <p>
                Add a new crop or change your search and filter options.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Field</th>
                    <th>Crop</th>
                    <th>Variety</th>
                    <th>Season</th>
                    <th>Planting Date</th>
                    <th>Expected Harvest</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCrops.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>

                      <td>{item.field_name || "-"}</td>

                      <td>
                        <div className="crop-cell">
                          <div className="crop-avatar">🌱</div>

                          <div>
                            <div className="crop-name">
                              {item.crop_name || "-"}
                            </div>

                            <div className="crop-sub">
                              Crop ID: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{item.variety || "-"}</td>

                      <td>
                        <span
                          className={`season-badge ${getSeasonClass(
                            item.season
                          )}`}
                        >
                          {item.season || "Other"}
                        </span>
                      </td>

                      <td>{formatDate(item.planting_date)}</td>

                      <td>{formatDate(item.expected_harvest_date)}</td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status === "Ready"
                            ? "Ready"
                            : item.status || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            className="edit-btn"
                            type="button"
                            onClick={() => handleEdit(item)}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="delete-btn"
                            type="button"
                            onClick={() => handleDelete(item.id)}
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
        </section>
      </div>
    </div>
  );
}

export default Crops;