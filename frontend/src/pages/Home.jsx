import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import "./Home.css";

function Home() {
  const modules = [
    {
      icon: "👨‍🌾",
      title: "Farmer Management",
      description:
        "Manage farmer profiles, contact information and agricultural details in one place.",
      link: "/farmers",
    },
    {
      icon: "🌱",
      title: "Field Management",
      description:
        "Track paddy fields, field areas, locations, soil types and irrigation information.",
      link: "/fields",
    },
    {
      icon: "🌾",
      title: "Crop Management",
      description:
        "Manage crop varieties, planting information and crop-related records efficiently.",
      link: "/crops",
    },
    {
      icon: "🚜",
      title: "Cultivation Management",
      description:
        "Record and manage cultivation activities throughout the farming cycle.",
      link: "/cultivation",
    },
    {
      icon: "🧪",
      title: "Fertilizer & Pesticide",
      description:
        "Track fertilizer and pesticide applications, quantities, dates and costs.",
      link: "/fertilizer-pesticide",
    },
    {
      icon: "🔍",
      title: "Field Monitoring",
      description:
        "Monitor crop growth, pests, diseases, water levels and field conditions.",
      link: "/field-monitoring",
    },
    {
      icon: "💰",
      title: "Expense Management",
      description:
        "Track farming expenses including labour, fertilizer, transport and equipment.",
      link: "/expenses",
    },
    {
      icon: "🌾",
      title: "Harvest Management",
      description:
        "Record harvest quantities, quality, storage information and production details.",
      link: "/harvest",
    },
    {
      icon: "📑",
      title: "Reports & Analytics",
      description:
        "View important agricultural information and generate useful management reports.",
      link: "/reports",
    },
  ];

  return (
    <div className="home-container" id="home">
      

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🌱</span>
            SMART AGRICULTURE PLATFORM
          </div>

          <h1>
            Manage Your Paddy Fields
            <span> Smarter & Better</span>
          </h1>

          <p className="hero-description">
            A modern Paddy Field Management System designed to help
            farmers manage fields, crops, cultivation activities,
            expenses and harvests efficiently from one place.
          </p>

          <div className="hero-buttons">
            <Link to="/dashboard" className="primary-btn">
              Go to Dashboard
              <span>→</span>
            </Link>

            <a href="#features" className="secondary-btn">
              Explore Features
              <span>↓</span>
            </a>
          </div>

          <div className="hero-highlights">
            <div className="highlight-item">
              <span className="highlight-icon">✓</span>
              <span>Easy Management</span>
            </div>

            <div className="highlight-item">
              <span className="highlight-icon">✓</span>
              <span>Real-Time Records</span>
            </div>

            <div className="highlight-item">
              <span className="highlight-icon">✓</span>
              <span>Smart Reports</span>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-image-background"></div>

          <div className="hero-image-card">
            
           <img
  src={heroImage}
  alt="Paddy Field"
  className="hero-image"
/>

            <div className="hero-floating-card">
              <div className="floating-icon">🌾</div>
              <div>
                <strong>Smart Farming</strong>
                <span>Better field management</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section className="overview-section">
        <div className="overview-card">
          <div className="overview-item">
            <div className="overview-icon">👨‍🌾</div>
            <div>
              <strong>Farmers</strong>
              <span>Manage farmer records</span>
            </div>
          </div>

          <div className="overview-divider"></div>

          <div className="overview-item">
            <div className="overview-icon">🌱</div>
            <div>
              <strong>Fields</strong>
              <span>Track field information</span>
            </div>
          </div>

          <div className="overview-divider"></div>

          <div className="overview-item">
            <div className="overview-icon">🌾</div>
            <div>
              <strong>Crops</strong>
              <span>Monitor crop records</span>
            </div>
          </div>

          <div className="overview-divider"></div>

          <div className="overview-item">
            <div className="overview-icon">📊</div>
            <div>
              <strong>Reports</strong>
              <span>View useful insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="modules-section" id="features">
        <div className="section-heading-home">
          <p className="section-subtitle">POWERFUL FEATURES</p>

          <h2>Everything You Need to Manage Your Farm</h2>

          <p className="section-description">
            Manage the complete agricultural process from farmer
            registration to harvest reporting through one organized
            management system.
          </p>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <Link
              to={module.link}
              className="module-card"
              key={module.title}
            >
              <div className="module-card-top">
                <div className="module-icon">{module.icon}</div>
                <span className="module-arrow">→</span>
              </div>

              <h3>{module.title}</h3>

              <p>{module.description}</p>

              <span className="module-link">
                Manage Module <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-icon">🌾</div>

          <div>
            <p className="cta-label">SMART AGRICULTURE</p>
            <h2>Ready to Manage Your Paddy Fields?</h2>
            <p>
              Access your dashboard and manage all your agricultural
              records from one place.
            </p>
          </div>

          <Link to="/dashboard" className="cta-button">
            Open Dashboard
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>🌾</span>
              <strong>PaddyField</strong>
            </div>

            <p>
              Smart and organized management for modern paddy
              farming.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>System</h4>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/farmers">Farmers</Link>
              <Link to="/fields">Fields</Link>
              <Link to="/crops">Crops</Link>
            </div>

            <div>
              <h4>Management</h4>
              <Link to="/cultivation">Cultivation</Link>
              <Link to="/fertilizer-pesticide">
                Fertilizer
              </Link>
              <Link to="/field-monitoring">Monitoring</Link>
              <Link to="/harvest">Harvest</Link>
            </div>

            <div>
              <h4>More</h4>
              <Link to="/expenses">Expenses</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Paddy Field Management
            System. All rights reserved.
          </p>

          <span>🌱 Smart Agriculture Platform</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;