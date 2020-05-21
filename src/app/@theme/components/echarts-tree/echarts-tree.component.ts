import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'echarts-tree',
  template: `
    <div echarts [options]="options" class="echart" style="height: 700px;">
    </div>
  `,
})
export class EchartsTreeComponent implements OnInit, OnDestroy {
  options = null;

  themeSubscription: any;

  @Input() tree_data: any;

  constructor(private theme: NbThemeService) { }

  ngOnInit() {

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      // const echarts: any = config.variables.echarts;

      this.options = {
        tooltip: {
          trigger: 'item',
        },
        // color: [
        //   colors.primaryLight,
        //   colors.successLight,
        //   colors.infoLight,
        //   colors.dangerLight,
        //   colors.warningLight
        // ],
        series: [
          {
            type: 'tree',
            name: 'Integrations Tree',
            // orient: "TB",
            data: [this.tree_data],

            top: '0%',
            left: '5%',
            right: '40%',
            bottom: '0%',

            // height: "1000",

            initialTreeDepth: 2,

            symbolSize: 12,
            symbol: 'emptyCircle',
            symbolRotate: 270,

            lineStyle: {
              color: colors.primaryLight,
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
                lineHeight: 10,
                fontSize: 15,
              },
            },

            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'medium',
                  align: 'left',
                  color: colors.successLight,
                  fontSize: 12,
                },
              },
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,

          },
        ],
      };
    });

  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
