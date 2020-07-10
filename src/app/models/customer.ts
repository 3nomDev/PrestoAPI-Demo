export class Customer {
  Id: number;
  FirstName: string;
  LastName: string;
  City: string;
  Country: string;
  Phone: string;
  edit=false;
  constructor() {
    this.edit = true;
  }
}
