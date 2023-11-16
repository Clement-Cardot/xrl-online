import { Component, Input } from '@angular/core';
// import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexLegend, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';

export type ChartOptions = {
  // series: ApexAxisChartSeries;
  // chart: ApexChart;
  // dataLabels: ApexDataLabels;
  // plotOptions: ApexPlotOptions;
  // xaxis: ApexXAxis;
  // colors: string[];
  // legend: ApexLegend;
  // title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-xrl-graph-gauge',
  templateUrl: './xrl-graph-gauge.component.html',
  styleUrls: ['./xrl-graph-gauge.component.scss']
})
export class XrlGraphGaugeComponent {

  @Input({ required: true }) actualXrl!: AssessmentModel;

  public chartOptions: Partial<any> = {} as Partial<any>;

  ngOnInit(): void {
    this.chartOptions = {
      series: [
        {
          name: "",
          data: [1, 1, 1, 2, 1, 1, 1, 1]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          distributed: true,
          barHeight: "80%",
          isFunnel: true
        }
      },
      colors: [
        "#F44F5E",
        "#E55A89",
        "#D863B1",
        "#CA6CD8",
        "#B57BED",
        "#8D95EB",
        "#62ACEA",
        "#4BC3E6"
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val:any, opt:any) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: true
        }
      },
      title: {
        text: "Pyramid Chart",
        align: "center"
      },
      xaxis: {
        categories: [
          "Sweets",
          "Processed Foods",
          "Healthy Fats",
          "Meat",
          "Beans & Legumes",
          "Dairy",
          "Fruits & Vegetables",
          "Grains"
        ]
      },
      legend: {
        show: false
      }
    };
  }

}
