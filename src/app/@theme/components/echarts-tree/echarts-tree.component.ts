import {
  Component,
  OnDestroy,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-echarts-tree',
  template: `
    <div
      echarts
      [options]="options"
      class="echart"
      style="height: 700px;"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EchartsTreeComponent implements OnInit, OnDestroy {
  private themeSubscription: Subscription;
  @Input() private treeInputData: any;
  public options: any;

  constructor(
    private readonly theme: NbThemeService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (
      this.treeInputData === null ||
      this.treeInputData === undefined ||
      this.options
    ) {
      return;
    }
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      this.cdRef.markForCheck(); // so theme gets updated
      const colors = config.variables.echarts;

      this.options = {
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            type: 'tree',
            name: 'Integrations Tree',
            // orient: "TB",
            data: [this.treeInputData],
            top: '0%',
            left: '5%',
            right: '40%',
            bottom: '0%',
            // height: "1000",
            initialTreeDepth: 2,
            symbolSize: 12,
            symbol: 'emptyCircle',
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,

            lineStyle: {
              color: colors['tooltipBackgroundColor'],
              curveness: 0.5,
              width: 0.4,
            },
            itemStyle: {
              color: '#111',
              borderColor: colors['tooltipBackgroundColor'],
            },
            label: {
              normal: {
                position: 'top',
                verticalAlign: 'top',
                align: 'center',
                color: colors['textColor'],
                lineHeight: -20,
                fontSize: 16,
              },
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'medium',
                  align: 'left',
                  color: colors['textColor'],
                  lineHeight: 1,
                  fontSize: 11,
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
}
