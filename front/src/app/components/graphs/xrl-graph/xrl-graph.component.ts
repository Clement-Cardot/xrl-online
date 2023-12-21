import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType, Plugin } from 'chart.js';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { Options } from 'chartjs-plugin-datalabels/types/options';

export interface XrlGraphOptions {
  /**
   * Show legend
   * @default false
   */
  legend?: boolean;
  /**
   * Show download button
   * @default false
   */
  download?: boolean;
}

@Component({
  selector: 'app-xrl-graph',
  templateUrl: './xrl-graph.component.html',
  styleUrls: ['./xrl-graph.component.scss']
})
export class XrlGraphComponent implements OnInit, OnChanges {

  @ViewChild("chart") chart!: ElementRef;

  @Input({ required: true }) assesment!: AssessmentModel | null;
  @Input({ required: false }) compareAssesment?: AssessmentModel;
  @Input({ required: false }) options?: XrlGraphOptions;
  @Input({ required: false }) isCompare?: boolean;

  @Output() labelClickEvent = new EventEmitter<string>();

  public radarChartOptions: ChartConfiguration['options'];

  private datalabels: Options = {
    backgroundColor: "white",
    borderRadius: 100,
    borderColor: "black",
    borderWidth: 1,
    color: "black",
    padding: {
      top: 2,
      bottom: 1,
      left: 2,
      right: 2,
    },
    font: (context: Context) => {
      if (context.active) {
        return {
          size: 18,
          weight: "bold",
        }
      } else {
        return {
          size: 14,
          weight: "bold",
        }
      }
    },
    listeners: {
      click: (context: Context) => {
        this.labelClickEvent.emit(this.assesment?.readinessLevelRanks[context.dataIndex].readinessLevel.name);
      }
    },
    offset: -8,
    align: "start",
  }

  public radarChartData?: ChartData<'radar'>;
  public radarChartType: ChartType = 'radar';
  public radarChartPlugins: Plugin = ChartDataLabels;
  private title: string | undefined;
  private compareTitle: string | undefined;

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assesment'] || changes['compareAssesment']) {
      this.updateChart();
    }
  }

  updateChart() {
    this.setRadarChartsOptions();
    this.setLabelsAndValues();
  }

  setRadarChartsOptions() {
    const labelClickEvent = this.labelClickEvent;
    this.radarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 9,
          ticks: {
            stepSize: 1,
            display: false,
          },
          angleLines: {
            borderDash: [3, 3],
            color: "rgba(0,0,0,0.4)"
          },
          grid: {
            borderDash: [3, 3],
            circular: true,
            color: "rgba(0,0,0,0.4)"
          },
          pointLabels: {
            font: {
              size: 12
            },
            //padding: 0,
          },
        },
      },
      onHover(event, elements, chart) {
        const canvas = chart.canvas;
        const r = (chart.scales['r'] as any);
        const index = isClickInLabels(event, r['_pointLabelItems']);
  
        if (index != -1) {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'default';
        }
      },
      onClick(event, elements, chart) {
        const r = (chart.scales['r'] as any);
        const index = isClickInLabels(event, r['_pointLabelItems']);
  
        if (index != -1) {
          const label = chart.data.labels![index] as string;
          labelClickEvent.emit(label);
        }
      },
      plugins: {
        datalabels: this.datalabels,
        legend: {
          display: this.options?.legend ?? false,
        },
      }
    };
  }

  setLabelsAndValues() {
    if (this.assesment == null || this.assesment == undefined) return;

    let labels;
    let values: (number | null)[] = [];
    let compareValues: (number | null)[] = [];
    if (this.compareAssesment) {
      const setLabels = new Set<string>([
        ...this.assesment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name),
        ...this.compareAssesment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name)]);
      labels = Array.from(setLabels);

      setLabels.forEach((label: string) => {
        values.push(this.assesment?.readinessLevelRanks.find((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name == label)?.rank ?? null);
        compareValues.push(this.compareAssesment?.readinessLevelRanks.find((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name == label)?.rank ?? null);
      })
    } else {
      labels = this.assesment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name);
      values = this.assesment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.rank);
    }

    this.compareTitle = "Last (" + this.compareAssesment?.date.toLocaleDateString() + ")";
    this.title = compareValues ? "New (" + this.assesment.date.toLocaleDateString() + ")" : this.assesment.date.toLocaleDateString();

    if (this.isCompare) {
      this.compareTitle = this.compareAssesment?.date.toLocaleDateString();
      this.title = this.assesment.date.toLocaleDateString();
    }

    this.radarChartData = {
      labels: labels,
      datasets: [
        {
          //data: [9,9,9,9,9],
          data: values,
          label: this.title,
          pointRadius: 7,
          pointHoverRadius: 7,
        },
      ],
    };
    if (this.compareAssesment) {
      this.radarChartData.datasets.push({
        data: compareValues,
        label: this.compareTitle,
      })
    } else {
      this.radarChartData.datasets[0].backgroundColor = this.createRadialGradient;
      this.radarChartData.datasets[0].borderColor = "black";
      this.radarChartData.datasets[0].borderWidth = 1;
    }
  }

  createRadialGradient(context: any, options: any) {
    const chart: Chart = context.chart;
    const ctx = chart.ctx;
    const area = chart.chartArea;
    if (ctx && area) {
      area.height += area.top;
      const r = (chart.scales['r'] as any)
      //console.log(r);
      const gradient = ctx.createRadialGradient(r.xCenter, r.yCenter, 0, r.xCenter, r.yCenter, r.drawingArea);
      gradient.addColorStop(0, "rgba(190,21,34,0.6)");
      gradient.addColorStop(0.11, "rgba(191,20,34,0.6)");
      gradient.addColorStop(0.22, "rgba(191,20,34,0.6)");
      gradient.addColorStop(0.33, "rgba(204,63,33,0.6)");
      gradient.addColorStop(0.44, "rgba(247,166,33,0.6)");
      gradient.addColorStop(0.55, "rgba(248,225,30,0.6)");
      gradient.addColorStop(0.66, "rgba(173,202,32,0.6)");
      gradient.addColorStop(0.77, "rgba(58,171,52,0.6)");
      gradient.addColorStop(0.88, "rgba(58,171,52,0.6)");
      gradient.addColorStop(0.99, "rgba(58,171,52,0.6)");
      gradient.addColorStop(1, "rgba(58,171,52,0.6)");

      return gradient;
    } else {
      return "white";
    }
  }

  exportGraph() {
    const canvas = this.chart.nativeElement as HTMLCanvasElement;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = "xrl-graph.png";
    link.href = image;
    link.click();
  }

  ngAfterViewInit() {
    if (this.options?.download && this.assesment != null) {
      this.addDownloadButton();
    }
  }

  addDownloadButton() {
    const chartContainer = this.chart.nativeElement.parentElement;

    const downloadButton = document.createElement('div');
    downloadButton.innerHTML = '<i class="fa fa-download"></i>';

    downloadButton.style.position = 'absolute';
    downloadButton.style.top = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.zIndex = '1000';
    downloadButton.style.fontSize = '18px';

    chartContainer.appendChild(downloadButton);

    downloadButton.addEventListener('click', () => {
      this.exportGraph();
    });
  }

}

function isClickInLabels(event: ChartEvent, pointsLabels: any[]) {
  let index = -1;
  for (let i = 0; i < pointsLabels.length; i++) {
    const { top, left, right, bottom } = pointsLabels[i];

    if (event.x! >= left && event.x! <= right && event.y! >= top && event.y! <= bottom) {
      index = i;
      break;
    }
  }
  return index;
}