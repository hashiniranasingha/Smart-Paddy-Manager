import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import Fields from "./pages/Fields";
import Crops from "./pages/Crops";
import Cultivation from "./pages/Cultivation";
import FertilizerPesticide from "./pages/FertilizerPesticide";
import FieldMonitoring from "./pages/FieldMonitoring";
import Expenses from "./pages/Expenses";
import Harvest from "./pages/Harvest";
import Reports from "./pages/Reports";


// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// =====================================================
// NAVBAR LAYOUT
// =====================================================

function NavbarLayout({ children }) {

  return (
    <>
      <Navbar />

      {children}
    </>
  );

}


// =====================================================
// APP
// =====================================================

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            <NavbarLayout>
              <Home />
            </NavbarLayout>
          }
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Dashboard />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            FARMERS
        ================================================= */}

        <Route
          path="/farmers"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Farmers />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            FIELDS
        ================================================= */}

        <Route
          path="/fields"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Fields />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            CROPS
        ================================================= */}

        <Route
          path="/crops"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Crops />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            CULTIVATION
        ================================================= */}

        <Route
          path="/cultivation"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Cultivation />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            FERTILIZER & PESTICIDE
        ================================================= */}

        <Route
          path="/fertilizer-pesticide"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <FertilizerPesticide />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            FIELD MONITORING
        ================================================= */}

        <Route
          path="/field-monitoring"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <FieldMonitoring />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            EXPENSES
        ================================================= */}

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Expenses />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            HARVEST
        ================================================= */}

        <Route
          path="/harvest"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Harvest />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            REPORTS
        ================================================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute>

              <NavbarLayout>
                <Reports />
              </NavbarLayout>

            </ProtectedRoute>
          }
        />


        {/* =================================================
            UNKNOWN URL
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );

}

export default App;