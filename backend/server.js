
const express = require("express");
const cors = require("cors");
const db = require("./db");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

  res.json({
    message: "Paddy Field Backend Running Successfully 🌾"
  });

});


// =====================================================
// LOGIN
// =====================================================

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  console.log("Login request received:", email);

  if (!email || !password) {

    return res.status(400).json({
      message: "Email and password are required"
    });

  }

  const sql =
    "SELECT * FROM users WHERE email = ?";

  db.query(
    sql,
    [email],
    (err, result) => {

      if (err) {

        console.log("Login database error:", err);

        return res.status(500).json({
          message: "Database Error"
        });

      }

      if (result.length === 0) {

        return res.status(401).json({
          message: "Invalid Email"
        });

      }

      const user = result[0];

      // Current users table uses plain-text passwords
      if (user.password !== password) {

        return res.status(401).json({
          message: "Invalid Password"
        });

      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        "paddyfield_secret_key",
        {
          expiresIn: "1d"
        }
      );

      console.log("Login successful:", user.email);

      res.json({

        success: true,

        token,

        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }

      });

    }
  );

});


// =====================================================
// FARMERS
// =====================================================

app.get("/farmers", (req, res) => {

  db.query(
    "SELECT * FROM farmers ORDER BY id DESC",
    (err, result) => {

      if (err) {

        console.log("Farmer fetch error:", err);

        return res.status(500).json({
          message: "Failed to fetch farmers"
        });

      }

      res.json(result);

    }
  );

});


app.get("/farmers/count", (req, res) => {

  db.query(
    "SELECT COUNT(*) AS total FROM farmers",
    (err, result) => {

      if (err) {

        console.log("Farmer count error:", err);

        return res.status(500).json({
          message: "Failed to get farmer count"
        });

      }

      res.json({
        total: result[0].total
      });

    }
  );

});


app.post("/farmers", (req, res) => {

  const {
    farmer_name,
    email,
    phone,
    village
  } = req.body;

  const sql = `
    INSERT INTO farmers
    (
      farmer_name,
      email,
      phone,
      village
    )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      farmer_name,
      email,
      phone,
      village
    ],
    (err, result) => {

      if (err) {

        console.log("Farmer insert error:", err);

        return res.status(500).json({
          message: "Failed to add farmer"
        });

      }

      res.json({
        message: "Farmer added successfully",
        farmerId: result.insertId
      });

    }
  );

});


app.put("/farmers/:id", (req, res) => {

  const id = req.params.id;

  const {
    farmer_name,
    email,
    phone,
    village
  } = req.body;

  const sql = `
    UPDATE farmers
    SET
      farmer_name = ?,
      email = ?,
      phone = ?,
      village = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      farmer_name,
      email,
      phone,
      village,
      id
    ],
    (err) => {

      if (err) {

        console.log("Farmer update error:", err);

        return res.status(500).json({
          message: "Farmer update failed"
        });

      }

      res.json({
        message: "Farmer updated successfully"
      });

    }
  );

});


app.delete("/farmers/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM farmers WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log("Farmer delete error:", err);

        return res.status(500).json({
          message: "Farmer delete failed"
        });

      }

      res.json({
        message: "Farmer deleted successfully"
      });

    }
  );

});


// =====================================================
// FIELDS
// =====================================================

app.get("/fields", (req, res) => {

  const sql = `
    SELECT
      fields.*,
      farmers.farmer_name
    FROM fields
    INNER JOIN farmers
      ON fields.farmer_id = farmers.id
    ORDER BY fields.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log("Field fetch error:", err);

      return res.status(500).json({
        message: "Failed to fetch fields"
      });

    }

    res.json(result);

  });

});


app.post("/fields", (req, res) => {

  const {
    farmer_id,
    field_name,
    area,
    location,
    soil_type,
    irrigation_type,
    current_crop,
    planting_date
  } = req.body;

  const sql = `
    INSERT INTO fields
    (
      farmer_id,
      field_name,
      area,
      location,
      soil_type,
      irrigation_type,
      current_crop,
      planting_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      farmer_id,
      field_name,
      area,
      location,
      soil_type,
      irrigation_type,
      current_crop,
      planting_date
    ],
    (err, result) => {

      if (err) {

        console.log("Field insert error:", err);

        return res.status(500).json({
          message: "Field creation failed"
        });

      }

      res.json({
        message: "Field added successfully",
        fieldId: result.insertId
      });

    }
  );

});


