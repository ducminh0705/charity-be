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

- npm install

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.14.0)
- [MySQL](https://www.mysql.com/)

### Cấu hình biến môi trường

PORT=5002
DB_HOST=localhost
DB_NAME=charity_db
DB_USER=root
DB_PASSWORD=your_db_password
TWILIO_ACCOUNT_SID = your_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN = your_TWILIO_AUTH_TOKEN
TWILIO_CLIENT_VERIFY_V2_SERVICES = your_TWILIO_CLIENT_VERIFY_V2_SERVICES
JWT_SECRET= 'your_JWT_SECRET'

### Dev mode

```bash
npm run dev
```

### Prd mode

```bash
npm run build
npm start
```
