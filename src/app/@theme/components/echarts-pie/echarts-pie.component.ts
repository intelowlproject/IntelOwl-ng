import {
  Component,
  OnDestroy,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-echarts-pie',
  templateUrl: './echarts-pie.component.html',
  styleUrls: ['./echarts-pie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EchartsPieComponent implements OnChanges, OnDestroy {
  options: any = {};
  themeSubscription: any;

  @Input() pieChartData: any;
  @Input() pieChartName: any;
  @Output() onPieSelect: EventEmitter<any> = new EventEmitter();

  constructor(private theme: NbThemeService) {}

  downloadPieChart() {
    alert('Right click on the chart -> "Save image as"');
  }

  ngOnChanges(): void {
    if (this.pieChartData === null || this.pieChartData === undefined) {
      return;
    }
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight,
          colors.dangerLight,
          colors.primaryLight,
          colors.successLight,
          colors.infoLight,
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          center: 'top',
          data: this.pieChartData.map(d => {
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
            radius: '50%',
            height: 300,
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

  onChartMouseDown(event) {
    this.onPieSelect.emit(event.data);
  }


}