app.put("/fields/:id", (req, res) => {

  const id = req.params.id;

  const {
    farmer_id,
    field_name,
    area,
    location,
    soil_type,
    irrigation_type,
    current_crop,
    planting_date
  } = req.body;

  const sql = `
    UPDATE fields
    SET
      farmer_id = ?,
      field_name = ?,
      area = ?,
      location = ?,
      soil_type = ?,
      irrigation_type = ?,
      current_crop = ?,
      planting_date = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      farmer_id,
      field_name,
      area,
      location,
      soil_type,
      irrigation_type,
      current_crop,
      planting_date,
      id
    ],
    (err) => {

      if (err) {

        console.log("Field update error:", err);

        return res.status(500).json({
          message: "Field update failed"
        });

      }

      res.json({
        message: "Field updated successfully"
      });

    }
  );

});


app.delete("/fields/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM fields WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log("Field delete error:", err);

        return res.status(500).json({
          message: "Field delete failed"
        });

      }

      res.json({
        message: "Field deleted successfully"
      });

    }
  );

});


// =====================================================
// CROPS
// =====================================================

app.get("/crops", (req, res) => {

  const sql = `
    SELECT
      crops.*,
      fields.field_name
    FROM crops
    INNER JOIN fields
      ON crops.field_id = fields.id
    ORDER BY crops.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log("Crop fetch error:", err);

      return res.status(500).json({
        message: "Failed to fetch crops"
      });

    }

    res.json(result);

  });

});


app.post("/crops", (req, res) => {

  const {
    field_id,
    crop_name,
    variety,
    season,
    planting_date,
    expected_harvest_date,
    status
  } = req.body;

  const sql = `
    INSERT INTO crops
    (
      field_id,
      crop_name,
      variety,
      season,
      planting_date,
      expected_harvest_date,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      field_id,
      crop_name,
      variety,
      season,
      planting_date,
      expected_harvest_date,
      status
    ],
    (err, result) => {

      if (err) {

        console.log("Crop insert error:", err);

        return res.status(500).json({
          message: "Crop creation failed"
        });

      }

      res.json({
        message: "Crop added successfully",
        cropId: result.insertId
      });

    }
  );

});


app.put("/crops/:id", (req, res) => {

  const id = req.params.id;

  const {
    field_id,
    crop_name,
    variety,
    season,
    planting_date,
    expected_harvest_date,
    status
  } = req.body;

  const sql = `
    UPDATE crops
    SET
      field_id = ?,
      crop_name = ?,
      variety = ?,
      season = ?,
      planting_date = ?,
      expected_harvest_date = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      field_id,
      crop_name,
      variety,
      season,
      planting_date,
      expected_harvest_date,
      status,
      id
    ],
    (err) => {

      if (err) {

        console.log("Crop update error:", err);

        return res.status(500).json({
          message: "Crop update failed"
        });

      }

      res.json({
        message: "Crop updated successfully"
      });

    }
  );

});


app.delete("/crops/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM crops WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log("Crop delete error:", err);

        return res.status(500).json({
          message: "Crop delete failed"
        });

      }

      res.json({
        message: "Crop deleted successfully"
      });

    }
  );

});


// =====================================================
// CULTIVATION
// =====================================================

