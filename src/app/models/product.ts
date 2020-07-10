export class Product {
  Id: number;
  ProductName: string;
  SupplierId: number;
  UnitPrice: number;
  Package: string;
  IsDiscontinued: boolean;
  DateAdded: string;
  LastUpdated: string;
  Quantity: number;  
  CompanyName?: string;
  edit = false;
  constructor() {
    this.edit = true;
  }
}
