"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentInfo = void 0;
const getPaymentInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Giả sử bạn lưu thông tin trong biến môi trường hoặc tệp cấu hình
    const paymentInfo = {
        cashAddress: 'Địa chỉ nhận tiền mặt: Số 123 Đường ABC, Quận XYZ, Thành phố HCM',
        bankTransfer: {
            accountNumber: '123456789',
            accountName: 'Quỹ Từ Thiện ABC',
            bankName: 'Ngân hàng XYZ',
            qrCodeUrl: 'https://example.com/bank-qr-code.png',
        },
        eWallet: {
            momo: {
                phoneNumber: '0901234567',
                qrCodeUrl: 'https://example.com/momo-qr-code.png',
            },
            zalopay: {
                phoneNumber: '0901234567',
                qrCodeUrl: 'https://example.com/zalopay-qr-code.png',
            },
        },
    };
    res.status(200).json(paymentInfo);
});
exports.getPaymentInfo = getPaymentInfo;