app.get("/cultivations", (req, res) => {

  const sql = `
    SELECT
      cultivations.*,
      crops.crop_name,
      crops.variety,
      fields.field_name
    FROM cultivations
    INNER JOIN crops
      ON cultivations.crop_id = crops.id
    INNER JOIN fields
      ON crops.field_id = fields.id
    ORDER BY cultivations.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log("Cultivation fetch error:", err);

      return res.status(500).json({
        message: "Failed to fetch cultivations"
      });

    }

    res.json(result);

  });

});


app.post("/cultivations", (req, res) => {

  const {
    crop_id,
    planting_method,
    seed_quantity,
    seed_unit,
    planting_date,
    expected_harvest_date,
    water_schedule,
    status,
    notes
  } = req.body;

  const sql = `
    INSERT INTO cultivations
    (
      crop_id,
      planting_method,
      seed_quantity,
      seed_unit,
      planting_date,
      expected_harvest_date,
      water_schedule,
      status,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      crop_id,
      planting_method,
      seed_quantity,
      seed_unit,
      planting_date,
      expected_harvest_date,
      water_schedule,
      status,
      notes
    ],
    (err, result) => {

      if (err) {

        console.log("Cultivation insert error:", err);

        return res.status(500).json({
          message: "Cultivation creation failed"
        });

      }

      res.json({
        message: "Cultivation added successfully",
        cultivationId: result.insertId
      });

    }
  );

});


app.put("/cultivations/:id", (req, res) => {

  const id = req.params.id;

  const {
    crop_id,
    planting_method,
    seed_quantity,
    seed_unit,
    planting_date,
    expected_harvest_date,
    water_schedule,
    status,
    notes
  } = req.body;

  const sql = `
    UPDATE cultivations
    SET
      crop_id = ?,
      planting_method = ?,
      seed_quantity = ?,
      seed_unit = ?,
      planting_date = ?,
      expected_harvest_date = ?,
      water_schedule = ?,
      status = ?,
      notes = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      crop_id,
      planting_method,
      seed_quantity,
      seed_unit,
      planting_date,
      expected_harvest_date,
      water_schedule,
      status,
      notes,
      id
    ],
    (err) => {

      if (err) {

        console.log("Cultivation update error:", err);

        return res.status(500).json({
          message: "Cultivation update failed"
        });

      }

      res.json({
        message: "Cultivation updated successfully"
      });

    }
  );

});


app.delete("/cultivations/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM cultivations WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log("Cultivation delete error:", err);

        return res.status(500).json({
          message: "Cultivation delete failed"
        });

      }

      res.json({
        message: "Cultivation deleted successfully"
      });

    }
  );

});


// =====================================================
// FERTILIZER & PESTICIDES
// =====================================================

app.get("/fertilizer-pesticides", (req, res) => {

  const sql = `
    SELECT
      fertilizer_pesticides.*,
      crops.crop_name,
      fields.field_name
    FROM fertilizer_pesticides
    INNER JOIN crops
      ON fertilizer_pesticides.crop_id = crops.id
    INNER JOIN fields
      ON crops.field_id = fields.id
    ORDER BY fertilizer_pesticides.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(
        "Fertilizer/Pesticide fetch error:",
        err
      );

      return res.status(500).json({
        message: "Failed to fetch fertilizer/pesticide records"
      });

    }

    res.json(result);

  });

});


app.post("/fertilizer-pesticides", (req, res) => {

  const {
    crop_id,
    input_type,
    product_name,
    quantity,
    unit,
    application_date,
    cost,
    notes
  } = req.body;

  const sql = `
    INSERT INTO fertilizer_pesticides
    (
      crop_id,
      input_type,
      product_name,
      quantity,
      unit,
      application_date,
      cost,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      crop_id,
      input_type,
      product_name,
      quantity,
      unit,
      application_date,
      cost,
      notes
    ],
    (err, result) => {

      if (err) {

        console.log(
          "Fertilizer/Pesticide insert error:",
          err
        );

        return res.status(500).json({
          message: "Failed to add fertilizer/pesticide"
        });

      }

      res.json({
        message: "Fertilizer/Pesticide added successfully",
        recordId: result.insertId
      });

    }
  );

});


app.put("/fertilizer-pesticides/:id", (req, res) => {

  const id = req.params.id;

  const {
    crop_id,
    input_type,
    product_name,
    quantity,
    unit,
    application_date,
    cost,
    notes
  } = req.body;

  const sql = `
    UPDATE fertilizer_pesticides
    SET
      crop_id = ?,
      input_type = ?,
      product_name = ?,
      quantity = ?,
      unit = ?,
      application_date = ?,
      cost = ?,
      notes = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      crop_id,
      input_type,
      product_name,
      quantity,
      unit,
      application_date,
      cost,
      notes,
      id
    ],
    (err) => {

      if (err) {

        console.log(
          "Fertilizer/Pesticide update error:",
          err
        );

        return res.status(500).json({
          message: "Fertilizer/Pesticide update failed"
        });

      }

      res.json({
        message: "Fertilizer/Pesticide updated successfully"
      });

    }
  );

});


