import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class PrestoService {
  user = new BehaviorSubject<User>(null);
  projectBase = 'https://demo.prestoapi.com/api/';
  uid = sessionStorage.getItem('uid');

  constructor(private http: HttpClient) {
    if (this.uid)
      this.fetchUser().then((user) => {
        if (user) this.user.next(user);
      });
  }

  /* Data Services */

  // Orders
  getOrders() {
    return this.http.get<Order[]>(this.projectBase + 'orders').toPromise();
  }
  createOrder(o: Order) {
    delete o.Id //Identity Column
    return this.http
      .post<Order>(this.projectBase + 'orders-protected', o, this.getToken())
      .toPromise();
  }
  updateOrder(o: Order) {
    const id = o.Id;
    delete o.Id;
    delete o.edit;
    return this.http
      .put<Order>(this.projectBase + 'orders-protected/' + id, o, this.getToken())
      .toPromise();
  }
  deleteOrder(o: Order) {
    return this.http
      .delete<Order>(this.projectBase + 'orders-protected/' + o.Id, this.getToken())
      .toPromise();
  }

  getInvoices() {
    return this.http.get(this.projectBase + 'invoices').toPromise();
  }
  getShipment() {
    return this.http.get(this.projectBase + 'shipment').toPromise();
  }
  getVendors() {
    return this.http.get(this.projectBase + 'vendors').toPromise();
  }
  getCustomers() {
    return this.http.get(this.projectBase + 'customers').toPromise();
  }

  // Products
  getProducts() {
    return this.http.get<Product[]>(this.projectBase + 'products').toPromise();
  }
  createProduct(p: Product) {
    return this.http
      .post<Product>(this.projectBase + 'products', p, this.getToken())
      .toPromise();
  }
  updateProduct(p: Product) {
    return this.http
      .put<Product>(this.projectBase + 'products', p, this.getToken())
      .toPromise();
  }
  deleteProduct(p: Product) {
    return this.http
      .delete<Product>(this.projectBase + 'products/' + p, this.getToken())
      .toPromise();
  }

  /* Auth Services */
  fetchUser() {
    return this.http
      .get<User>(this.projectBase + 'account/' + this.uid, this.getToken())
      .toPromise();
  }
  get getCurrentUser() {
    return this.user.value;
  }
  getToken() {
    // const expiresIn =  sessionStorage.getItem('expiresIn');
    const token = sessionStorage.getItem('token');
    return {
      headers: { Authorization: 'Bearer ' + token },
    };
  }
  register(user: User) {
    return this.http.post(this.projectBase, user).toPromise();
  }
  async login(model) {
    const user = await this.http
      .post<User>(this.projectBase + 'login', model)
      .toPromise();
    sessionStorage.setItem('uid', user.uid);
    sessionStorage.setItem('token', user.token);
    // sessionStorage.setItem(
    //   'expiresIn',
    //   moment().add(120, 'minutes').toString()
    // );
    this.user.next(user);
  }
  signOut() {
    this.user.next(null);
    sessionStorage.clear();
  }
}
