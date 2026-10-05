import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    farmers: 0,
    fields: 0,
    crops: 0,
    cultivations: 0,
    fertilizerPesticides: 0,
    monitoring: 0,
    expenses: 0,
    harvest: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD REAL DATABASE DATA
  // ==========================================

  const fetchDashboardStats = async () => {
    try {
      setError("");

      const response = await fetch(
        "http://localhost:5000/dashboard/stats"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load dashboard statistics."
        );
      }

      setStats({
        farmers: Number(data.farmers) || 0,
        fields: Number(data.fields) || 0,
        crops: Number(data.crops) || 0,
        cultivations: Number(data.cultivations) || 0,
        fertilizerPesticides:
          Number(data.fertilizerPesticides) || 0,
        monitoring: Number(data.monitoring) || 0,
        expenses: Number(data.expenses) || 0,
        harvest: Number(data.harvest) || 0,
      });
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        "Unable to load dashboard statistics. Please check that the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE LOAD
  // ==========================================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ==========================================
  // REFRESH DATA
  // ==========================================

  const handleRefresh = () => {
    setLoading(true);
    fetchDashboardStats();
  };

  // ==========================================
  // STAT CARD DATA
  // ==========================================

  const statCards = [
    {
      title: "Total Farmers",
      value: stats.farmers.toLocaleString(),
      icon: "👨‍🌾",
      link: "/farmers",
      description: "Registered farmers",
    },
    {
      title: "Total Fields",
      value: stats.fields.toLocaleString(),
      icon: "🌱",
      link: "/fields",
      description: "Managed agricultural fields",
    },
    {
      title: "Total Crops",
      value: stats.crops.toLocaleString(),
      icon: "🌾",
      link: "/crops",
      description: "Crop records",
    },
    {
      title: "Cultivations",
      value: stats.cultivations.toLocaleString(),
      icon: "🚜",
      link: "/cultivation",
      description: "Cultivation activities",
    },
    {
      title: "Fertilizer & Pesticide",
      value: stats.fertilizerPesticides.toLocaleString(),
      icon: "🧪",
      link: "/fertilizer-pesticide",
      description: "Application records",
    },
    {
      title: "Monitoring Records",
      value: stats.monitoring.toLocaleString(),
      icon: "🔍",
      link: "/field-monitoring",
      description: "Field monitoring records",
    },
    {
      title: "Total Expenses",
      value: `LKR ${stats.expenses.toLocaleString()}`,
      icon: "💰",
      link: "/expenses",
      description: "Recorded agricultural expenses",
    },
    {
      title: "Total Harvest",
      value: `${stats.harvest.toLocaleString()} kg`,
      icon: "🌾",
      link: "/harvest",
      description: "Recorded harvest quantity",
    },
  ];

  // ==========================================
  // QUICK ACTION DATA
  // ==========================================

  const quickActions = [
    {
      title: "Manage Farmers",
      description: "Add and manage farmer records",
      icon: "👨‍🌾",
      link: "/farmers",
    },
    {
      title: "Manage Fields",
      description: "Manage agricultural fields",
      icon: "🌱",
      link: "/fields",
    },
    {
      title: "Cultivation",
      description: "Manage cultivation activities",
      icon: "🚜",
      link: "/cultivation",
    },
    {
      title: "Harvest",
      description: "Manage harvest records",
      icon: "🌾",
      link: "/harvest",
    },
    {
      title: "Expenses",
      description: "Track agricultural expenses",
      icon: "💰",
      link: "/expenses",
    },
    {
      title: "Reports",
      description: "View system reports",
      icon: "📑",
      link: "/reports",
    },
  ];

  return (
    <>
      <div className="dashboard-page">

        {/* =====================================
            HERO SECTION
        ===================================== */}

        <section className="dashboard-hero">

          <div className="dashboard-hero-pattern"></div>

          <div className="dashboard-hero-content">

            <div className="dashboard-title-area">

              <div className="dashboard-badge">
                <span>🌾</span>
                Smart Agriculture Management
              </div>

              <h1>
                Paddy Field
                <span> Dashboard</span>
              </h1>

              <p>
                Monitor, manage and analyze your complete
                agricultural operations from one intelligent
                dashboard.
              </p>

              <div className="hero-highlights">

                <div className="hero-highlight">
                  <span>✓</span>
                  Live Database
                </div>

                <div className="hero-highlight">
                  <span>✓</span>
                  Real-time Statistics
                </div>

                <div className="hero-highlight">
                  <span>✓</span>
                  Smart Management
                </div>

              </div>

            </div>

            <div className="dashboard-hero-action">

              <div className="hero-status-card">

                <div className="hero-status-icon">
                  🌿
                </div>

                <div>
                  <span>System Status</span>
                  <strong>Active & Connected</strong>
                </div>

              </div>

              <button
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={loading}
              >
                <span className={loading ? "refresh-icon spinning" : "refresh-icon"}>
                  🔄
                </span>

                {loading
                  ? "Loading..."
                  : "Refresh Data"}
              </button>

            </div>

          </div>

          <div className="live-status">

            <span className="status-dot"></span>

            <span>
              Live database statistics
            </span>

            <span className="status-divider">
              •
            </span>

            <span>
              MySQL Connected
            </span>

          </div>

        </section>


        {/* =====================================
            ERROR MESSAGE
        ===================================== */}

        {error && (
          <div className="dashboard-error">

            <div className="error-icon">
              ⚠️
            </div>

            <div className="error-content">

              <strong>
                Dashboard Error
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button
              onClick={handleRefresh}
              className="error-retry-btn"
            >
              Try Again
            </button>

          </div>
        )}


        {/* =====================================
            LOADING STATE
        ===================================== */}

        {loading ? (
          <div className="dashboard-loading">

            <div className="loading-spinner"></div>

            <h3>
              Loading Dashboard
            </h3>

            <p>
              Getting the latest statistics from MySQL...
            </p>

          </div>
        ) : (
          <>

            {/* =====================================
                SYSTEM OVERVIEW
            ===================================== */}

            <section className="dashboard-section">

              <div className="section-heading">

                <div className="section-title-wrapper">

                  <span className="section-eyebrow">
                    LIVE STATISTICS
                  </span>

                  <h2>
                    📊 System Overview
                  </h2>

                  <p>
                    Current records available in your
                    agricultural management system.
                  </p>

                </div>

                <div className="database-badge">
                  <span>●</span>
                  MySQL Connected
                </div>

              </div>


              <div className="dashboard-stats-grid">

                {statCards.map((card) => (
                  <Link
                    to={card.link}
                    className="dashboard-stat-card"
                    key={card.title}
                  >

                    <div className="stat-card-top">

                      <div className="dashboard-stat-icon">
                        {card.icon}
                      </div>

                      <span className="stat-arrow">
                        →
                      </span>

                    </div>

                    <div className="dashboard-stat-info">

                      <p>
                        {card.title}
                      </p>

                      <h3>
                        {card.value}
                      </h3>

                      <span className="stat-description">
                        {card.description}
                      </span>

                    </div>

                  </Link>
                ))}

              </div>

            </section>


            {/* =====================================
                AGRICULTURE SUMMARY
            ===================================== */}

            <section className="agriculture-summary">

              <div className="summary-header">

                <div>

                  <span className="summary-label">
                    SYSTEM SUMMARY
                  </span>

                  <h2>
                    🌿 Agriculture Overview
                  </h2>

                  <p>
                    A quick overview of your current
                    agricultural management records.
                  </p>

                </div>

                <div className="summary-decoration">
                  🌾
                </div>

              </div>


              <div className="summary-grid">

                <div className="summary-item">

                  <span className="summary-item-icon">
                    👨‍🌾
                  </span>

                  <div>
                    <strong>
                      {stats.farmers.toLocaleString()}
                    </strong>

                    <span>
                      Registered Farmers
                    </span>
                  </div>

                </div>


                <div className="summary-item">

                  <span className="summary-item-icon">
                    🌱
                  </span>

                  <div>
                    <strong>
                      {stats.fields.toLocaleString()}
                    </strong>

                    <span>
                      Managed Fields
                    </span>
                  </div>

                </div>


                <div className="summary-item">

                  <span className="summary-item-icon">
                    🌾
                  </span>

                  <div>
                    <strong>
                      {stats.crops.toLocaleString()}
                    </strong>

                    <span>
                      Crop Records
                    </span>
                  </div>

                </div>


                <div className="summary-item">

                  <span className="summary-item-icon">
                    🚜
                  </span>

                  <div>
                    <strong>
                      {stats.cultivations.toLocaleString()}
                    </strong>

                    <span>
                      Cultivation Records
                    </span>
                  </div>

                </div>


                <div className="summary-item">

                  <span className="summary-item-icon">
                    💰
                  </span>

                  <div>
                    <strong>
                      LKR {stats.expenses.toLocaleString()}
                    </strong>

                    <span>
                      Total Expenses
                    </span>
                  </div>

                </div>


                <div className="summary-item">

                  <span className="summary-item-icon">
                    🌾
                  </span>

                  <div>
                    <strong>
                      {stats.harvest.toLocaleString()} kg
                    </strong>

                    <span>
                      Harvest Quantity
                    </span>
                  </div>

                </div>

              </div>

            </section>


            {/* =====================================
                QUICK ACTIONS
            ===================================== */}

            <section className="quick-actions">

              <div className="section-heading">

                <div className="section-title-wrapper">

                  <span className="section-eyebrow">
                    MANAGEMENT SHORTCUTS
                  </span>

                  <h2>
                    ⚡ Quick Actions
                  </h2>

                  <p>
                    Quickly access important management
                    modules and system reports.
                  </p>

                </div>

              </div>


              <div className="quick-actions-grid">

                {quickActions.map((action) => (
                  <Link
                    to={action.link}
                    className="quick-action"
                    key={action.title}
                  >

                    <span className="quick-action-icon">
                      {action.icon}
                    </span>

                    <div className="quick-action-content">

                      <strong>
                        {action.title}
                      </strong>

                      <small>
                        {action.description}
                      </small>

                    </div>

                    <b className="quick-action-arrow">
                      →
                    </b>

                  </Link>
                ))}

              </div>

            </section>

          </>
        )}

      </div>
    </>
  );
}

export default Dashboard;