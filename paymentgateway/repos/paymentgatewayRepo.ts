import paymentgatewayModel from '../models/paymentgatewayModel';

export class PaymentgatewayRepo {
  async findPaymentgatewayByName(paymentGatewayName: string): Promise<{ _id: string } | null> {
    return await paymentgatewayModel
      .findOne({ paymentGatewayName, isActive: true, isDeleted: false })
      .select({ _id: 1 })
      .lean();
  }
}
