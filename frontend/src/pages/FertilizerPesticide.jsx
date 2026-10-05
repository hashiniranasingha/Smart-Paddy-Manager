import { useEffect, useState } from "react";

function FertilizerPesticide() {

  const [crops, setCrops] = useState([]);
  const [records, setRecords] = useState([]);

  const [editingId, setEditingId] = useState(null);

  // SEARCH & FILTER
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // FORM
  const [form, setForm] = useState({
    crop_id: "",
    input_type: "Fertilizer",
    product_name: "",
    quantity: "",
    unit: "kg",
    application_date: "",
    cost: "",
    notes: ""
  });

  // LOAD DATA
  useEffect(() => {
    fetchCrops();
    fetchRecords();
  }, []);

  // GET CROPS
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

  // GET FERTILIZER / PESTICIDE RECORDS
  const fetchRecords = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/fertilizer-pesticides"
      );

      const data = await response.json();

      setRecords(data);
    } catch (error) {
      console.log(
        "Error fetching fertilizer/pesticide records:",
        error
      );
    }
  };

  // HANDLE FORM CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // FORM VALIDATION
  const validateForm = () => {

    // Crop validation
    if (!form.crop_id) {
      alert("Please select a crop.");
      return false;
    }

    // Product name validation
    const productName =
      form.product_name.trim();

    if (!productName) {
      alert("Please enter the product name.");
      return false;
    }

    if (productName.length < 2) {
      alert(
        "Product name must contain at least 2 characters."
      );
      return false;
    }

    // Quantity validation
    if (form.quantity !== "") {

      const quantity =
        Number(form.quantity);

      if (
        isNaN(quantity) ||
        quantity <= 0
      ) {
        alert(
          "Quantity must be greater than 0."
        );
        return false;
      }
    }

    // Cost validation
    if (form.cost !== "") {

      const cost =
        Number(form.cost);

      if (
        isNaN(cost) ||
        cost < 0
      ) {
        alert(
          "Cost cannot be negative."
        );
        return false;
      }
    }

    // Application date validation
    if (form.application_date) {

      const selectedDate =
        new Date(form.application_date);

      const today = new Date();

      today.setHours(
        23,
        59,
        59,
        999
      );

      if (selectedDate > today) {
        alert(
          "Application date cannot be in the future."
        );
        return false;
      }
    }

    return true;
  };

  // EDIT RECORD
  const handleEdit = (item) => {

    setEditingId(item.id);

    setForm({
      crop_id:
        item.crop_id || "",

      input_type:
        item.input_type ||
        "Fertilizer",

      product_name:
        item.product_name || "",

      quantity:
        item.quantity || "",

      unit:
        item.unit || "kg",

      application_date:
        item.application_date
          ? String(
              item.application_date
            ).substring(0, 10)
          : "",

      cost:
        item.cost || "",

      notes:
        item.notes || ""
    });

    // Scroll to top/form
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // CANCEL EDIT
  const cancelEdit = () => {

    setEditingId(null);

    setForm({
      crop_id: "",
      input_type: "Fertilizer",
      product_name: "",
      quantity: "",
      unit: "kg",
      application_date: "",
      cost: "",
      notes: ""
    });
  };

  // ADD / UPDATE RECORD
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {

      let response;

      // UPDATE
      if (editingId) {

        response = await fetch(
          `http://localhost:5000/fertilizer-pesticides/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify(form)
          }
        );

      } else {

        // ADD
        response = await fetch(
          "http://localhost:5000/fertilizer-pesticides",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify(form)
          }
        );
      }

      const data =
        await response.json();

      if (response.ok) {

        if (editingId) {

          alert(
            "Fertilizer/Pesticide updated successfully! 🌿"
          );

        } else {

          alert(
            "Fertilizer/Pesticide added successfully! 🌿"
          );
        }

        // Reset form
        setForm({
          crop_id: "",
          input_type: "Fertilizer",
          product_name: "",
          quantity: "",
          unit: "kg",
          application_date: "",
          cost: "",
          notes: ""
        });

        setEditingId(null);

        // Refresh records
        fetchRecords();

      } else {

        alert(
          data.message ||
            "Operation failed!"
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Backend connection failed!"
      );
    }
  };
    // DELETE RECORD
  const deleteRecord = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:5000/fertilizer-pesticides/${id}`,
        {
          method: "DELETE"
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          "Fertilizer/Pesticide deleted successfully! 🌿"
        );

        // Refresh records
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


  // FILTER RECORDS
  const filteredRecords = records.filter(
    (item) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const matchesSearch =
        !search ||
        String(
          item.product_name || ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          item.crop_name || ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          item.field_name || ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          item.input_type || ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          item.unit || ""
        )
          .toLowerCase()
          .includes(search) ||

        String(
          item.notes || ""
        )
          .toLowerCase()
          .includes(search);


      const matchesType =
        typeFilter === "All" ||
        item.input_type === typeFilter;


      return (
        matchesSearch &&
        matchesType
      );
    }
  );


  // RESET SEARCH & FILTER
  const resetSearch = () => {

    setSearchTerm("");

    setTypeFilter("All");
  };


  // STATISTICS
  const totalRecords =
    records.length;


  const fertilizerCount =
    records.filter(
      (item) =>
        item.input_type ===
        "Fertilizer"
    ).length;


  const pesticideCount =
    records.filter(
      (item) =>
        item.input_type ===
        "Pesticide"
    ).length;


  const totalCost =
    records.reduce(
      (sum, item) =>
        sum +
        Number(
          item.cost || 0
        ),
      0
    );


  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f1f8f3 0%, #f8fbf8 50%, #eef7f0 100%)",
        padding: "30px"
      }}
    >

      {/* PAGE HEADER */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1b5e20, #2e7d32, #43a047)",
          borderRadius: "18px",
          padding: "30px",
          marginBottom: "25px",
          color: "white",
          boxShadow:
            "0 8px 25px rgba(46,125,50,0.20)"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >

          <div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                opacity: "0.9",
                marginBottom: "8px",
                letterSpacing: "0.5px"
              }}
            >
              🌾 AGRICULTURE MANAGEMENT
            </div>

            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "30px",
                fontWeight: "700"
              }}
            >
              Fertilizer & Pesticide Management
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "15px",
                opacity: "0.92"
              }}
            >
              Manage fertilizer and pesticide
              applications for your crops.
            </p>

          </div>


          <div
            style={{
              backgroundColor:
                "rgba(255,255,255,0.15)",
              border:
                "1px solid rgba(255,255,255,0.25)",
              padding: "12px 18px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            🌱 Smart Farm Inputs
          </div>

        </div>

      </div>


      {/* STATISTICS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "18px",
          marginBottom: "25px"
        }}
      >

        {/* TOTAL */}
        <div
          style={{
            backgroundColor: "white",
            padding: "22px",
            borderRadius: "15px",
            boxShadow:
              "0 5px 18px rgba(0,0,0,0.07)",
            borderLeft:
              "5px solid #2e7d32"
          }}
        >

          <div
            style={{
              fontSize: "28px",
              marginBottom: "8px"
            }}
          >
            🌿
          </div>

          <div
            style={{
              color: "#777",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Total Records
          </div>

          <div
            style={{
              fontSize: "27px",
              fontWeight: "700",
              color: "#1b5e20",
              marginTop: "5px"
            }}
          >
            {totalRecords}
          </div>

        </div>


        {/* FERTILIZER */}
        <div
          style={{
            backgroundColor: "white",
            padding: "22px",
            borderRadius: "15px",
            boxShadow:
              "0 5px 18px rgba(0,0,0,0.07)",
            borderLeft:
              "5px solid #43a047"
          }}
        >

          <div
            style={{
              fontSize: "28px",
              marginBottom: "8px"
            }}
          >
            🧪
          </div>

          <div
            style={{
              color: "#777",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Fertilizers
          </div>

          <div
            style={{
              fontSize: "27px",
              fontWeight: "700",
              color: "#2e7d32",
              marginTop: "5px"
            }}
          >
            {fertilizerCount}
          </div>

        </div>


        {/* PESTICIDE */}
        <div
          style={{
            backgroundColor: "white",
            padding: "22px",
            borderRadius: "15px",
            boxShadow:
              "0 5px 18px rgba(0,0,0,0.07)",
            borderLeft:
              "5px solid #ef6c00"
          }}
        >

          <div
            style={{
              fontSize: "28px",
              marginBottom: "8px"
            }}
          >
            🛡️
          </div>

          <div
            style={{
              color: "#777",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Pesticides
          </div>

          <div
            style={{
              fontSize: "27px",
              fontWeight: "700",
              color: "#ef6c00",
              marginTop: "5px"
            }}
          >
            {pesticideCount}
          </div>

        </div>


        {/* TOTAL COST */}
        <div
          style={{
            backgroundColor: "white",
            padding: "22px",
            borderRadius: "15px",
            boxShadow:
              "0 5px 18px rgba(0,0,0,0.07)",
            borderLeft:
              "5px solid #1565c0"
          }}
        >

          <div
            style={{
              fontSize: "28px",
              marginBottom: "8px"
            }}
          >
            💰
          </div>

          <div
            style={{
              color: "#777",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Total Cost
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#1565c0",
              marginTop: "7px"
            }}
          >
            LKR{" "}
            {totalCost.toLocaleString(
              "en-LK",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }
            )}
          </div>

        </div>

      </div>
            {/* MAIN FORM CARD */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "18px",
          padding: "28px",
          marginBottom: "25px",
          boxShadow:
            "0 6px 22px rgba(0,0,0,0.07)",
          border: "1px solid #e5eee6"
        }}
      >

        {/* FORM HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "25px"
          }}
        >

          <div>

            <h2
              style={{
                margin: "0 0 6px 0",
                color: "#1b5e20",
                fontSize: "22px"
              }}
            >
              {editingId
                ? "✏️ Edit Fertilizer / Pesticide"
                : "➕ Add Fertilizer / Pesticide"}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
                fontSize: "14px"
              }}
            >
              Record crop input applications
              and related expenses.
            </p>

          </div>


          {editingId && (
            <div
              style={{
                backgroundColor: "#fff8e1",
                color: "#f57f17",
                padding: "8px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "700"
              }}
            >
              ✏️ Editing Record #{editingId}
            </div>
          )}

        </div>


        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* FORM GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px"
            }}
          >

            {/* CROP */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                🌾 Crop
              </label>

              <select
                name="crop_id"
                value={form.crop_id}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d6ddd7",
                  borderRadius: "9px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#fff"
                }}
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


            {/* TYPE */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                🧪 Input Type
              </label>

              <select
                name="input_type"
                value={form.input_type}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d6ddd7",
                  borderRadius: "9px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#fff"
                }}
              >

                <option value="Fertilizer">
                  Fertilizer
                </option>

                <option value="Pesticide">
                  Pesticide
                </option>

              </select>

            </div>


            {/* PRODUCT NAME */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                📦 Product Name
              </label>

              <input
                type="text"
                name="product_name"
                placeholder="Enter product name"
                value={form.product_name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d6ddd7",
                  borderRadius: "9px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />

            </div>


            {/* QUANTITY */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                ⚖️ Quantity
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="quantity"
                placeholder="Enter quantity"
                value={form.quantity}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d6ddd7",
                  borderRadius: "9px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />

            </div>


            {/* UNIT */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                📏 Unit
              </label>

              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d6ddd7",
                  borderRadius: "9px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#fff"
                }}
              >

                <option value="kg">
                  Kilograms (kg)
                </option>

                <option value="g">
                  Grams (g)
                </option>

                <option value="L">
                  Litres (L)
                </option>

                <option value="ml">
                  Millilitres (ml)
                </option>

              </select>

            </div>


            {/* APPLICATION DATE */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                📅 Application Date
              </label>

              <input
                type="date"
                name="application_date"
                value={form.application_date}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d6ddd7",
                  borderRadius: "9px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />

            </div>


            {/* COST */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                💰 Cost (LKR)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="cost"
                placeholder="Enter cost"
                value={form.cost}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d6ddd7",
                  borderRadius: "9px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />

            </div>

          </div>


          {/* NOTES */}
          <div
            style={{
              marginTop: "20px"
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333"
              }}
            >
              📝 Notes
            </label>

            <textarea
              name="notes"
              placeholder="Add any additional information..."
              value={form.notes}
              onChange={handleChange}
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d6ddd7",
                borderRadius: "9px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            ></textarea>

          </div>


          {/* FORM BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "22px",
              flexWrap: "wrap"
            }}
          >

            <button
              type="submit"
              style={{
                background:
                  "linear-gradient(135deg, #2e7d32, #43a047)",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "9px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                boxShadow:
                  "0 4px 10px rgba(46,125,50,0.20)"
              }}
            >
              {editingId
                ? "💾 Update Record"
                : "💾 Save Record"}
            </button>


            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                style={{
                  backgroundColor: "#757575",
                  color: "white",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "9px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600"
                }}
              >
                ✖ Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* SEARCH & FILTER */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "18px",
          padding: "25px",
          marginBottom: "25px",
          boxShadow:
            "0 6px 22px rgba(0,0,0,0.07)",
          border: "1px solid #e5eee6"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "18px"
          }}
        >

          <div>

            <h2
              style={{
                margin: "0 0 5px 0",
                color: "#1b5e20",
                fontSize: "20px"
              }}
            >
              🔎 Search & Filter
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
                fontSize: "13px"
              }}
            >
              Quickly find fertilizer and
              pesticide records.
            </p>

          </div>

          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              padding: "8px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "700"
            }}
          >
            {filteredRecords.length} Results
          </div>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(250px, 1fr) 200px auto",
            gap: "12px",
            alignItems: "center"
          }}
        >

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search product, crop, field..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px 14px",
              border:
                "1px solid #d6ddd7",
              borderRadius: "9px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box"
            }}
          />


          {/* TYPE FILTER */}
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              border:
                "1px solid #d6ddd7",
              borderRadius: "9px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "white",
              boxSizing: "border-box"
            }}
          >

            <option value="All">
              All Types
            </option>

            <option value="Fertilizer">
              Fertilizer
            </option>

            <option value="Pesticide">
              Pesticide
            </option>

          </select>


          {/* RESET */}
          <button
            type="button"
            onClick={resetSearch}
            style={{
              backgroundColor: "#607d8b",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              whiteSpace: "nowrap"
            }}
          >
            🔄 Reset
          </button>

        </div>


        <div
          style={{
            marginTop: "15px",
            paddingTop: "14px",
            borderTop:
              "1px solid #edf1ed",
            color: "#666",
            fontSize: "13px"
          }}
        >
          Showing{" "}
          <strong
            style={{
              color: "#2e7d32"
            }}
          >
            {filteredRecords.length}
          </strong>{" "}
          of{" "}
          <strong>
            {records.length}
          </strong>{" "}
          fertilizer/pesticide records
        </div>

      </div>


      {/* RECORDS TABLE */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "18px",
          padding: "25px",
          boxShadow:
            "0 6px 22px rgba(0,0,0,0.07)",
          border: "1px solid #e5eee6",
          overflowX: "auto"
        }}
      >

        {/* TABLE HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "20px"
          }}
        >

          <div>

            <h2
              style={{
                margin: "0 0 5px 0",
                color: "#1b5e20",
                fontSize: "21px"
              }}
            >
              🌿 Fertilizer & Pesticide Records
            </h2>

            <p
              style={{
                margin: 0,
                color: "#777",
                fontSize: "13px"
              }}
            >
              Application history and cost details
            </p>

          </div>

          <div
            style={{
              backgroundColor: "#f1f8f3",
              color: "#2e7d32",
              padding: "9px 14px",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: "700"
            }}
          >
            📋 {filteredRecords.length} Records
          </div>

        </div>


        {/* EMPTY STATE */}
        {filteredRecords.length === 0 ? (

          <div
            style={{
              textAlign: "center",
              padding: "55px 20px",
              backgroundColor: "#f8fbf8",
              borderRadius: "14px",
              border:
                "1px dashed #c8d8ca"
            }}
          >

            <div
              style={{
                fontSize: "50px",
                marginBottom: "12px"
              }}
            >
              🌱
            </div>

            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#333"
              }}
            >
              {records.length === 0
                ? "No Records Found"
                : "No Matching Records"}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#777",
                fontSize: "14px"
              }}
            >
              {records.length === 0
                ? "Start by adding your first fertilizer or pesticide record."
                : "Try changing your search term or filter."}
            </p>

          </div>

        ) : (

          /* TABLE */
          <table
            style={{
              width: "100%",
              minWidth: "1050px",
              borderCollapse: "separate",
              borderSpacing: "0",
              overflow: "hidden"
            }}
          >

            <thead>

              <tr>

                <th style={thStyle}>
                  ID
                </th>

                <th style={thStyle}>
                  Crop
                </th>

                <th style={thStyle}>
                  Field
                </th>

                <th style={thStyle}>
                  Type
                </th>

                <th style={thStyle}>
                  Product
                </th>

                <th style={thStyle}>
                  Quantity
                </th>

                <th style={thStyle}>
                  Date
                </th>

                <th style={thStyle}>
                  Cost
                </th>

                <th style={thStyle}>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredRecords.map(
                (item) => (

                  <tr
                    key={item.id}
                  >

                    {/* ID */}
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontWeight: "700",
                          color: "#555"
                        }}
                      >
                        #{item.id}
                      </span>
                    </td>


                    {/* CROP */}
                    <td style={tdStyle}>

                      <div
                        style={{
                          fontWeight: "600",
                          color: "#333"
                        }}
                      >
                        {item.crop_name ||
                          "-"}
                      </div>

                    </td>


                    {/* FIELD */}
                    <td style={tdStyle}>

                      <span
                        style={{
                          color: "#666"
                        }}
                      >
                        📍{" "}
                        {item.field_name ||
                          "-"}
                      </span>

                    </td>


                    {/* TYPE */}
                    <td style={tdStyle}>

                      <span
                        style={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: "5px",
                          padding:
                            "6px 11px",
                          borderRadius:
                            "20px",
                          backgroundColor:
                            item.input_type ===
                            "Pesticide"
                              ? "#fff3e0"
                              : "#e8f5e9",
                          color:
                            item.input_type ===
                            "Pesticide"
                              ? "#e65100"
                              : "#2e7d32",
                          fontWeight: "700",
                          fontSize: "12px"
                        }}
                      >

                        {item.input_type ===
                        "Pesticide"
                          ? "🛡️"
                          : "🌿"}

                        {item.input_type ||
                          "-"}

                      </span>

                    </td>


                    {/* PRODUCT */}
                    <td style={tdStyle}>

                      <div
                        style={{
                          fontWeight: "600",
                          color: "#333"
                        }}
                      >
                        {item.product_name ||
                          "-"}
                      </div>

                    </td>


                    {/* QUANTITY */}
                    <td style={tdStyle}>

                      {item.quantity ? (

                        <span
                          style={{
                            fontWeight: "600"
                          }}
                        >
                          {item.quantity}{" "}
                          {item.unit || ""}
                        </span>

                      ) : (
                        <span
                          style={{
                            color: "#999"
                          }}
                        >
                          -
                        </span>
                      )}

                    </td>


                    {/* DATE */}
                    <td style={tdStyle}>

                      {item.application_date
                        ? String(
                            item.application_date
                          ).substring(
                            0,
                            10
                          )
                        : "-"}

                    </td>


                    {/* COST */}
                    <td style={tdStyle}>

                      {item.cost !==
                        null &&
                      item.cost !==
                        undefined &&
                      item.cost !== "" ? (

                        <span
                          style={{
                            fontWeight: "700",
                            color: "#1565c0"
                          }}
                        >
                          LKR{" "}
                          {Number(
                            item.cost
                          ).toLocaleString(
                            "en-LK",
                            {
                              minimumFractionDigits:
                                2,
                              maximumFractionDigits:
                                2
                            }
                          )}
                        </span>

                      ) : (

                        <span
                          style={{
                            color: "#999"
                          }}
                        >
                          -
                        </span>

                      )}

                    </td>


                    {/* ACTIONS */}
                    <td style={tdStyle}>

                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          flexWrap: "wrap"
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          style={{
                            backgroundColor:
                              "#1976d2",
                            color: "white",
                            border: "none",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "7px",
                            cursor:
                              "pointer",
                            fontSize:
                              "12px",
                            fontWeight:
                              "600"
                          }}
                        >
                          ✏️ Edit
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            deleteRecord(
                              item.id
                            )
                          }
                          style={{
                            backgroundColor:
                              "#d32f2f",
                            color: "white",
                            border: "none",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "7px",
                            cursor:
                              "pointer",
                            fontSize:
                              "12px",
                            fontWeight:
                              "600"
                          }}
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>


      {/* FOOTER INFO */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#78907b",
          fontSize: "12px"
        }}
      >
        🌾 Paddy Field Management System
        {" • "}
        Fertilizer & Pesticide Module
      </div>

    </div>
  );
}


// TABLE HEADER STYLE
const thStyle = {
  padding: "14px 12px",
  backgroundColor: "#eef6ef",
  color: "#1b5e20",
  fontSize: "13px",
  fontWeight: "700",
  textAlign: "left",
  borderBottom:
    "2px solid #d5e5d7",
  whiteSpace: "nowrap"
};


// TABLE DATA STYLE
const tdStyle = {
  padding: "13px 12px",
  borderBottom:
    "1px solid #edf1ed",
  fontSize: "13px",
  color: "#444",
  verticalAlign: "middle"
};


export default FertilizerPesticide;