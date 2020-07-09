import { Component, OnInit, ViewChild } from '@angular/core';
import { PrestoService } from '../services/presto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Order } from '../models/order';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<Order>;
  loading = true;
  displayedColumns: string[] = [
    'Id',
    'CustomerId',
    'OrderNumber',
    'OrderDate',
    'TotalAmount',
    'Buttons',
  ];

  constructor(private ps: PrestoService) {}

  ngOnInit() {
    this.getOrders();
  }

  async getOrders() {
    const orders = await this.ps.getOrders();
    this.dataSource = new MatTableDataSource(orders || []);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
  addRow() {
    //this.dataSource.data isn't directly mutable
    const arr = this.dataSource.data;
    arr.unshift(new Order());
    this.dataSource.data = arr;
  }
  save(o: Order) {
    o.edit = false;
    if (o.Id) return this.ps.updateOrder(o);
    return this.ps.createOrder(o);
  }
  delete(o: Order) {
    this.dataSource.data = this.dataSource.data.filter((d) => d.Id != o.Id);
    return this.ps.deleteOrder(o);
  }
  cancel(o: Order) {
    o.edit = false;
    this.ngOnInit();
  }
}
