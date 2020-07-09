export class Order {
  Id: number;
  OrderDate: string;
  OrderNumber: string;
  CustomerId: number;
  TotalAmount: number;
  edit = false;
  constructor() {
    this.edit = true;
  }
}
