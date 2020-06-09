import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EChartOption } from 'echarts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-echarts-pie',
  templateUrl: './echarts-pie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EchartsPieComponent implements OnChanges, OnDestroy {
  options: EChartOption;
  private themeSubscription: Subscription;

  @Input() pieChartData: any;
  @Input() pieChartName: any;
  @Output() onPieSelect: EventEmitter<any> = new EventEmitter();

  constructor(private theme: NbThemeService) {}

  downloadPieChart(): void {
    alert('Right click on the chart -> "Save image as"');
  }

  ngOnChanges(): void {
    if (
      this.pieChartData === null ||
      this.pieChartData === undefined ||
      this.options
    ) {
      return;
    }
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight as string,
          colors.dangerLight as string,
          colors.primaryLight as string,
          colors.successLight as string,
          colors.infoLight as string,
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          data: this.pieChartData.map((d) => {
            return d.name;
          }),
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: this.pieChartName,
            type: 'pie',
            radius: '35%',
            height: 375,
            center: ['50%', '50%'],
            data: this.pieChartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription && this.themeSubscription.unsubscribe();
  }

  onChartMouseDown(event): void {
    this.onPieSelect.emit(event.data);
  }
}
