const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { rejects } = require("assert");
const generatePayload = require("promptpay-qr");
const QRcode = require("qrcode");
const _ = require("lodash");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3002;

// กำหนดค่าการเชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel",
});

// เชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
  if (err) {
    console.error("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:", err);
    throw err;
  }
  console.log("เชื่อมต่อฐานข้อมูลสำเร็จ");
});

// register

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  db.query(
    "SELECT * FROM users WHERE username = ? OR email =?",
    [username, email],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error: " + err.message });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Username or Email already exists" });
      }

      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Database error: " + err.message });
          }
          res.status(201).json({ message: "ลงทะเบียนผู้ใช้เรียบร้อยแล้ว" });
        }
      );
    }
  );
});

// login
app.post("/login", (req, res) => {
  const { usernameOrEmail, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [usernameOrEmail, usernameOrEmail],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error: " + err.message });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: "ไม่พบชื่อผู้ใช้" });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        "your_jwt_secret",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ message: "Login successful", token });
    }
  );
});

// เพิ่มสินค้า
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "uploads/");
  },
  filename: function (req, file, cd) {
    cd(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/products", upload.single("image"), (req, res) => {
  const { name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !price || !quantity || !image) {
    return res.status(400).json({ message: "ต้องระบุข้อมูลทุกช่อง" });
  }

  const query =
    "INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [name, description, price, quantity, image],
    (err, results) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Product created successfully!" });
    }
  );
});

//ดึงข้อมูล products
app.get("/products", async (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
});

//แก้ไข

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  const query =
    "UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?";
  db.query(query, [name, description, price, quantity, id], (err, results) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Product updatad successfully!" });
  });
});

//ลบ products
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Product deleted successfully!" });
  });
});

//คำสั้งซื้อ

app.post("/orders", (req, res) => {
  const { cartItems, totalPrice, shippingInfo, paymentMethod } = req.body;
  const {
    fullName,
    address,
    province,
    district,
    subdistrict,
    postalCode,
    phone,
  } = shippingInfo;

  const ordersQuery =
    "INSERT INTO orders (totalPrice, fullName, address, province, district, subdistrict, postalCode, phone, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    ordersQuery,
    [
      totalPrice,
      fullName,
      address,
      province,
      district,
      subdistrict,
      postalCode,
      phone,
      paymentMethod,
    ],
    (err, orderResults) => {
      if (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const orderId = orderResults.insertId;

      const orderItemsQuery =
        "INSERT INTO order_items (orderId, productId, quantity) VALUES ?";
      const orderItemsData = cartItems.map((item) => [
        orderId,
        item.id,
        item.quantity,
      ]);
      db.query(orderItemsQuery, [orderItemsData], (err) => {
        if (err) {
          console.error("Error inserting order items:", err);
          return res.status(500).json({ message: "Database error" });
        }

        const updateStockQueries = cartItems.map((item) => {
          return new Promise((resolve, rejects) => {
            const updateStockQuery =
              "UPDATE products SET quantity = quantity - ? WHERE id = ?";
            db.query(updateStockQuery, [item.quantity, item.id], (err) => {
              if (err) {
                rejects(err);
              } else {
                resolve();
              }
            });
          });
        });

        Promise.all(updateStockQueries)
          .then(() => {
            res.status(201).json({ message: "Order created successfully!" });
          })
          .catch((err) => {
            console.error("Error updating product stock:", err);
            res.status(500).json({ message: "Database error" });
          });
      });
    }
  );
});

// สร้าง QR code สำหรับการชำระเงิน
app.post("/generateQR", async (req, res) => {
  const amount = parseFloat(req.body.amount);
  const mobileNumber = "0989598354";
  const payload = generatePayload(mobileNumber, { amount });
  const option = {
    color: {
      dark: "#000",
      light: "#fff",
    },
  };

  QRcode.toDataURL(payload, option, (err, url) => {
    if (err) {
      console.error("Error generating QR code:", err);
      return res
        .status(400)
        .json({ RespCode: 400, RespMessage: "Error: " + err });
    } else {
      return res
        .status(200)
        .json({ RespCode: 200, RespMessage: "Success", Result: url });
    }
  });
});

//order

// ดึงข้อมูล orders และ order items พร้อมรายละเอียดสินค้าที่เกี่ยวข้อง
app.get("/orders", (req, res) => {
  const query = `
    SELECT 
      orders.id AS orderId, 
      orders.totalPrice, 
      orders.fullName, 
      orders.address, 
      orders.province, 
      orders.district, 
      orders.subdistrict, 
      orders.postalCode, 
      orders.phone, 
      orders.paymentMethod, 
      orders.created_at, 
      products.id AS productId, 
      products.name, 
      products.price, 
      products.image, 
      order_items.quantity 
    FROM orders 
    JOIN order_items ON orders.id = order_items.orderId 
    JOIN products ON order_items.productId = products.id 
    ORDER BY orders.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