app.delete("/fertilizer-pesticides/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM fertilizer_pesticides WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log(
          "Fertilizer/Pesticide delete error:",
          err
        );

        return res.status(500).json({
          message: "Fertilizer/Pesticide delete failed"
        });

      }

      res.json({
        message: "Fertilizer/Pesticide deleted successfully"
      });

    }
  );

});


// =====================================================
// FIELD MONITORING
// =====================================================

app.get("/field-monitoring", (req, res) => {

  const sql = `
    SELECT
      field_monitoring.*,
      crops.crop_name,
      crops.variety,
      fields.field_name
    FROM field_monitoring
    INNER JOIN crops
      ON field_monitoring.crop_id = crops.id
    INNER JOIN fields
      ON crops.field_id = fields.id
    ORDER BY field_monitoring.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(
        "Field monitoring fetch error:",
        err
      );

      return res.status(500).json({
        message: "Failed to fetch monitoring records"
      });

    }

    res.json(result);

  });

});


app.post("/field-monitoring", (req, res) => {

  const {
    crop_id,
    monitoring_date,
    plant_height,
    water_level,
    pest_status,
    disease_status,
    growth_stage,
    notes
  } = req.body;

  const sql = `
    INSERT INTO field_monitoring
    (
      crop_id,
      monitoring_date,
      plant_height,
      water_level,
      pest_status,
      disease_status,
      growth_stage,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      crop_id,
      monitoring_date,
      plant_height,
      water_level,
      pest_status,
      disease_status,
      growth_stage,
      notes
    ],
    (err, result) => {

      if (err) {

        console.log(
          "Field monitoring insert error:",
          err
        );

        return res.status(500).json({
          message: "Monitoring record creation failed"
        });

      }

      res.json({
        message: "Monitoring record added successfully",
        monitoringId: result.insertId
      });

    }
  );

});


app.put("/field-monitoring/:id", (req, res) => {

  const id = req.params.id;

  const {
    crop_id,
    monitoring_date,
    plant_height,
    water_level,
    pest_status,
    disease_status,
    growth_stage,
    notes
  } = req.body;

  const sql = `
    UPDATE field_monitoring
    SET
      crop_id = ?,
      monitoring_date = ?,
      plant_height = ?,
      water_level = ?,
      pest_status = ?,
      disease_status = ?,
      growth_stage = ?,
      notes = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      crop_id,
      monitoring_date,
      plant_height,
      water_level,
      pest_status,
      disease_status,
      growth_stage,
      notes,
      id
    ],
    (err) => {

      if (err) {

        console.log(
          "Field monitoring update error:",
          err
        );

        return res.status(500).json({
          message: "Monitoring record update failed"
        });

      }

      res.json({
        message: "Monitoring record updated successfully"
      });

    }
  );

});


app.delete("/field-monitoring/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM field_monitoring WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log(
          "Field monitoring delete error:",
          err
        );

        return res.status(500).json({
          message: "Monitoring record delete failed"
        });

      }

      res.json({
        message: "Monitoring record deleted successfully"
      });

    }
  );

});


// =====================================================
// EXPENSES
// =====================================================

app.get("/expenses", (req, res) => {

  const sql = `
    SELECT
      expenses.*,
      fields.field_name,
      crops.crop_name
    FROM expenses
    INNER JOIN fields
      ON expenses.field_id = fields.id
    LEFT JOIN crops
      ON expenses.crop_id = crops.id
    ORDER BY expenses.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(
        "Expense fetch error:",
        err
      );

      return res.status(500).json({
        message: "Failed to fetch expenses"
      });

    }

    res.json(result);

  });

});


