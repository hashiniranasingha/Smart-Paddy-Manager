import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    user = null;
  }


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });

  };


  // =====================================================
  // ACTIVE LINK
  // =====================================================

  const isActive = (path) => {

    return location.pathname === path
      ? "navbar-link active"
      : "navbar-link";

  };


  // =====================================================
  // NAVBAR
  // =====================================================

  return (

    <nav className="navbar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="navbar-logo">

        <Link to="/" className="logo-link">

          <span className="logo-icon">
            🌾
          </span>

          <div className="logo-text">

            <strong>
              Smart 
            </strong>

            <span>
              Management System
            </span>

          </div>

        </Link>

      </div>


      {/* =================================================
          NAVIGATION LINKS
      ================================================= */}

      <div className="navbar-links">

        <Link
          to="/"
          className={isActive("/")}
        >
          Home
        </Link>


        {token && (
          <>

            <Link
              to="/dashboard"
              className={isActive("/dashboard")}
            >
              Dashboard
            </Link>


            <Link
              to="/farmers"
              className={isActive("/farmers")}
            >
              Farmers
            </Link>


            <Link
              to="/fields"
              className={isActive("/fields")}
            >
              Fields
            </Link>


            <Link
              to="/crops"
              className={isActive("/crops")}
            >
              Crops
            </Link>


            <Link
              to="/cultivation"
              className={isActive("/cultivation")}
            >
              Cultivation
            </Link>


            <Link
              to="/fertilizer-pesticide"
              className={isActive("/fertilizer-pesticide")}
            >
              Fertilizer & Pesticide
            </Link>


            <Link
              to="/field-monitoring"
              className={isActive("/field-monitoring")}
            >
              Monitoring
            </Link>


            <Link
              to="/expenses"
              className={isActive("/expenses")}
            >
              Expenses
            </Link>


            <Link
              to="/harvest"
              className={isActive("/harvest")}
            >
              Harvest
            </Link>


            <Link
              to="/reports"
              className={isActive("/reports")}
            >
              Reports
            </Link>

          </>
        )}

      </div>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="navbar-right">

        {token && user ? (

          <>

            {/* USER INFO */}

            <div className="navbar-user">

              <span className="user-icon">
                👤
              </span>

              <div className="user-info">

                <span className="user-name">
                  {user.full_name || "User"}
                </span>

                <span className="user-role">
                  {user.role || "User"}
                </span>

              </div>

            </div>


            {/* LOGOUT */}

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>

        ) : (

          <Link
            to="/login"
            className="login-button"
          >
            Login
          </Link>

        )}

      </div>

    </nav>

  );

}

export default Navbar;