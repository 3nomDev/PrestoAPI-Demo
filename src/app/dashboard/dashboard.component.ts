import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import { PrestoService } from '../services/presto.service';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [CurrencyPipe],
})
export class DashboardComponent implements OnInit {
  loading = true;
  counts = {
    Orders: 0,
    Customers: 0,
    Suppliers: 0,
    TotalAmount: 0,
  };
  constructor(private ps: PrestoService, private cp: CurrencyPipe) {}
  @ViewChild('pieChart') pieElement: ElementRef;
  @ViewChild('barChart') barElement: ElementRef;
  @ViewChild('lineChart') lineElement: ElementRef;

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.getTotalCounts();
    this.initPie();
    this.initLine();
  }

  async getTotalCounts() {
    const data = (await this.ps.getDashCounts()) || [];
    console.log("data: ",data);
    this.counts = data[0];
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
  }

  async initLine() {
    const data = await this.ps.getOrders();
    if (!data) return;
    const formatted = this.formatDates(data);
    new Chart(this.lineElement.nativeElement, {
      type: 'line',
      data: {
        labels: formatted.dates,
        datasets: [
          {
            data: formatted.values,
            backgroundColor: this.backgroundColors,
            borderWidth: 1,
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
  }

  formatDates(data: any[]) {
    // This groups and sums order amounts by date
    const groupedByDate = data.reduce(
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