app.get("/expenses/total", (req, res) => {

  const sql = `
    SELECT
      COALESCE(SUM(amount), 0) AS total
    FROM expenses
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(
        "Expense total error:",
        err
      );

      return res.status(500).json({
        message: "Failed to calculate total expenses"
      });

    }

    res.json({
      total: result[0].total
    });

  });

});


app.post("/expenses", (req, res) => {

  const {
    field_id,
    crop_id,
    expense_type,
    description,
    amount,
    expense_date,
    payment_method,
    notes
  } = req.body;

  const sql = `
    INSERT INTO expenses
    (
      field_id,
      crop_id,
      expense_type,
      description,
      amount,
      expense_date,
      payment_method,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      field_id,
      crop_id || null,
      expense_type,
      description,
      amount,
      expense_date,
      payment_method,
      notes
    ],
    (err, result) => {

      if (err) {

        console.log(
          "Expense insert error:",
          err
        );

        return res.status(500).json({
          message: "Expense creation failed"
        });

      }

      res.json({
        message: "Expense added successfully",
        expenseId: result.insertId
      });

    }
  );

});


app.put("/expenses/:id", (req, res) => {

  const id = req.params.id;

  const {
    field_id,
    crop_id,
    expense_type,
    description,
    amount,
    expense_date,
    payment_method,
    notes
  } = req.body;

  const sql = `
    UPDATE expenses
    SET
      field_id = ?,
      crop_id = ?,
      expense_type = ?,
      description = ?,
      amount = ?,
      expense_date = ?,
      payment_method = ?,
      notes = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      field_id,
      crop_id || null,
      expense_type,
      description,
      amount,
      expense_date,
      payment_method,
      notes,
      id
    ],
    (err) => {

      if (err) {

        console.log(
          "Expense update error:",
          err
        );

        return res.status(500).json({
          message: "Expense update failed"
        });

      }

      res.json({
        message: "Expense updated successfully"
      });

    }
  );

});


app.delete("/expenses/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM expenses WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log(
          "Expense delete error:",
          err
        );

        return res.status(500).json({
          message: "Expense delete failed"
        });

      }

      res.json({
        message: "Expense deleted successfully"
      });

    }
  );

});


// =====================================================
// HARVESTS
// =====================================================

app.get("/harvests", (req, res) => {

  const sql = `
    SELECT
      harvests.*,
      crops.crop_name,
      crops.variety,
      fields.field_name
    FROM harvests
    INNER JOIN crops
      ON harvests.crop_id = crops.id
    INNER JOIN fields
      ON crops.field_id = fields.id
    ORDER BY harvests.id DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {

      console.log(
        "Harvest fetch error:",
        err
      );

      return res.status(500).json({
        message: "Failed to fetch harvests"
      });

    }

    res.json(result);

  });

});


app.post("/harvests", (req, res) => {

  const {
    crop_id,
    harvest_date,
    quantity,
    unit,
    quality_grade,
    storage_location,
    notes
  } = req.body;

  const sql = `
    INSERT INTO harvests
    (
      crop_id,
      harvest_date,
      quantity,
      unit,
      quality_grade,
      storage_location,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      crop_id,
      harvest_date,
      quantity,
      unit,
      quality_grade,
      storage_location,
      notes
    ],
    (err, result) => {

      if (err) {

        console.log(
          "Harvest insert error:",
          err
        );

        return res.status(500).json({
          message: "Harvest creation failed"
        });

      }

      res.json({
        message: "Harvest added successfully",
        harvestId: result.insertId
      });

    }
  );

});


app.put("/harvests/:id", (req, res) => {

  const id = req.params.id;

  const {
    crop_id,
    harvest_date,
    quantity,
    unit,
    quality_grade,
    storage_location,
    notes
  } = req.body;

  const sql = `
    UPDATE harvests
    SET
      crop_id = ?,
      harvest_date = ?,
      quantity = ?,
      unit = ?,
      quality_grade = ?,
      storage_location = ?,
      notes = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      crop_id,
      harvest_date,
      quantity,
      unit,
      quality_grade,
      storage_location,
      notes,
      id
    ],
    (err) => {

      if (err) {

        console.log(
          "Harvest update error:",
          err
        );

        return res.status(500).json({
          message: "Harvest update failed"
        });

      }

      res.json({
        message: "Harvest updated successfully"
      });

    }
  );

});


