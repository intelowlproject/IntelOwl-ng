import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { IAbstractConfig } from 'src/app/@core/models/models';
import { ViewCell } from 'ng2-smart-table';

// Component to render the `secrets` dict
@Component({
  selector: 'plugin-secrets-dict-render',
  template: `
    <div>
      <ul *ngIf="isConfigValid()">
        <li *ngFor="let secret of pluginSecrets | keyvalue; trackBy: trackByFn">
          <span>
            {{ secret.key }}
            &nbsp; (<code class="small">{{ secret.value.env_var_key }}</code
            >) &nbsp;
            <nb-tag
              *ngIf="secret.value.required"
              size="tiny"
              appearance="outline"
              status="warning"
              text="required"
              removeable="false"
            ></nb-tag>
          </span>
          <dd
            class="text-muted"
            [innerHtml]="secret.value.description | markdown"
          ></dd>
        </li>
      </ul>
      <span *ngIf="!isConfigValid()" class="font-italic text-muted">null</span>
    </div>
  `,
})
export class PluginSecretsDictRenderComponent {
  @Input() pluginSecrets: IAbstractConfig['secrets'];

  isConfigValid = () => Object.keys(this.pluginSecrets).length;
  trackByFn = (_index, item) => item.key;
}

// Component to render the `secrets` dict
@Component({
  selector: 'plugin-params-dict-render',
  template: `
    <div>
      <ul *ngIf="isConfigValid()">
        <li *ngFor="let param of pluginParams | keyvalue; trackBy: trackByFn">
          <span>{{ param.key }}: </span>
          <code>{{ param.value.value | json }}</code>
          &nbsp;<em class="text-muted">({{ param.value.type }})</em>
          <dd
            class="text-muted"
            [innerHtml]="param.value.description | markdown"
          ></dd>
        </li>
      </ul>
      <span *ngIf="!isConfigValid()" class="font-italic text-muted">null</span>
    </div>
  `,
})
export class PluginParamsDictRenderComponent {
  @Input() pluginParams: IAbstractConfig['params'];

  isConfigValid = () => Object.keys(this.pluginParams).length;
  trackByFn = (_index, item) => item.key;
}

// Component to render the `secrets` dict
@Component({
  selector: 'plugin-config-dict-render',
  template: `
    <ul>
      <li *ngFor="let configParam of pluginConfig | keyvalue">
        <span class="text-">{{ configParam.key }}: </span>
        <code class="small">{{ configParam.value }}</code>
      </li>
    </ul>
  `,
})
export class PluginConfigDictRenderComponent {
  @Input() pluginConfig: IAbstractConfig['config'];
}

// Component to render card with plugin info
@Component({
  selector: `plugin-info-card`,
  template: `
    <nb-card class="plugin-info-card">
      <nb-card-header>
        <span>{{ pluginInfo?.name }} </span>
        <code class="font-italic small">
          ( {{ pluginInfo?.python_module }} )
        </code>
      </nb-card-header>
      <nb-card-body>
        <div>
          <h6>Description</h6>
          <p [innerHTML]="pluginInfo?.description | markdown"></p>
        </div>
        <div>
          <h6>Configuration</h6>
          <plugin-config-dict-render [pluginConfig]="pluginInfo?.config">
          </plugin-config-dict-render>
        </div>
        <div>
          <h6>Parameters</h6>
          <plugin-params-dict-render
            [pluginParams]="pluginInfo?.params"
          ></plugin-params-dict-render>
        </div>
        <div>
          <h6>Secrets</h6>
          <plugin-secrets-dict-render
            [pluginSecrets]="pluginInfo?.secrets"
          ></plugin-secrets-dict-render>
        </div>
        <div>
          <h6>
            Verification
            <intelowl-tick-cross-render
              [value]="pluginInfo?.verification?.configured"
              [rowData]="pluginInfo"
            ></intelowl-tick-cross-render>
          </h6>
          <div
            *ngIf="pluginInfo?.verification?.error_message"
            class="text-danger"
          >
            {{ pluginInfo?.verification?.error_message }}
          </div>
        </div>
      </nb-card-body>
    </nb-card>
  `,
})
export class PluginInfoCardComponent {
  @Input() pluginInfo: IAbstractConfig;
}

// Plugin Health Check Button Renderer
@Component({
  template: ` <div *ngIf="!disabled" style="display: inline-grid;">
    <span style="color: {{ statusColor }}; text-align: center;">{{
      statusText
    }}</span>
    <button
      nbButton
      (click)="onClick($event)"
      class="mt-2"
      size="tiny"
      status="primary"
    >
      Check
    </button>
  </div>`,
})
export class PluginHealthCheckButtonRenderComponent
  implements ViewCell, OnInit, OnChanges {
  @Input() value: any;
  @Input() rowData: any;

  @Output() emitter: EventEmitter<any> = new EventEmitter();

  statusText: string;
  statusColor: string;
  disabled: boolean;

  ngOnInit(): void {
    this.getIconStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value.previousValue !== changes.value.currentValue) {
      this.getIconStatus();
    }
  }

  private getIconStatus(): void {
    this.disabled = this.value.disabled;
    if (this.value.status === true) {
      this.statusText = 'healthy';
      this.statusColor = '#29D68F';
    } else if (this.value.status === false) {
      this.statusText = 'failing';
      this.statusColor = '#FC3D71';
    } else if (this.value.status === null) {
      this.statusText = 'unknown';
      this.statusColor = 'grey';
    }
  }

  onClick(e) {
    this.emitter.emit(this.rowData);
  }
}
