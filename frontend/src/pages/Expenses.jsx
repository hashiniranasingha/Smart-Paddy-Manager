import { useEffect, useState } from "react";
import "./Expenses.css";

function Expenses() {
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [editingId, setEditingId] = useState(null);

  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // =========================
  // FORM
  // =========================

  const [form, setForm] = useState({
    field_id: "",
    crop_id: "",
    expense_type: "Fertilizer",
    description: "",
    amount: "",
    expense_date: "",
    payment_method: "Cash",
    notes: ""
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchFields();
    fetchCrops();
    fetchExpenses();
  }, []);

  // =========================
  // GET FIELDS
  // =========================

  const fetchFields = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/fields"
      );

      const data = await response.json();

      setFields(data);
    } catch (error) {
      console.log("Error fetching fields:", error);
    }
  };

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
      console.log("Error fetching crops:", error);
    }
  };

  // =========================
  // GET EXPENSES
  // =========================

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/expenses"
      );

      const data = await response.json();

      setExpenses(data);
    } catch (error) {
      console.log("Error fetching expenses:", error);
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
    if (!form.field_id) {
      alert("Please select a field.");
      return false;
    }

    if (!form.expense_type) {
      alert("Please select an expense type.");
      return false;
    }

    if (!form.amount) {
      alert("Please enter the expense amount.");
      return false;
    }

    const amount = Number(form.amount);

    if (isNaN(amount) || amount < 0) {
      alert("Amount must be 0 or greater.");
      return false;
    }

    if (!form.expense_date) {
      alert("Please select an expense date.");
      return false;
    }

    // Prevent future dates
    const selectedDate = new Date(
      form.expense_date + "T23:59:59"
    );

    const today = new Date();

    if (selectedDate > today) {
      alert("Expense date cannot be in the future.");
      return false;
    }

    if (form.description.trim().length > 200) {
      alert("Description cannot exceed 200 characters.");
      return false;
    }

    if (form.notes.trim().length > 500) {
      alert("Notes cannot exceed 500 characters.");
      return false;
    }

    return true;
  };

  // =========================
  // EDIT EXPENSE
  // =========================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      field_id: item.field_id || "",
      crop_id: item.crop_id || "",
      expense_type:
        item.expense_type || "Fertilizer",
      description:
        item.description || "",
      amount:
        item.amount || "",
      expense_date:
        item.expense_date
          ? String(item.expense_date).substring(0, 10)
          : "",
      payment_method:
        item.payment_method || "Cash",
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
      field_id: "",
      crop_id: "",
      expense_type: "Fertilizer",
      description: "",
      amount: "",
      expense_date: "",
      payment_method: "Cash",
      notes: ""
    });
  };

  // =========================
  // ADD / UPDATE EXPENSE
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
          `http://localhost:5000/expenses/${editingId}`,
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
          "http://localhost:5000/expenses",
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
          alert("Expense updated successfully! 💰");
        } else {
          alert("Expense added successfully! 💰");
        }

        setForm({
          field_id: "",
          crop_id: "",
          expense_type: "Fertilizer",
          description: "",
          amount: "",
          expense_date: "",
          payment_method: "Cash",
          notes: ""
        });

        setEditingId(null);

        fetchExpenses();
      } else {
        alert(
          data.message ||
            "Expense operation failed!"
        );
      }
    } catch (error) {
      console.log(error);

      alert("Backend connection failed!");
    }
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/expenses/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Expense deleted successfully! 💰");

        fetchExpenses();
      } else {
        alert(
          data.message ||
            "Expense delete failed!"
        );
      }
    } catch (error) {
      console.log(error);

      alert("Backend connection failed!");
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredExpenses = expenses.filter(
    (item) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(item.field_name || "")
          .toLowerCase()
          .includes(search) ||
        String(item.crop_name || "")
          .toLowerCase()
          .includes(search) ||
        String(item.expense_type || "")
          .toLowerCase()
          .includes(search) ||
        String(item.description || "")
          .toLowerCase()
          .includes(search) ||
        String(item.amount || "")
          .toLowerCase()
          .includes(search) ||
        String(item.expense_date || "")
          .toLowerCase()
          .includes(search) ||
        String(item.payment_method || "")
          .toLowerCase()
          .includes(search) ||
        String(item.notes || "")
          .toLowerCase()
          .includes(search);

      const matchesType =
        typeFilter === "All" ||
        item.expense_type === typeFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        item.payment_method === paymentFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesPayment
      );
    }
  );

  // =========================
  // RESET SEARCH
  // =========================

  const resetSearch = () => {
    setSearchTerm("");
    setTypeFilter("All");
    setPaymentFilter("All");
  };

  // =========================
  // TOTAL EXPENSE
  // =========================

  const totalExpense = expenses.reduce(
    (total, item) => {
      return (
        total + Number(item.amount || 0)
      );
    },
    0
  );

  // =========================
  // FILTERED TOTAL
  // =========================

  const filteredTotal =
    filteredExpenses.reduce(
      (total, item) => {
        return (
          total + Number(item.amount || 0)
        );
      },
      0
    );

  // =========================
  // EXPENSE TYPE COUNT
  // =========================

  const fertilizerCount = expenses.filter(
    (item) =>
      item.expense_type === "Fertilizer"
  ).length;

  const pesticideCount = expenses.filter(
    (item) =>
      item.expense_type === "Pesticide"
  ).length;

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="expenses-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="expenses-hero">

        <div className="expenses-hero-content">

          <div className="expenses-hero-icon">
            💰
          </div>

          <div>
            <span className="expenses-eyebrow">
              FINANCIAL MANAGEMENT
            </span>

            <h1>
              Expense Management
            </h1>

            <p>
              Track and manage field and
              crop-related expenses efficiently.
            </p>
          </div>

        </div>

        <div className="expenses-hero-badge">
          🌾 Smart Agriculture
        </div>

      </section>

      {/* =========================
          STATISTICS
      ========================= */}

      <section className="expense-stats">

        <div className="expense-stat-card total-card">

          <div className="expense-stat-icon">
            💰
          </div>

          <div>
            <span className="expense-stat-label">
              Total Expenses
            </span>

            <h2>
              LKR {totalExpense.toFixed(2)}
            </h2>

            <small>
              All expense records
            </small>
          </div>

        </div>

        <div className="expense-stat-card filtered-card">

          <div className="expense-stat-icon">
            📊
          </div>

          <div>
            <span className="expense-stat-label">
              Filtered Total
            </span>

            <h2>
              LKR {filteredTotal.toFixed(2)}
            </h2>

            <small>
              Current search & filters
            </small>
          </div>

        </div>

        <div className="expense-stat-card records-card">

          <div className="expense-stat-icon">
            🧾
          </div>

          <div>
            <span className="expense-stat-label">
              Expense Records
            </span>

            <h2>
              {expenses.length}
            </h2>

            <small>
              Total recorded expenses
            </small>
          </div>

        </div>

        <div className="expense-stat-card category-card">

          <div className="expense-stat-icon">
            🌱
          </div>

          <div>
            <span className="expense-stat-label">
              Main Categories
            </span>

            <h2>
              {fertilizerCount +
                pesticideCount}
            </h2>

            <small>
              Fertilizer & pesticide records
            </small>
          </div>

        </div>

      </section>

      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      <section className="expense-form-card">

        <div className="section-heading">

          <div className="section-heading-icon">
            {editingId ? "✏️" : "➕"}
          </div>

          <div>
            <h2>
              {editingId
                ? "Edit Expense"
                : "Add New Expense"}
            </h2>

            <p>
              {editingId
                ? "Update the selected expense record."
                : "Enter expense details for your field or crop."}
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="expense-form"
        >

          {/* FIELD */}

          <div className="form-group">

            <label htmlFor="field_id">
              Field
              <span className="required-mark">
                *
              </span>
            </label>

            <select
              id="field_id"
              name="field_id"
              value={form.field_id}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Field
              </option>

              {fields.map((field) => (
                <option
                  key={field.id}
                  value={field.id}
                >
                  {field.field_name}
                </option>
              ))}

            </select>

          </div>

          {/* CROP */}

          <div className="form-group">

            <label htmlFor="crop_id">
              Crop
            </label>

            <select
              id="crop_id"
              name="crop_id"
              value={form.crop_id}
              onChange={handleChange}
            >
              <option value="">
                No specific crop
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

          {/* EXPENSE TYPE */}

          <div className="form-group">

            <label htmlFor="expense_type">
              Expense Type
              <span className="required-mark">
                *
              </span>
            </label>

            <select
              id="expense_type"
              name="expense_type"
              value={form.expense_type}
              onChange={handleChange}
              required
            >
              <option value="Fertilizer">
                Fertilizer
              </option>

              <option value="Pesticide">
                Pesticide
              </option>

              <option value="Seeds">
                Seeds
              </option>

              <option value="Labour">
                Labour
              </option>

              <option value="Water">
                Water
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Equipment">
                Equipment
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <input
              id="description"
              type="text"
              name="description"
              placeholder="Example: Urea fertilizer"
              value={form.description}
              onChange={handleChange}
              maxLength="200"
            />

            <span className="field-hint">
              Maximum 200 characters
            </span>

          </div>

          {/* AMOUNT */}

          <div className="form-group">

            <label htmlFor="amount">
              Amount (LKR)
              <span className="required-mark">
                *
              </span>
            </label>

            <div className="amount-input-wrapper">

              <span className="currency-prefix">
                LKR
              </span>

              <input
                id="amount"
                type="number"
                step="0.01"
                name="amount"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                required
                min="0"
              />

            </div>

          </div>

          {/* DATE */}

          <div className="form-group">

            <label htmlFor="expense_date">
              Expense Date
              <span className="required-mark">
                *
              </span>
            </label>

            <input
              id="expense_date"
              type="date"
              name="expense_date"
              value={form.expense_date}
              onChange={handleChange}
              required
            />

          </div>

          {/* PAYMENT */}

          <div className="form-group">

            <label htmlFor="payment_method">
              Payment Method
            </label>

            <select
              id="payment_method"
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
            >
              <option value="Cash">
                Cash
              </option>

              <option value="Bank Transfer">
                Bank Transfer
              </option>

              <option value="Card">
                Card
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          {/* NOTES */}

          <div className="form-group form-group-full">

            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              placeholder="Add any additional information..."
              value={form.notes}
              onChange={handleChange}
              rows="4"
              maxLength="500"
            ></textarea>

            <span className="field-hint">
              Maximum 500 characters
            </span>

          </div>

          {/* BUTTONS */}

          <div className="expense-form-actions">

            <button
              type="submit"
              className="expense-primary-btn"
            >
              {editingId
                ? "💾 Update Expense"
                : "💾 Save Expense"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="expense-cancel-btn"
              >
                ✕ Cancel Edit
              </button>
            )}

          </div>

        </form>

      </section>

            {/* =========================
          SEARCH & FILTER
      ========================= */}

      <section className="expense-filter-card">

        <div className="section-heading">

          <div className="section-heading-icon">
            🔍
          </div>

          <div>
            <h2>
              Search & Filter Expenses
            </h2>

            <p>
              Find expense records quickly using
              search and filters.
            </p>
          </div>

        </div>

        <div className="expense-filter-controls">

          {/* SEARCH */}

          <div className="expense-search-wrapper">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by field, crop, type, amount..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

          {/* TYPE FILTER */}

          <select
            className="expense-filter-select"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="All">
              All Expense Types
            </option>

            <option value="Fertilizer">
              Fertilizer
            </option>

            <option value="Pesticide">
              Pesticide
            </option>

            <option value="Seeds">
              Seeds
            </option>

            <option value="Labour">
              Labour
            </option>

            <option value="Water">
              Water
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Equipment">
              Equipment
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* PAYMENT FILTER */}

          <select
            className="expense-filter-select"
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value)
            }
          >
            <option value="All">
              All Payment Methods
            </option>

            <option value="Cash">
              Cash
            </option>

            <option value="Bank Transfer">
              Bank Transfer
            </option>

            <option value="Card">
              Card
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {/* RESET */}

          <button
            type="button"
            onClick={resetSearch}
            className="expense-reset-btn"
          >
            🔄 Reset
          </button>

        </div>

        {/* FILTER SUMMARY */}

        <div className="expense-filter-summary">

          <div className="filter-result-icon">
            📋
          </div>

          <div>
            <strong>
              Showing {filteredExpenses.length}
            </strong>

            <span>
              {" "}of {expenses.length} expense records
            </span>
          </div>

        </div>

      </section>

      {/* =========================
          EXPENSE RECORDS
      ========================= */}

      <section className="expense-table-card">

        <div className="table-header">

          <div className="section-heading table-heading">

            <div className="section-heading-icon">
              💰
            </div>

            <div>
              <h2>
                Expense Records
              </h2>

              <p>
                View, edit and manage all expense
                transactions.
              </p>
            </div>

          </div>

          <div className="table-record-count">
            {filteredExpenses.length} Records
          </div>

        </div>

        {filteredExpenses.length === 0 ? (

          /* =========================
             EMPTY STATE
          ========================= */

          <div className="expense-empty-state">

            <div className="empty-state-icon">
              🧾
            </div>

            <h3>
              No Expense Records Found
            </h3>

            <p>
              No expense records match your
              current search or filter settings.
            </p>

            {(searchTerm ||
              typeFilter !== "All" ||
              paymentFilter !== "All") && (
              <button
                type="button"
                onClick={resetSearch}
                className="empty-reset-btn"
              >
                🔄 Clear Filters
              </button>
            )}

          </div>

        ) : (

          /* =========================
             RESPONSIVE TABLE
          ========================= */

          <div className="expense-table-wrapper">

            <table className="expense-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Field
                  </th>

                  <th>
                    Crop
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredExpenses.map((item) => (

                  <tr
                    key={item.id}
                    className={
                      editingId === item.id
                        ? "editing-row"
                        : ""
                    }
                  >

                    {/* ID */}

                    <td>

                      <span className="expense-id">
                        #{item.id}
                      </span>

                    </td>

                    {/* FIELD */}

                    <td>

                      <div className="field-cell">

                        <span className="cell-icon">
                          🌾
                        </span>

                        <span>
                          {item.field_name || "-"}
                        </span>

                      </div>

                    </td>

                    {/* CROP */}

                    <td>

                      {item.crop_name ? (

                        <span className="crop-badge">
                          🌱 {item.crop_name}
                        </span>

                      ) : (

                        <span className="muted-text">
                          No crop
                        </span>

                      )}

                    </td>

                    {/* TYPE */}

                    <td>

                      <span
                        className={`expense-type-badge ${String(
                          item.expense_type || "Other"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {item.expense_type || "-"}
                      </span>

                    </td>

                    {/* DESCRIPTION */}

                    <td>

                      <div className="description-cell">

                        {item.description || "-"}

                      </div>

                    </td>

                    {/* AMOUNT */}

                    <td>

                      <strong className="amount-cell">

                        LKR{" "}
                        {Number(
                          item.amount || 0
                        ).toFixed(2)}

                      </strong>

                    </td>

                    {/* DATE */}

                    <td>

                      <span className="date-cell">

                        📅{" "}
                        {item.expense_date || "-"}

                      </span>

                    </td>

                    {/* PAYMENT */}

                    <td>

                      <span
                        className={`payment-badge ${String(
                          item.payment_method || "Other"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {item.payment_method ===
                        "Cash"
                          ? "💵"
                          : item.payment_method ===
                            "Card"
                          ? "💳"
                          : item.payment_method ===
                            "Bank Transfer"
                          ? "🏦"
                          : "💰"}{" "}
                        {item.payment_method || "-"}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="expense-actions">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="expense-edit-btn"
                        >
                          ✏️
                          <span>
                            Edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteExpense(item.id)
                          }
                          className="expense-delete-btn"
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
          FOOTER INFORMATION
      ========================= */}

      <div className="expenses-footer">

        <div>
          <span className="footer-icon">
            💡
          </span>

          <span>
            Keep your expense records updated
            for accurate farm cost tracking.
          </span>
        </div>

        <span>
          Paddy Field Management System
        </span>

      </div>

    </div>
  );
}

export default Expenses;