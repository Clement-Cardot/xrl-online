import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';
import * as ApexCharts from 'apexcharts';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ChartComponent,
  ApexStroke,
  ApexPlotOptions,
  ApexYAxis,
  ApexMarkers
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  // fill: ApexFill;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-xrl-graph-radar',
  templateUrl: './xrl-graph-radar.component.html',
  styleUrls: ['./xrl-graph-radar.component.scss']
})
export class XrlGraphRadarComponent implements OnInit{

  @ViewChild('chart') chart: ChartComponent | undefined;

  @Input({ required: true }) actualXrl!: AssessmentModel;
  @Input() newXrl?: AssessmentModel;

  public chartOptions: ApexChart = {
    type: 'radar',
    width: '400px',
    height: '400px',
    toolbar: {
      show: true,
    },
    events: {
      markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config}) {

        let selectedReadinessLevel = chartContext.axes.w.config.xaxis.categories[dataPointIndex];
        console.log(selectedReadinessLevel)
        // Find the readiness level of the point clicked by the user

      }
    }
  };

  public chartOptionsDisabled: ApexChart = {
    type: 'radar',
    width: '400px',
    height: '400px',
    toolbar: {
      show: false,
    },
    events: {
      markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config}) {

        let selectedReadinessLevel = chartContext.axes.w.config.xaxis.categories[dataPointIndex];
        console.log(selectedReadinessLevel)
        // Find the readiness level of the point clicked by the user

      }
    }
  };

  public plotOptions: ApexPlotOptions = {
    radar: {
      size: 140,
      polygons: {
        fill: {
          colors: ["#f0f0f0", "#fff"]
        }
      }
    }
  };

  public dataLabels: ApexDataLabels = {
    enabled: true, // enable to show the value of each point
  };

  public dataLabelsDisable: ApexDataLabels = {
    enabled: false, // enable to show the value of each point
  };

  public series: ApexAxisChartSeries = [];

  public xaxis: ApexXAxis = {};

  public yaxis: ApexYAxis = {
    show: true,
    min: 0,
    max: 9,
    labels: {
      offsetY: -2,
      formatter: function(val: number, i: number): string {
        if (i % 2 === 0) {
          return val.toString();
        } else {
          return '';
        }
      }
    },
  };

  public yaxisDisabled: ApexYAxis = {
    show: false,
    min: 0,
    max: 9,
  };

  public chartInstance : ApexCharts | undefined;

  ngOnInit(): void {
    this.series = this.getChartData();
    this.xaxis = {
      categories: this.getChartLabels(),
    }
  }

  getChartLabels(): string[] {
    const actualXrlLabels: string[] = this.actualXrl.readinessLevels.map((readinessLevel) => readinessLevel.readinessLevel.name);
    if (this.newXrl === undefined) {
      return actualXrlLabels;
    }
    else {
      const newXrlLabels: string[] = this.newXrl.readinessLevels.map((readinessLevel) => readinessLevel.readinessLevel.name);
      if (actualXrlLabels === newXrlLabels) {
        return actualXrlLabels;
      }
      else {
        return [...new Set([...actualXrlLabels, ...newXrlLabels])]
      }
    }
  }

  getChartData(): {data: number[], name: string}[] {
    const actualXrlData: number[] = this.actualXrl.readinessLevels.map((readinessLevel) => readinessLevel.rank);
    if (this.newXrl === undefined) {
      return [{data: actualXrlData, name: this.actualXrl.tag}];
    }
    else {
      const newXrlData: number[] = this.newXrl.readinessLevels.map((readinessLevel) => readinessLevel.rank);
      if (actualXrlData === newXrlData) {
        return [{data: actualXrlData, name: this.actualXrl.tag}];
      }
      else {
        return [
          {data: actualXrlData, name: this.actualXrl.tag},
          {data: newXrlData, name: this.newXrl.tag}
        ]
      }
    }
  }

  async downloadChartAsPNG(chartId: string) {
    if (this.chart === undefined) {
      return;
    }
    const chartInstance = this.chart;
    // console.log("chartInstance ", chartInstance);
    const base64 = await chartInstance.dataURI();
    // console.log("base 64", base64.imgURI);
    const downloadLink = document.createElement("a");
    downloadLink.href = base64.imgURI;
    downloadLink.download = "image.png";

    // Add the anchor element to the document
    document.body.appendChild(downloadLink);

    // Simulate a click event to initiate the download
    downloadLink.click();

    // Remove the anchor element from the document
    document.body.removeChild(downloadLink);
  }
}
