import { ReadinessLevelRankModel } from 'src/app/core/data/models/readiness-level-rank.model';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActiveElement, Chart, ChartConfiguration, ChartData, ChartEvent, ChartType, Plugin } from 'chart.js';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { Options } from 'chartjs-plugin-datalabels/types/options';
import { GraphButtonComponent } from '../graph-button/graph-button.component';
import { Subject } from 'rxjs';
import { XrlGraphOptions } from '../xrl-graph-options';

@Component({
  selector: 'app-xrl-graph',
  templateUrl: './xrl-graph.component.html',
  styleUrls: ['./xrl-graph.component.scss']
})
export class XrlGraphComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild("chart") chart!: ElementRef;
  @ViewChild("downloadButton") downloadButton!: GraphButtonComponent;

  @Input({ required: true }) assessment!: AssessmentModel | null;
  @Input({ required: false }) compareAssessment?: AssessmentModel;
  @Input({ required: false }) options?: XrlGraphOptions;

  // only use to trigger view init for generate graph (for pdf report)
  private componentReadySubject = new Subject<void>();
  public componentReady$ = this.componentReadySubject.asObservable();

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
          size: this.options?.isDownloadOnlyUse ? 28 : 14,
          weight: "bold",
        }
      }
    },
    listeners: {
      click: (context: Context) => {
        this.labelClickEvent.emit(this.assessment?.readinessLevelRanks[context.dataIndex].readinessLevel.name);
      },
      enter: (context: Context) => {
        this.isInDataLabels = true;
      },
      leave: (context: Context) => {
        this.isInDataLabels = false;
      },
    },
    offset: -8,
    align: "start",
  }

  private isInDataLabels = false;
  public radarChartData?: ChartData<'radar'>;
  public radarChartType: ChartType = 'radar';
  public radarChartPlugins: Plugin = ChartDataLabels;
  private title: string | undefined;
  private compareTitle: string | undefined;

  public componentReadySubjectComplete: Plugin = {
    id: 'componentReadySubjectComplete',
    afterRender: (chart: any) => {
      this.componentReadySubject.next();
      this.componentReadySubject.complete();
    }
  }

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assessment'] || changes['compareAssessment']) {
      this.updateChart();
    }
  }

  updateChart() {
    this.setRadarChartsOptions();
    this.setLabelsAndValues();
  }

  onHover(event: ChartEvent, chart: Chart) {
    if (!this.options?.labelsClick) return;
    const canvas = chart.canvas;
    const r = (chart.scales['r'] as any);
    const index = isClickInLabels(event, r['_pointLabelItems']);

    if (index != -1 || this.isInDataLabels) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
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
            borderDash: this.options?.isDownloadOnlyUse ? [6, 6] : [3, 3],
            color: "rgba(0,0,0,0.4)"
          },
          grid: {
            borderDash: this.options?.isDownloadOnlyUse ? [6, 6] : [3, 3],
            circular: true,
            lineWidth: this.options?.isDownloadOnlyUse ? 3 : 1,
            color: "rgba(0,0,0,0.4)"
          },
          pointLabels: {
            font: {
              size: this.options?.isDownloadOnlyUse ? 26 : 12
            },
          },
        },
      },
      onHover: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => this.onHover(event, chart),
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
          position: this.options?.legendPosition ?? 'top',
          display: this.options?.legend ?? false,
          labels: {
            font: {
              size: this.options?.isDownloadOnlyUse ? 28 : 12
            },
          },
        },
        tooltip: {
          enabled: false,
        }
      }
    };
  }

  setLabelsAndValues() {
    if (this.assessment == null || this.assessment == undefined) return;

    let labels;
    let values: (number | null)[] = [];
    let compareValues: (number | null)[] = [];
    if (this.compareAssessment) {
      const setLabels = new Set<string>([
        ...this.assessment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name),
        ...this.compareAssessment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name)]);
      labels = Array.from(setLabels);

      setLabels.forEach((label: string) => {
        values.push(this.assessment?.readinessLevelRanks.find((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name == label)?.rank ?? null);
        compareValues.push(this.compareAssessment?.readinessLevelRanks.find((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name == label)?.rank ?? null);
      })
    } else {
      labels = this.assessment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.readinessLevel.name);
      values = this.assessment.readinessLevelRanks.map((rlRank: ReadinessLevelRankModel) => rlRank.rank);
    }

    if (this.options?.legendTitle) {
      const legendTitleTab = this.options.legendTitle.split('|');
      this.title = legendTitleTab[0].replace('${date}', this.assessment.date.toLocaleDateString());
      this.compareTitle = legendTitleTab[legendTitleTab.length - 1].replace('${date}', this.compareAssessment?.date.toLocaleDateString() ?? "");
    } else {
      this.compareTitle = this.compareAssessment?.date.toLocaleDateString();
      this.title = this.assessment.date.toLocaleDateString();
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
    if (this.compareAssessment) {
      this.radarChartData.datasets.push({
        data: compareValues,
        label: this.compareTitle,
      })
    } else {
      this.radarChartData.datasets[0].backgroundColor = (context, options) => this.createRadialGradient(context, options);
      this.radarChartData.datasets[0].borderColor = "black";
      this.radarChartData.datasets[0].borderWidth = this.options?.isDownloadOnlyUse ? 2 : 1;
    }
  }

  //cache for re render chart when a size changement is detected
  cache: number[] = [];

  createRadialGradient(context: any, options: any) {
    const chart: Chart = context.chart;
    const ctx = chart.ctx;
    const area = chart.chartArea;
    if (ctx && area) {
      area.height += area.top;
      const r = (chart.scales['r'] as any);
      if (r.xCenter == Infinity || r.yCenter == Infinity || r.drawingArea == Infinity) return "white";
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

      //check if size changement
      if (this.cache.length == 0 || !this.cache.includes(r.xCenter) || !this.cache.includes(r.yCenter) || !this.cache.includes(r.drawingArea)) {
        this.cache = [r.xCenter, r.yCenter, r.drawingArea];
        chart.update();
      }

      return gradient;
    } else {
      return "white";
    }
  }

  exportGraph() {
    const image = this.getPngImage();
    const link = document.createElement('a');
    link.download = "xrl-graph.png";
    link.href = image;
    link.click();
  }

  getPngImage() {
    const canvas = this.chart.nativeElement as HTMLCanvasElement;
    return canvas.toDataURL("image/png");
  }

  ngAfterViewInit() {
    if (this.options?.download && this.assessment != null) {
      this.addDownloadButton();
      this.addCopyGraphButton();
    }
  }

  getCanvasWithWhiteBackground() {
    const canvas = this.chart.nativeElement as HTMLCanvasElement;

    const canvasWithWhiteBackground = document.createElement('canvas');
    canvasWithWhiteBackground.width = canvas.width;
    canvasWithWhiteBackground.height = canvas.height;
    const ctx = canvasWithWhiteBackground.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWithWhiteBackground.width, canvasWithWhiteBackground.height);
    ctx.drawImage(canvas, 0, 0);

    return canvasWithWhiteBackground;
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

  addCopyGraphButton() {
    this.downloadButton.addClick(() => {
      this.copyGraph();
    });
    this.downloadButton.showButton();
  }

  copyGraph() {
    const canvas = this.getCanvasWithWhiteBackground();
    canvas.toBlob((blob) => {
      if (blob) {
        navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
      }
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