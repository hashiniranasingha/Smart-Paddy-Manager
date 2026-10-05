import { useEffect, useState } from "react";
import "./Reports.css";

function Reports() {

  const [farmers, setFarmers] = useState([]);
  const [fields, setFields] = useState([]);
  const [crops, setCrops] = useState([]);
  const [cultivations, setCultivations] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [harvests, setHarvests] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD ALL DATA
  // =========================

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {

    try {

      setLoading(true);

      const [
        farmersResponse,
        fieldsResponse,
        cropsResponse,
        cultivationsResponse,
        inputsResponse,
        monitoringResponse,
        expensesResponse,
        harvestsResponse
      ] = await Promise.all([

        fetch("http://localhost:5000/farmers"),

        fetch("http://localhost:5000/fields"),

        fetch("http://localhost:5000/crops"),

        fetch("http://localhost:5000/cultivations"),

        fetch(
          "http://localhost:5000/fertilizer-pesticides"
        ),

        fetch(
          "http://localhost:5000/field-monitoring"
        ),

        fetch(
          "http://localhost:5000/expenses"
        ),

        fetch(
          "http://localhost:5000/harvests"
        )

      ]);

      const farmersData =
        await farmersResponse.json();

      const fieldsData =
        await fieldsResponse.json();

      const cropsData =
        await cropsResponse.json();

      const cultivationsData =
        await cultivationsResponse.json();

      const inputsData =
        await inputsResponse.json();

      const monitoringData =
        await monitoringResponse.json();

      const expensesData =
        await expensesResponse.json();

      const harvestsData =
        await harvestsResponse.json();

      setFarmers(farmersData);
      setFields(fieldsData);
      setCrops(cropsData);
      setCultivations(cultivationsData);
      setInputs(inputsData);
      setMonitoring(monitoringData);
      setExpenses(expensesData);
      setHarvests(harvestsData);

    }

    catch (error) {

      console.log(
        "Reports loading error:",
        error
      );

      alert(
        "Failed to load report data!"
      );

    }

    finally {

      setLoading(false);

    }

  };


  // =========================
  // CALCULATIONS
  // =========================

  const totalExpenses = expenses.reduce(
    (total, item) => {

      return total + Number(
        item.amount || 0
      );

    },
    0
  );


  const totalHarvest = harvests.reduce(
    (total, item) => {

      return total + Number(
        item.quantity || 0
      );

    },
    0
  );


  const totalExpenseRecords =
    expenses.length;

  const totalHarvestRecords =
    harvests.length;


  // =========================
  // PRINT
  // =========================

  const handlePrint = () => {

    window.print();

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="reports-page">

        <div className="reports-loading-card">

          <div className="reports-loading-icon">
            📊
          </div>

          <h2>
            Loading Reports
          </h2>

          <p>
            Preparing your agriculture management report...
          </p>

          <div className="reports-loader"></div>

        </div>

      </div>

    );

  }


  return (

    <div className="reports-page">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="reports-hero">

        <div className="reports-hero-content">

          <div className="reports-eyebrow">
            📊 MANAGEMENT REPORTS
          </div>

          <h1>
            Agriculture Reports
          </h1>

          <p>
            Complete overview of your Paddy Field
            Management System
          </p>

          <div className="reports-hero-badges">

            <span>
              🌾 Smart Agriculture
            </span>

            <span>
              📈 Data Overview
            </span>

            <span>
              🖨 Print Ready
            </span>

          </div>

        </div>


        <div className="reports-hero-action">

          <button
            className="print-report-btn"
            onClick={handlePrint}
          >
            🖨️ Print Report
          </button>

        </div>

      </section>


      {/* =========================
          MAIN SUMMARY
      ========================= */}

      <section className="reports-summary-grid">

        <ReportCard
          icon="👨‍🌾"
          title="Farmers"
          value={farmers.length}
          description="Registered farmers"
          className="farmers-card"
        />

        <ReportCard
          icon="🌾"
          title="Fields"
          value={fields.length}
          description="Managed fields"
          className="fields-card"
        />

        <ReportCard
          icon="🌱"
          title="Crops"
          value={crops.length}
          description="Crop records"
          className="crops-card"
        />

        <ReportCard
          icon="🚜"
          title="Cultivations"
          value={cultivations.length}
          description="Cultivation records"
          className="cultivation-card"
        />

        <ReportCard
          icon="🌿"
          title="Inputs"
          value={inputs.length}
          description="Fertilizer & pesticide"
          className="inputs-card"
        />

        <ReportCard
          icon="📋"
          title="Monitoring"
          value={monitoring.length}
          description="Field monitoring"
          className="monitoring-card"
        />

        <ReportCard
          icon="💰"
          title="Expenses"
          value={totalExpenseRecords}
          description="Expense records"
          className="expenses-card"
        />

        <ReportCard
          icon="🌾"
          title="Harvests"
          value={totalHarvestRecords}
          description="Harvest records"
          className="harvest-card"
        />

      </section>


      {/* =========================
          FINANCIAL SUMMARY
      ========================= */}

      <section className="report-section financial-section">

        <div className="section-heading">

          <div className="section-heading-icon">
            💰
          </div>

          <div>

            <h2>
              Financial & Production Summary
            </h2>

            <p>
              Overall financial and harvest performance
            </p>

          </div>

        </div>


        <div className="financial-summary-grid">

          <div className="financial-card expense-financial-card">

            <div className="financial-card-icon">
              💸
            </div>

            <div>

              <span>
                Total Expenses
              </span>

              <strong>
                LKR{" "}
                {totalExpenses.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )}
              </strong>

              <small>
                Total recorded expenses
              </small>

            </div>

          </div>


          <div className="financial-card harvest-financial-card">

            <div className="financial-card-icon">
              🌾
            </div>

            <div>

              <span>
                Total Harvest
              </span>

              <strong>
                {totalHarvest.toLocaleString()} kg
              </strong>

              <small>
                Total recorded production
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FARMER REPORT
      ========================= */}

      <ReportTableSection
        icon="👨‍🌾"
        title="Farmer Report"
        description="Registered farmer information"
        count={farmers.length}
        className="farmer-report-section"
      >

        <table className="reports-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Farmer Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Village</th>

            </tr>

          </thead>


          <tbody>

            {farmers.map((farmer) => (

              <tr key={farmer.id}>

                <td>
                  <span className="table-id">
                    #{farmer.id}
                  </span>
                </td>

                <td>
                  <strong className="primary-table-text">
                    {farmer.farmer_name}
                  </strong>
                </td>

                <td>
                  {farmer.email || "-"}
                </td>

                <td>
                  {farmer.phone || "-"}
                </td>

                <td>
                  <span className="location-badge">
                    📍 {farmer.village || "-"}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </ReportTableSection>


      {/* =========================
          FIELD REPORT
      ========================= */}

      <ReportTableSection
        icon="🌾"
        title="Field Report"
        description="Field ownership and cultivation information"
        count={fields.length}
        className="field-report-section"
      >

        <table className="reports-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Farmer</th>

              <th>Field</th>

              <th>Area</th>

              <th>Location</th>

              <th>Soil</th>

              <th>Crop</th>

            </tr>

          </thead>


          <tbody>

            {fields.map((field) => (

              <tr key={field.id}>

                <td>
                  <span className="table-id">
                    #{field.id}
                  </span>
                </td>

                <td>
                  <strong className="primary-table-text">
                    {field.farmer_name || "-"}
                  </strong>
                </td>

                <td>
                  {field.field_name || "-"}
                </td>

                <td>
                  <span className="area-badge">
                    📐 {field.area || "-"} acres
                  </span>
                </td>

                <td>
                  <span className="location-badge">
                    📍 {field.location || "-"}
                  </span>
                </td>

                <td>
                  {field.soil_type || "-"}
                </td>

                <td>
                  <span className="crop-badge">
                    🌱 {field.current_crop || "-"}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </ReportTableSection>


      {/* =========================
          CROP REPORT
      ========================= */}

      <ReportTableSection
        icon="🌱"
        title="Crop Report"
        description="Current crop and seasonal information"
        count={crops.length}
        className="crop-report-section"
      >

        <table className="reports-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Field</th>

              <th>Crop</th>

              <th>Variety</th>

              <th>Season</th>

              <th>Status</th>

            </tr>

          </thead>


          <tbody>

            {crops.map((crop) => (

              <tr key={crop.id}>

                <td>
                  <span className="table-id">
                    #{crop.id}
                  </span>
                </td>

                <td>
                  {crop.field_name || "-"}
                </td>

                <td>
                  <strong className="primary-table-text">
                    {crop.crop_name || "-"}
                  </strong>
                </td>

                <td>
                  {crop.variety || "-"}
                </td>

                <td>
                  <span className="season-badge">
                    📅 {crop.season || "-"}
                  </span>
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      String(crop.status || "")
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {crop.status || "-"}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </ReportTableSection>


      
      {/* =========================
          EXPENSE REPORT
      ========================= */}

      <ReportTableSection
        icon="💰"
        title="Expense Report"
        description="Recorded expenses and financial transactions"
        count={expenses.length}
        className="expense-report-section"
      >

        <table className="reports-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Field</th>

              <th>Crop</th>

              <th>Type</th>

              <th>Amount</th>

              <th>Date</th>

            </tr>

          </thead>


          <tbody>

            {expenses.map((expense) => (

              <tr key={expense.id}>

                <td>
                  <span className="table-id">
                    #{expense.id}
                  </span>
                </td>

                <td>
                  <strong className="primary-table-text">
                    {expense.field_name || "-"}
                  </strong>
                </td>

                <td>
                  <span className="crop-badge">
                    🌱 {expense.crop_name || "-"}
                  </span>
                </td>

                <td>
                  <span className="expense-type-badge">
                    {expense.expense_type || "-"}
                  </span>
                </td>

                <td>
                  <strong className="amount-text">
                    LKR{" "}
                    {Number(
                      expense.amount || 0
                    ).toLocaleString()}
                  </strong>
                </td>

                <td>
                  <span className="date-badge">
                    📅 {expense.expense_date || "-"}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </ReportTableSection>


      {/* =========================
          HARVEST REPORT
      ========================= */}

      <ReportTableSection
        icon="🌾"
        title="Harvest Report"
        description="Harvest production and quality information"
        count={harvests.length}
        className="harvest-report-section"
      >

        <table className="reports-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Crop</th>

              <th>Field</th>

              <th>Date</th>

              <th>Quantity</th>

              <th>Quality</th>

              <th>Storage</th>

            </tr>

          </thead>


          <tbody>

            {harvests.map((harvest) => (

              <tr key={harvest.id}>

                <td>
                  <span className="table-id">
                    #{harvest.id}
                  </span>
                </td>

                <td>
                  <strong className="primary-table-text">
                    {harvest.crop_name || "-"}
                  </strong>
                </td>

                <td>
                  {harvest.field_name || "-"}
                </td>

                <td>
                  <span className="date-badge">
                    📅 {harvest.harvest_date || "-"}
                  </span>
                </td>

                <td>
                  <strong className="quantity-text">
                    {harvest.quantity || "-"}{" "}
                    {harvest.unit || ""}
                  </strong>
                </td>

                <td>

                  <span
                    className={`quality-badge ${
                      String(
                        harvest.quality_grade || ""
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {harvest.quality_grade || "-"}
                  </span>

                </td>

                <td>
                  <span className="storage-badge">
                    📦 {harvest.storage_location || "-"}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </ReportTableSection>


      {/* =========================
          FINAL SYSTEM SUMMARY
      ========================= */}

      <section className="final-summary-section">

        <div className="final-summary-header">

          <div className="final-summary-icon">
            📊
          </div>

          <div>

            <h2>
              Final System Summary
            </h2>

            <p>
              Complete overview of your agriculture
              management system
            </p>

          </div>

        </div>


        <div className="final-summary-grid">

          <SummaryItem
            icon="👨‍🌾"
            label="Total Farmers"
            value={farmers.length}
          />

          <SummaryItem
            icon="🌾"
            label="Total Fields"
            value={fields.length}
          />

          <SummaryItem
            icon="🌱"
            label="Total Crops"
            value={crops.length}
          />

          <SummaryItem
            icon="🚜"
            label="Total Cultivations"
            value={cultivations.length}
          />

          <SummaryItem
            icon="🌿"
            label="Fertilizer/Pesticide Records"
            value={inputs.length}
          />

          <SummaryItem
            icon="📋"
            label="Monitoring Records"
            value={monitoring.length}
          />

          <SummaryItem
            icon="💰"
            label="Total Expenses"
            value={`LKR ${totalExpenses.toLocaleString()}`}
          />

          <SummaryItem
            icon="🌾"
            label="Total Harvest"
            value={`${totalHarvest.toLocaleString()} kg`}
          />

        </div>


        <div className="report-generated-info">

          <span>
            📈 Report generated from current system data
          </span>

          <span>
            🌾 Paddy Field Management System
          </span>

        </div>

      </section>


      {/* =========================
          PAGE FOOTER
      ========================= */}

      <div className="reports-page-footer">

        <p>
          🌾 Paddy Field Management System
        </p>

        <span>
          Smart Agriculture • Data Management •
          Production Tracking
        </span>

      </div>

    </div>

  );

}


// =========================
// REPORT CARD
// =========================

function ReportCard({
  icon,
  title,
  value,
  description
}) {

  return (

    <div className="report-summary-card">

      <div className="report-card-top">

        <div className="report-card-icon">
          {icon}
        </div>

        <span className="report-card-arrow">
          ↗
        </span>

      </div>


      <div className="report-card-content">

        <p>
          {title}
        </p>

        <h2>
          {value}
        </h2>

        <span>
          {description}
        </span>

      </div>

    </div>

  );

}


// =========================
// REPORT TABLE SECTION
// =========================

function ReportTableSection({
  icon,
  title,
  description,
  count,
  className = "",
  children
}) {

  return (

    <section
      className={`report-section report-table-section ${className}`}
    >

      <div className="section-heading">

        <div className="section-heading-icon">
          {icon}
        </div>

        <div className="section-heading-content">

          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>

        </div>

        <div className="section-record-count">
          {count} Records
        </div>

      </div>


      <div className="report-table-wrapper">

        {count === 0 ? (

          <div className="report-empty-state">

            <div className="report-empty-icon">
              📋
            </div>

            <h3>
              No Records Available
            </h3>

            <p>
              There are currently no records available
              for this report.
            </p>

          </div>

        ) : (

          children

        )}

      </div>

    </section>

  );

}


// =========================
// SUMMARY ITEM
// =========================

function SummaryItem({
  icon,
  label,
  value
}) {

  return (

    <div className="summary-item">

      <div className="summary-item-icon">
        {icon}
      </div>

      <div className="summary-item-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>

  );

}


export default Reports;