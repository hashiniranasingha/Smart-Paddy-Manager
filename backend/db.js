const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "paddyfield1_db",
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = connection;