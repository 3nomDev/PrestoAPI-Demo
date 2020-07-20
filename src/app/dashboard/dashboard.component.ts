import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import { PrestoService } from '../services/presto.service';
import { CurrencyPipe } from '@angular/common';
import { scan, takeWhile, delay, map } from 'rxjs/operators';
import { timer, Observable, BehaviorSubject } from 'rxjs';
import { Order } from '../models/order';
import { Customer } from '../models/customer';
import { Supplier } from '../models/supplier';
import { Product } from '../models/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [CurrencyPipe],
})
export class DashboardComponent implements OnInit {
  @ViewChild('pieChart') pieElement: ElementRef;
  @ViewChild('barChart') barElement: ElementRef;
  @ViewChild('lineChart') lineElement: ElementRef;
  orders$ = new BehaviorSubject<number>(0);
  customers$ = new BehaviorSubject<number>(0);
  suppliers$ = new BehaviorSubject<number>(0);
  totalAmount$ = new BehaviorSubject<number>(0);
  loading: boolean[] = new Array(5).fill(true);
  orders: Order[];
  orderColumns: string[];
  customers: Customer[];
  customerColumns: string[];
  suppliers: Supplier[];
  supplierColumns: string[];
  products: Product[];
  productColumns: string[];

  constructor(private ps: PrestoService, private cp: CurrencyPipe) {}

  ngOnInit() {
    this.startCounters();
    this.getTotalCounts();
    this.getCustomers();
    this.getSuppliers();
    this.getProducts();
  }

  ngAfterViewInit() {
    this.initPie();
    this.initLine();
  }

  async getTotalCounts() {
    this.counts = await this.ps.getDashCounts();
    this.stopCounters();
  }

  async getCustomers() {
    this.customers = await this.ps.getCustomers();
    if (this.customers) {
      this.customerColumns = Object.keys(this.customers[0]);
      this.customers.reverse().length = 10;
    }
    this.loading[3] = false;
  }

  async getSuppliers() {
    this.suppliers = await this.ps.getSuppliersSales();
    if (this.suppliers) {
      this.suppliers.length = 10;
      this.supplierColumns = Object.keys(this.suppliers[0]);
    }
    this.loading[4] = false;
  }

  async getProducts() {
    this.products = await this.ps.getProducts();
    if (this.products) {
      this.productColumns = [
        'Id',
        'ProductName',
        'SupplierId',
        'CompanyName',
        'Quantity',
      ];
      this.products.sort((a, b) => a.Quantity - b.Quantity).length = 10;
    }
    this.loading[5] = false;
  }

  async initPie() {
    const data = await this.ps.getPieChart();
    if (!data) return;
    const formatted = this.formatCountries(data);
    new Chart(this.pieElement.nativeElement, {
      type: 'pie',
      data: {
        labels: formatted.countries,
        datasets: [
          {
            data: formatted.counts,
            backgroundColor: this.backgroundColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: { align: 'start' },
        title: {
          display: true,
          text: 'Orders By Country',
        },
      },
    });
    this.loading[0] = false;
  }

  async initLine() {
    this.orders = await this.ps.getOrders();
    if (!this.orders) return;
    this.orderColumns = Object.keys(this.orders[0]);
    const formatted = this.formatDates();
    new Chart(this.lineElement.nativeElement, {
      type: 'line',
      data: {
        labels: formatted.dates,
        datasets: [
          {
            data: formatted.values,
            backgroundColor: '#aad5f2',
            pointBackgroundColor: '#479bff',
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                // Angular's Currency Pipe!
                callback: (value) => this.cp.transform(value),
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: (item) => this.cp.transform(item.yLabel),
          },
        },
        legend: { display: false },
        title: {
          display: true,
          text: 'Total Sales Revenue',
        },
      },
    });
    this.loading[1] = false;
    this.orders.reverse().length = 10;
    this.loading[2] = false;
  }

  formatDates() {
    // This groups and sums order amounts by date
    const groupedByDate = this.orders.reduce(
      (entryMap, e) =>
        entryMap.set(
          moment(e.OrderDate).format('MMM YY'),
          e.TotalAmount +
            (entryMap.get(moment(e.OrderDate).format('MMM YY')) || 0)
        ),
      new Map()
    );
    return {
      dates: [...groupedByDate.keys()],
      values: [...groupedByDate.values()],
    };
  }

  formatCountries(data: any[]) {
    var countries: string[] = [];
    var counts: number[] = [];
    var otherCount = 0;
    data.forEach((d) => {
      if (d.Count < 100) otherCount += d.Count;
      else {
        countries.push(d.Country);
        counts.push(d.Count);
      }
    });
    countries.push('Other');
    counts.push(otherCount);
    return { countries, counts };
  }

  startCounters() {
    //increasing counters before actual data received
    timer(0, 30)
      .pipe(
        scan((acc) => ++acc, 700),
        takeWhile((x) => x <= this.counts.Orders)
      )
      .subscribe(this.orders$);
    timer(0, 30)
      .pipe(
        scan((acc) => ++acc, 0),
        takeWhile((x) => x < this.counts.Customers)
      )
      .subscribe(this.customers$);
    timer(0, 30)
      .pipe(
        scan((acc) => ++acc, 0),
        takeWhile((x) => x < this.counts.Suppliers)
      )
      .subscribe(this.suppliers$);
    timer(0, 30)
      .pipe(
        scan((acc) => ++acc, this.counts.TotalAmount - 200),
        takeWhile((x) => x < this.counts.TotalAmount)
      )
      .subscribe(this.totalAmount$);
  }
  stopCounters() {
    // Stop once we get actual values
    this.orders$ = new BehaviorSubject<number>(this.counts.Orders);
    this.customers$ = new BehaviorSubject<number>(this.counts.Customers);
    this.suppliers$ = new BehaviorSubject<number>(this.counts.Suppliers);
    this.totalAmount$ = new BehaviorSubject<number>(this.counts.TotalAmount);
  }

  // Responsive Grid Breakpoints
  breakpoint = window.innerWidth < 480 ? 1 : window.innerWidth < 1000 ? 2 : 4;

  //some sample data for counters
  counts = {
    Orders: 833,
    Customers: 90,
    Suppliers: 28,
    TotalAmount: 1355778,
  };

  backgroundColors = [
    'rgba(255, 99, 132, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(255, 206, 86, 0.4)',
    'rgba(205, 97, 85, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(42, 162, 32, 0.4)',
    'rgba(218, 247, 166, 0.4)',
    'rgba(72, 201, 176, 0.4)',
    'rgba(131, 145, 146, 0.4)',
  ];
}
