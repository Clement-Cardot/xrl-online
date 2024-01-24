import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexStates,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  states: ApexStates;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-xrl-graph-gauge',
  templateUrl: './xrl-graph-gauge.component.html',
  styleUrls: ['./xrl-graph-gauge.component.scss'],
})
export class XrlGraphGaugeComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  @Input({ required: true }) readinessLevelRank!: ReadinessLevelRankModel;
  @Input() scale: number = 1; // Important: Keep te ratio
  @Input({ required: false }) blockGauge!: boolean;

  @Output() changeRankEvent: EventEmitter<ReadinessLevelRankModel> =
    new EventEmitter<ReadinessLevelRankModel>();

  private dimensions = { width: 80, height: 350 };

  public ApexOptions: ChartOptions = {
    series: [
      {
        name: '',
        data: [1, 1, 1, 2, 1, 1, 1, 1],
      },
    ],
    chart: {
      type: 'bar',
      height: this.dimensions.height * this.scale,
      width: this.dimensions.width * this.scale,
      events: {
        dataPointSelection: (e: any, chart: any, options: any) => {
          this.changeRank(e, chart, options);
        },
      },
      animations: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        distributed: true,
        barHeight: '80%',
        isFunnel: true,
      },
    },
    colors: [
      '#388E3C',
      '#66BB6A',
      '#AED581',
      '#E6EE9C',
      '#FFF59D',
      '#FFCC66',
      '#FFB266',
      '#FF9966',
      '#FF6666',
      '#FFFFFF'
    ],
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opt: any) {
        return opt.w.globals.labels[opt.dataPointIndex];
      },
      dropShadow: {
        enabled: true,
      },
    },
    title: {},
    xaxis: {
      categories: ['', '', '', '', '', '', '', '', '', ''],
    },
    legend: {
      show: false,
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    tooltip: {
      enabled: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="arrow_box">' +
          '<span>' +
          dataPointIndex +
          '</span>' +
          '</div>'
        );
      },
    },
  };

  ngOnInit(): void {
    this.ApexOptions = this.setChartParameters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      if (changes['readinessLevelRank'] || changes['scale']) {
        this.ApexOptions = this.setChartParameters();
        this.chart.updateOptions(this.ApexOptions);
      }
    }
  }

  setChartParameters(): ChartOptions {
    return {
      series: [
        {
          name: '',
          data: this.getRank(),
        },
      ],
      chart: {
        type: 'bar',
        height: this.dimensions.height * this.scale,
        width: this.dimensions.width * this.scale,
        events: {
          dataPointSelection: (e: any, chart: any, options: any) => {
            this.changeRank(e, chart, options);
          },
        },
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          distributed: true,
          barHeight: '80%',
          isFunnel: true,
        },
      },
      colors: [
        '#388E3C',
        '#66BB6A',
        '#AED581',
        '#E6EE9C',
        '#FFF59D',
        '#FFCC66',
        '#FFB266',
        '#FF9966',
        '#FF6666',
        '#FFFFFF'
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opt: any) {
          return opt.w.globals.labels[opt.dataPointIndex];
        },
        dropShadow: {
          enabled: true,
        },
      },
      title: {},
      xaxis: {
        categories: ['', '', '', '', '', '', '', '', '', ''],
      },
      legend: {
        show: false,
      },
      states: {
        active: {
          filter: {
            type: 'none',
          },
        },
      },
      tooltip: {
        enabled: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div class="arrow_box">' +
            '<span>' +
            dataPointIndex +
            '</span>' +
            '</div>'
          );
        },
      },
    };
  }

  getReadinessLevels(): string[] {
    return this.readinessLevelRank.readinessLevel.levels
      .map((level) => level.level)
      .reverse();
  }

  getRank(): number[] {
    let rankIndex = this.readinessLevelRank.rank - 1;
    let array = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    array[rankIndex] = 1.5;
    return array.reverse();
  }

  changeRank(e: any, chart: any, options: any): void {
    if (!this.blockGauge) {
      let newRank = 10 - (options.dataPointIndex + 1);
      this.readinessLevelRank.rank = newRank;
      this.changeRankEvent.emit(this.readinessLevelRank);
      this.chart.updateSeries([{ data: this.getRank() }]);
    }
  }
}
