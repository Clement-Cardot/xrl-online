import { ReadinessLevelModel } from 'src/app/core/data/models/readiness-level.model';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, LegendElement, LegendItem, Plugin } from 'chart.js';
import { AssessmentModel } from 'src/app/core/data/models/assessment.model';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Subject } from 'rxjs';
import { XrlGraphOptions } from '../xrl-graph-options';

@Component({
  selector: 'app-linear-graph',
  templateUrl: './linear-graph.component.html',
  styleUrls: ['./linear-graph.component.scss']
})
export class LinearGraphComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild("chart") chart!: ElementRef;

  @Input({ required: true }) assessments!: AssessmentModel[];
  @Input({ required: false }) rlName?: string;
  // boolean for disabled some options when download graph only for project report
  @Input({ required: false }) options?: XrlGraphOptions;

  public radarChartType: ChartType = 'line';
  public radarChartData?: ChartData<'line'>;
  public radarChartOptions: ChartConfiguration['options'];

  public zoomPlugin: Plugin = zoomPlugin;

  // only use to trigger view init for generate graph (for pdf report)
  private componentReadySubject = new Subject<void>();
  public componentReady$ = this.componentReadySubject.asObservable();

  public componentReadySubjectComplete: Plugin = {
    id: 'componentReadySubjectComplete',
    afterRender: (chart: any) => {
      this.componentReadySubject.next();
      this.componentReadySubject.complete();
    }
  }

  ngOnInit(): void {
    if (this.assessments.length === 0) {
      return;
    }
    this.radarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'MMM YYYY'
            }
          },
          ticks: {
            font: {
              size: this.options?.isDownloadOnlyUse ? 25 : 12
            }
          }
        },
        y: {
          min: 0,
          max: 9,
          afterDataLimits: (scale) => {
            scale.max = 9.5;
            scale.min = 0;
          },
          ticks: {
            font: {
              size: this.options?.isDownloadOnlyUse ? 30 : 12
            }
          }
        }
      },
      plugins: {
        zoom: {
          limits: {
            x: {
              min: this.getMinLimit(),
              max: this.getMaxLimit(),
              minRange: 1000 * 60 * 60 * 24 * 10,
            }
          },
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          }
        }
      }
    };
    if (this.options?.isDownloadOnlyUse) {
      this.radarChartOptions.animation = {
        duration: 0.01
      }
    }
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  ngAfterViewInit(): void {
    this.addRefreshButton();
    //this.componentReadySubject.next();
    // this.componentReadySubject.complete();
  }

  updateChart() {
    this.setData();
    this.setLegendOnClick();
  }

  setLegendOnClick() {
    // Ensure that radarChartOptions is initialized
    if (!this.radarChartOptions) {
      this.radarChartOptions = {};
    }

    // Ensure that plugins is initialized within radarChartOptions
    if (!this.radarChartOptions.plugins) {
      this.radarChartOptions.plugins = {};
    }

    this.radarChartOptions!.plugins!.legend = {
      display: this.options?.legend ?? true,
      position: this.options?.legendPosition ?? 'top',
      labels: {
        font: {
          size: this.options?.isDownloadOnlyUse ? 28 : 12
        }
      }
    }
    if (!this.rlName) {
      this.radarChartOptions!.plugins!.legend.onClick = (e: ChartEvent, legendItem: LegendItem, legend: LegendElement<"line">) => {
        const index = legendItem.datasetIndex;
        const ci = legend.chart;
        const showElements = legend.legendItems?.filter(li => !li.hidden) ?? [];
        if (ci.isDatasetVisible(index!) && showElements.length > 1) {
          ci.hide(index!);
          legendItem.hidden = true;
        } else {
          ci.show(index!);
          legendItem.hidden = false;
        }
      };
    } else {
      this.radarChartOptions!.plugins!.legend.onClick = () => { };
    }
  }

  setData() {
    const rls: ReadinessLevelModel[] = [];
    for (const assessment of this.assessments) {
      for (const rlRank of assessment.readinessLevelRanks) {
        if (!rls.find(rl => rl.id === rlRank.readinessLevel.id)) {
          rls.push(rlRank.readinessLevel);
        }
      }
    }

    this.radarChartData = {
      datasets: rls.map(rl => {
        return {
          label: rl.name,
          data: this.assessments.map(assessment => {
            return {
              x: assessment.date,
              y: assessment.readinessLevelRanks.find(rlRank => rlRank.readinessLevel.id === rl.id)?.rank ?? null
            };
          }) as any[],
        }
      })
    }
    if (this.rlName) {
      this.radarChartData.datasets = this.radarChartData.datasets.filter(ds => ds.label === this.rlName);
    }
  }

  getMaxLimit(): number | 'original' {
    if (!this.assessments) return 'original';
    const lastAssessment = this.assessments.sort((a, b) => a.date.getTime() - b.date.getTime())[this.assessments.length - 1];
    return lastAssessment.date.getTime() + 1000 * 60 * 60 * 24 * 10;
  }

  getMinLimit(): number | 'original' {
    if (!this.assessments) return 'original';
    const firstAssessment = this.assessments.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
    return firstAssessment.date.getTime() - 1000 * 60 * 60 * 24 * 10;
  }

  addRefreshButton() {
    const chartContainer = this.chart.nativeElement.parentElement;

    const refreshButton = document.createElement('div');
    refreshButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/></svg>';

    refreshButton.style.position = 'absolute';
    refreshButton.style.top = '0px';
    refreshButton.style.right = '0px';
    refreshButton.style.cursor = 'pointer';
    refreshButton.style.zIndex = '1000';
    refreshButton.querySelector("svg")!.style.width = '1.2rem';
    refreshButton.querySelector("svg")!.style.height = '1.2rem';

    chartContainer.appendChild(refreshButton);

    refreshButton.addEventListener('click', () => {
      this.rlName = undefined;
      this.updateChart();
    });
  }

  getPngImage() {
    const canvas = this.chart.nativeElement as HTMLCanvasElement;
    return canvas.toDataURL("image/png");
  }
}
