const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Sử dụng CORS để cho phép frontend (ReactJS) gọi API từ backend
app.use(cors());

// Đọc dữ liệu từ file data.json
const dataFilePath = path.join(__dirname, 'data.json');

// Hàm đọc và phân tích dữ liệu từ file
const readData = () => {
  const rawData = fs.readFileSync(dataFilePath); // Đọc nội dung file
  return JSON.parse(rawData); // Parse JSON
};

// API tìm kiếm từ khóa
app.get('/search', (req, res) => {
  const { keyword, restaurant } = req.query;

  // Kiểm tra nếu không có từ khóa
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  // Lấy dữ liệu từ file data.json
  const data = readData();

  // Filter và tìm kiếm dữ liệu
  const result = Object.keys(data)
    .filter((key) => !restaurant || key.toLowerCase() === restaurant.toLowerCase())
    .reduce((acc, key) => {
      const matches = data[key].filter((item) =>
        item.Word.toLowerCase().includes(keyword.toLowerCase())
      );
      if (matches.length > 0) {
        acc[key] = matches;
      }
      return acc;
    }, {});

  // Trả về kết quả hoặc thông báo không có kết quả
  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No matches found" });
  }

  res.json(result);
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
