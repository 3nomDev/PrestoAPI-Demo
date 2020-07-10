export class OrderItem {
  Id: number;
  OrderId: number;
  ProductId: number;
  UnitPrice: number;
  Quantity: number;
  edit=false;
  constructor() {
    this.edit = true;
  }
}
