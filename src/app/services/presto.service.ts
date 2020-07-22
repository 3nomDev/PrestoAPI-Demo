import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { Customer } from '../models/customer';
import { Supplier } from '../models/supplier';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PrestoService {
  user = new BehaviorSubject<User>(null);
  uid = sessionStorage.getItem('uid');
  projectBase = 'https://demo.prestoapi.com/api/';

  constructor(private http: HttpClient) {
    // Get the current user on every page reload
    this.fetchUser();
  }

  /* Note: The following methods use promises instead of subscriptions to avoid potential memory leaks */

  /* Data Services */
  // Orders
  getOrders() {
    return this.http
      .get<Order[]>(this.projectBase + 'orders')
      .toPromise()
      .catch(this.handleError);
  }
  createOrder(o: Order) {
    delete o.Id; //Identity Column
    delete o.edit;
    return this.http
      .post<Order>(this.projectBase + 'orders-protected', o, this.getToken())
      .toPromise()
      .catch(this.handleError);
  }
  updateOrder(o: Order) {
    const id = o.Id;
    delete o.Id;
    delete o.edit;
    return this.http
      .put<Order>(
        this.projectBase + 'orders-protected/' + id,
        o,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }
  deleteOrder(o: Order) {
    return this.http
      .delete<Order>(
        this.projectBase + 'orders-protected/' + o.Id,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }

  // Suppliers
  getSuppliers() {
    return this.http
      .get<Supplier[]>(this.projectBase + 'suppliers')
      .toPromise()
      .catch(this.handleError);
  }
  createSupplier(s: Supplier) {
    delete s.Id; //Identity Column
    delete s.edit;
    return this.http
      .post<Supplier>(
        this.projectBase + 'suppliers-protected',
        s,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }
  updateSupplier(s: Supplier) {
    const id = s.Id;
    delete s.Id;
    delete s.edit;
    return this.http
      .put<Supplier>(
        this.projectBase + 'suppliers-protected/' + id,
        s,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }
  deleteSupplier(s: Supplier) {
    return this.http
      .delete<Supplier>(
        this.projectBase + 'suppliers-protected/' + s.Id,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }

  //Customers
  getCustomers() {
    return this.http
      .get<Customer[]>(this.projectBase + 'customers')
      .toPromise()
      .catch(this.handleError);
  }
  createCustomer(c: Customer) {
    delete c.Id; //Identity Column
    delete c.edit;
    return this.http
      .post<Customer>(
        this.projectBase + 'customers-protected',
        c,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }
  updateCustomer(c: Customer) {
    const id = c.Id;
    delete c.Id;
    delete c.edit;
    return this.http
      .put<Customer>(
        this.projectBase + 'customers-protected/' + id,
        c,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }
  deleteCustomer(c: Customer) {
    return this.http
      .delete<Customer>(
        this.projectBase + 'customers-protected/' + c.Id,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }

  // Products
  getProducts() {
    return this.http
      .get<Product[]>(this.projectBase + 'products', this.getToken())
      .toPromise()
      .catch(this.handleError);
  }
  createProduct(p: Product) {
    delete p.Id; //Identity Column
    delete p.edit;
    delete p.CompanyName;
    return this.http
      .post<Product>(
        this.projectBase + 'products-protected',
        p,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }
  updateProduct(p: Product) {
    const id = p.Id;
    delete p.Id;
    delete p.edit;
    delete p.CompanyName;
    return this.http
      .put<Product>(
        this.projectBase + 'products-protected/' + id,
        p,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }
  deleteProduct(p: Product) {
    return this.http
      .delete<Product>(
        this.projectBase + 'products-protected/' + p.Id,
        this.getToken()
      )
      .toPromise()
      .catch(this.handleError);
  }

  // Dashboard
  getPieChart() {
    return this.http
      .get<{ Country: string; Count: number }[]>(this.projectBase + 'pie-chart')
      .toPromise()
      .catch(this.handleError);
  }
  getSuppliersSales() {
    return this.http
      .get<Supplier[]>(this.projectBase + 'supplier-sales')
      .toPromise()
      .catch(this.handleError);
  }
  getDashCounts(): Promise<{
    Orders: number;
    Customers: number;
    Suppliers: number;
    TotalAmount: number;
  }> {
    return this.http
      .get(this.projectBase + 'dash-counts')
      .pipe(map((data) => data[0]))
      .toPromise()
      .catch(this.handleError);
  }

  /* Auth Services */
  async fetchUser() {
    if (!this.uid) return;
    let user = await this.http
      .get<User>(this.projectBase + 'account/' + this.uid, this.getToken())
      .toPromise()
      .catch(this.handleError);
    user = this.formatPhoto(user);
    this.user.next(user);
  }
  formatPhoto(user: User) {
    if (user && user.metadata) {
      const meta = JSON.parse(user.metadata);
      if (meta && meta.photo) user.photo = meta.photo;
    }
    return user;
  }
  get getCurrentUser() {
    return this.user.value;
  }
  getToken() {
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: 'Bearer ' + token },
    };
  }
  register(user: User) {
    user.metadata = JSON.stringify(user.metadata);
    return this.http.post(this.projectBase + 'register', user).toPromise();
  }
  async login(model: User) {
    let user = await this.http
      .post<User>(this.projectBase + 'login', model)
      .toPromise();
    sessionStorage.setItem('uid', user.uid);
    sessionStorage.setItem('token', user.token);
    user = this.formatPhoto(user);
    this.user.next(user);
  }
  signOut() {
    this.user.next(null);
    sessionStorage.clear();
  }

  handleError(error: HttpErrorResponse) {
    console.error(error.error);
    return Promise.reject(error.error);
  }
}
