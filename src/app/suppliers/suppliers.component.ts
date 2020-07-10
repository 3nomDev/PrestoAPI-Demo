import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Supplier } from '../models/supplier';
import { PrestoService } from '../services/presto.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css'],
})
export class SuppliersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<Supplier>;
  loading = true;
  displayedColumns: string[] = [
    'Id',
    'CompanyName',
    'ContactName',
    'ContactTitle',
    'City',
    'Country',
    'Phone',
    'Fax',
    'Buttons',
  ];

  constructor(private ps: PrestoService) {}

  ngOnInit() {
    this.getSuppliers();
  }

  async getSuppliers() {
    const suppliers = await this.ps.getSuppliers();
    this.dataSource = new MatTableDataSource(suppliers || []);
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
    this.dataSource.filter = '';
    this.dataSource.paginator.firstPage();
    //this.dataSource.data isn't directly mutable
    const arr = this.dataSource.data;
    arr.unshift(new Supplier());
    this.dataSource.data = arr;
  }
  async save(o: Supplier) {
    o.edit = false;
    if (o.Id) await this.ps.updateSupplier(o);
    else await this.ps.createSupplier(o);
    this.ngOnInit();
  }
  delete(o: Supplier) {
    this.dataSource.data = this.dataSource.data.filter((d) => d.Id != o.Id);
    return this.ps.deleteSupplier(o);
  }
  cancel(o: Supplier) {
    o.edit = false;
    this.ngOnInit();
  }
}