app.delete("/harvests/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM harvests WHERE id = ?",
    [id],
    (err) => {

      if (err) {

        console.log(
          "Harvest delete error:",
          err
        );

        return res.status(500).json({
          message: "Harvest delete failed"
        });

      }

      res.json({
        message: "Harvest deleted successfully"
      });

    }
  );

});

// =====================================================
// REPORTS
// =====================================================

app.get("/reports/summary", (req, res) => {

  const reportData = {};

  db.query(
    "SELECT COUNT(*) AS total FROM farmers",
    (err, farmers) => {

      if (err) {
        return res.status(500).json({
          message: "Report Error"
        });
      }

      reportData.farmers =
        farmers[0].total;

      db.query(
        "SELECT COUNT(*) AS total FROM fields",
        (err, fields) => {

          reportData.fields =
            fields[0].total;

          db.query(
            "SELECT COUNT(*) AS total FROM crops",
            (err, crops) => {

              reportData.crops =
                crops[0].total;

              db.query(
                "SELECT COUNT(*) AS total FROM cultivations",
                (err, cultivations) => {

                  reportData.cultivations =
                    cultivations[0].total;

                  db.query(
                    "SELECT COALESCE(SUM(amount),0) AS total FROM expenses",
                    (err, expenses) => {

                      reportData.expenses =
                        expenses[0].total;

                      db.query(
                        "SELECT COALESCE(SUM(quantity),0) AS total FROM harvests",
                        (err, harvests) => {

                          reportData.harvest =
                            harvests[0].total;

                          res.json(
                            reportData
                          );

                        }
                      );

                    }
                  );

                }
              );

            }
          );

        }
      );

    }
  );

});

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

app.get("/dashboard/stats", async (req, res) => {

  try {

    const queries = {

      farmers: `
        SELECT COUNT(*) AS total
        FROM farmers
      `,

      fields: `
        SELECT COUNT(*) AS total
        FROM fields
      `,

      crops: `
        SELECT COUNT(*) AS total
        FROM crops
      `,

      cultivations: `
        SELECT COUNT(*) AS total
        FROM cultivations
      `,

      fertilizerPesticides: `
        SELECT COUNT(*) AS total
        FROM fertilizer_pesticides
      `,

      monitoring: `
        SELECT COUNT(*) AS total
        FROM field_monitoring
      `,

      expenses: `
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM expenses
      `,

      harvest: `
        SELECT COALESCE(SUM(quantity), 0) AS total
        FROM harvests
      `

    };


    const results = {};


    for (
      const [key, sql]
      of Object.entries(queries)
    ) {

      results[key] = await new Promise(
        (resolve, reject) => {

          db.query(
            sql,
            (err, result) => {

              if (err) {

                reject(err);

              } else {

                resolve(result[0].total);

              }

            }
          );

        }
      );

    }


    res.json({

      farmers: Number(results.farmers),

      fields: Number(results.fields),

      crops: Number(results.crops),

      cultivations: Number(results.cultivations),

      fertilizerPesticides:
        Number(results.fertilizerPesticides),

      monitoring:
        Number(results.monitoring),

      expenses:
        Number(results.expenses),

      harvest:
        Number(results.harvest)

    });


  } catch (error) {

    console.log(
      "Dashboard stats error:",
      error
    );

    res.status(500).json({
      message: "Failed to load dashboard statistics"
    });

  }

});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});

