import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ChartComponent,
  ApexPlotOptions,
  ApexYAxis,
  ApexNoData
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  // title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  // fill: ApexFill;
  dataLabels: ApexDataLabels;
  // stroke: ApexStroke;
  yaxis: ApexYAxis;
  // markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
  // 
  noData: ApexNoData;
};

@Component({
  selector: 'app-xrl-graph-radar',
  templateUrl: './xrl-graph-radar.component.html',
  styleUrls: ['./xrl-graph-radar.component.scss']
})
export class XrlGraphRadarComponent implements OnInit, OnChanges {

  @ViewChild("chart") chart!: ChartComponent;

  @Input({ required: true }) actualXrl!: AssessmentModel | null;
  @Input() newXrl?: AssessmentModel;
  @Input() scale: number = 1; // Important: Keep this ration 8:5

  private dimensions = {width: 400, height: 250};

  public switchLabel:boolean = true

  public ApexOptions: ChartOptions = {
    chart: {
      type: 'radar',
      width:  this.dimensions.width * this.scale + 'px',
      height: this.dimensions.height * this.scale + 'px',
      toolbar: {
        show: true,
        tools: {
          customIcons: [{
            icon: '<img src="assets/icons/1-square.svg"/>',
            index: 1,
            title: 'Switch Labels',
            class: 'switch-chart-labels-icon',
            click: () => {
              this.switchLabels();
            }
          }],
        }
      },
      events: {
        markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config}) {

          let selectedReadinessLevel = chartContext.axes.w.config.xaxis.categories[dataPointIndex];
          console.log(selectedReadinessLevel)
          // Find the readiness level of the point clicked by the user

        }
      }
    },
    plotOptions: {
      radar: {
        size: this.dimensions.height * this.scale * 0.4,
        polygons: {
          fill: {
            colors: ["#f0f0f0", "#fff"]
          }
        }
      }
    },
    dataLabels: {
      enabled: this.switchLabel, // enable to show the value of each point
    },
    series: [],
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000']
        }
      }
    },
    yaxis: {
      show: false,
      min: 0,
      max: 9,
    },
    noData:{
      text: 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '2rem',
        fontFamily: undefined
      }
    }
  };

  ngOnInit(): void {
    if (this.actualXrl === null) {
      return;
    }
    this.ApexOptions = this.setChartParameters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      if (changes['actualXrl'] || changes['newXrl']) {
        this.chart.updateSeries(this.getData().chartData);
        this.ApexOptions = this.setChartParameters();
        this.chart.updateOptions(this.ApexOptions);
      }
      else if (changes['scale']) {
        this.ApexOptions = this.setChartParameters();
        this.chart.updateOptions(this.ApexOptions);
      }
    }
  }

  getData(): {chartLabels: string[], chartData: {data: number[], name: string}[]} {
    // If there is no actual XRL, return empty data
    if (this.actualXrl === null || this.actualXrl === undefined) {
      return {chartLabels: [], chartData: []};
    }

    // Get the data of the actual XRL
    let actualXrlData: { [label: string]: number } = {}
    this.actualXrl.readinessLevelRanks.forEach((readinessLevelRank) => {
      actualXrlData[readinessLevelRank.readinessLevel.name] = readinessLevelRank.rank
    });

    // If there is no new XRL, return the data of the actual XRL
    if (this.newXrl === undefined) {
      return {
        chartLabels: Object.keys(actualXrlData),
        chartData: [{data: Object.values(actualXrlData), name: this.actualXrl.date.toLocaleDateString('en-GB')}]
      };
    } 
    // Else, return the data of the actual and new XRL
    else {

      // Get the data of the new XRL
      let newXrlData: { [label: string]: number } = {}
      this.newXrl.readinessLevelRanks.forEach((readinessLevelRank) => {
        newXrlData[readinessLevelRank.readinessLevel.name] = readinessLevelRank.rank
      });

      // Verify if the labels of the actual and new XRL are the same and in the same order
      // If so, return the data of the actual and new XRL
      if (Object.keys(actualXrlData) === Object.keys(newXrlData)) {
        return {
          chartLabels: Object.keys(actualXrlData),
          chartData: [
            {data: Object.values(actualXrlData), name: this.actualXrl.date.toLocaleDateString('en-GB')},
            {data: Object.values(newXrlData), name: this.newXrl.date.toLocaleDateString('en-GB')}
          ]
        };
      }

      // Else, return the data of the actual and new XRL with the labels in the same order, without duplicates and with reordered data
      const mergedChartLabels: string[] = [...new Set([...Object.keys(actualXrlData), ...Object.keys(newXrlData)])];
      let mergedActualXrlData: { [label: string]: number } = {}
      let mergedNewXrlData: { [label: string]: number } = {}

      mergedChartLabels.forEach(label => {
        // If the label is in the actual XRL, add it to the merged actual XRL data
        if (label in actualXrlData) {
          mergedActualXrlData[label] = actualXrlData[label];
        }
        // Else, add it to the merged actual XRL data with a value of 0
        else {
          mergedActualXrlData[label] = 0;
        }
        // If the label is in the new XRL, add it to the merged new XRL data
        if (label in newXrlData) {
          mergedNewXrlData[label] = newXrlData[label];
        }
        // Else, add it to the merged new XRL data with a value of 0
        else {
          mergedNewXrlData[label] = 0;
        }
      });

      return {
        chartLabels: mergedChartLabels,
        chartData: [
          {data: Object.values(mergedActualXrlData), name: this.actualXrl.date.toLocaleDateString('en-GB')},
          {data: Object.values(mergedNewXrlData), name: this.newXrl.date.toLocaleDateString('en-GB')}
        ]
      };
    }
  }

  setChartParameters(): ChartOptions {
    return {
      chart: {
        type: 'radar',
        width:  this.dimensions.width * this.scale + 'px',
        height: this.dimensions.height * this.scale + 'px',
        toolbar: {
          show: true,
          tools: {
            customIcons: [{
              icon: '<img src="assets/icons/1-square.svg"/>',
              index: 1,
              title: 'Switch Labels',
              class: 'switch-chart-labels-icon',
              click: () => {
                this.switchLabels();
              }
            }],
          }
        },
        events: {
          markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config}) {
  
            let selectedReadinessLevel = chartContext.axes.w.config.xaxis.categories[dataPointIndex];
            console.log(selectedReadinessLevel)
            // Find the readiness level of the point clicked by the user
  
          }
        }
      },
      plotOptions: {
        radar: {
          size: this.dimensions.height * this.scale * 0.4,
          polygons: {
            fill: {
              colors: ["#f0f0f0", "#fff"]
            }
          }
        }
      },
      dataLabels: {
        enabled: this.switchLabel, // enable to show the value of each point
      },
      series: this.getData().chartData,
      xaxis: {
        categories: this.getData().chartLabels,
        labels: {
          style: {
            colors: ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000']
          }
        }
      },
      yaxis: {
        show: false,
        min: 0,
        max: 9,
      },
      noData:{
        text: 'No data available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '2rem',
          fontFamily: undefined
        }
      }
    };
  }

  switchLabels() {
    this.switchLabel = !this.switchLabel;
    this.chart.updateOptions({
      dataLabels: {
        enabled: this.switchLabel
      }
    })
  }

}
