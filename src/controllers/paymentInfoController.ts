import { Request, Response } from 'express';

export const getPaymentInfo = async (req: Request, res: Response) => {
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
};
