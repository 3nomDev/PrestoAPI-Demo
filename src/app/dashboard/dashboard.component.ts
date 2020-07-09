import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Chart from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor() {}
  @ViewChild('pieChart') pieElement: ElementRef;
  @ViewChild('barChart') barElement: ElementRef;
  @ViewChild('lineChart') lineElement: ElementRef;

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.initPie();
    this.initBar();
    this.initLine();
  }

  initPie() {
    var pieChart = new Chart(this.pieElement.nativeElement, {
      type: 'pie',
      data: this.sampleData,
      options: this.sampleOptions,
    });
  }
  initBar() {
    var pieChart = new Chart(this.barElement.nativeElement, {
      type: 'bar',
      data: this.sampleData,
      options: this.sampleOptions,
    });
  }

  initLine() {
    var pieChart = new Chart(this.lineElement.nativeElement, {
      type: 'line',
      data: this.sampleData,
      options: this.sampleOptions,
    });
  }

  sampleData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  sampleOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
}
