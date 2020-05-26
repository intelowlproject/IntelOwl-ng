import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'echarts-tree',
  template: `
    <div echarts *ngIf="treeInputData!==undefined" [options]="options" class="echart" style="height: 700px;">
    </div>
  `,
})
export class EchartsTreeComponent implements OnInit, OnDestroy {
  options = null;

  themeSubscription: any;

  @Input() treeInputData: any;

  constructor(private theme: NbThemeService) { }

  ngOnInit(): void {
    if (this.treeInputData === null || this.treeInputData === undefined) {
      return;
    }
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;

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
              color: colors.successLight,
              curveness: 0.5,
              width: 0.4,
            },
            itemStyle: {
              color: '#000',
              borderColor: '#fff',
            },
            label: {
              normal: {
                position: 'top',
                verticalAlign: 'top',
                align: 'center',
                color: '#fff',
                lineHeight: 15,
                fontSize: 16,
              },
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'medium',
                  align: 'left',
                  color: colors.infoLight,
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
