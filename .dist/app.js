"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const donationRoutes_1 = __importDefault(require("./routes/donationRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const paymentInfoRoutes_1 = __importDefault(require("./routes/paymentInfoRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const database_1 = __importDefault(require("./config/database"));
// Sync all models
database_1.default.sync({ alter: false })
    .then(() => {
    console.log('Database & tables created!');
})
    .catch((error) => {
    console.error('Unable to create tables:', error);
});
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('', authRoutes_1.default);
app.use('/donations', donationRoutes_1.default);
app.use('/campaigns', campaignRoutes_1.default);
app.use('/reports', reportRoutes_1.default);
app.use('/expenses', expenseRoutes_1.default);
app.use('/payment-info', paymentInfoRoutes_1.default);
app.use('/feedbacks', feedbackRoutes_1.default);
exports.default = app;
