# Charity Donation Backend

## Mô tả
Hệ thống đóng góp từ thiện vùng thiên tai, cho phép người dùng đóng góp và quản lý quyên góp cho các nạn nhân bị ảnh hưởng bởi thiên tai. Hệ thống hỗ trợ nhiều phương thức thanh toán, bao gồm tiền mặt, chuyển khoản ngân hàng, ví điện tử và thẻ tín dụng.

## Tính năng
- Đăng ký người dùng và xác minh qua OTP.
- Đóng góp từ thiện qua nhiều phương thức.
- Quản lý chiến dịch cứu trợ.
- Phản hồi và đánh giá từ người dùng.
- Theo dõi và báo cáo về các khoản quyên góp.

## Công nghệ sử dụng
- Node.js
- Express.js
- TypeScript
- Sequelize (ORM cho MySQL)

## Hướng dẫn cài đặt

### Prerequisites
- [Node.js](https://nodejs.org/) (>= 14.x)
- [MySQL](https://www.mysql.com/)

### Bước 1: Clone repository
```bash
git clone https://github.com/your-username/charity-donation-backend.git
cd charity-donation-backend
```

### Bước 2: Cài đặt các dependencies
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
```bash
PORT=3000
DB_HOST=localhost
DB_NAME=charity_db
DB_USER=root
DB_PASSWORD=your_db_password
```

### Bước 4: Chạy ứng dụng
# Dev mode
```bash
npm run dev
```

# Prd mode
```bash
npm run build
npm start
```

