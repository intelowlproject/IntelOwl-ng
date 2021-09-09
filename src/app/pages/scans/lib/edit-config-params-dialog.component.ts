import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { IAbstractConfig } from 'src/app/@core/models/models';

@Component({
  template: `<app-json-editor
    [data]="jsonInputData"
    [editorOptions]="editorOptions"
  >
    <section class="mt-4">
      <div *ngFor="let configItem of configParamsMap | keyvalue">
        <h6>{{ configItem.key }}</h6>
        <ul *ngIf="!isEmptyObject(configItem.value); else nullText">
          <li *ngFor="let paramItem of configItem.value | keyvalue">
            <span>{{ paramItem.key }}</span>
            &nbsp;<em class="text-muted">({{ paramItem.value.type }})</em>
            <dd class="text-muted">{{ paramItem.value.description }}</dd>
          </li>
        </ul>
        <ng-template #nullText>
          <span class="font-italic text-muted">null</span>
        </ng-template>
      </div>
    </section>
  </app-json-editor>`,
})
export class EditConfigParamsDialogComponent implements OnInit, OnChanges {
  @Input() public configParamsMap: Record<
    string,
    Record<string, IAbstractConfig['params']>
  >;
  public jsonInputData: any = {};
  public editorOptions: JsonEditorOptions; // JSON editor

  constructor(protected dialogRef: NbDialogRef<any>) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code'];
    this.editorOptions.mode = 'code';
  }

  ngOnInit(): void {
    this.updatejsonInputData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      Object.keys(changes.configParamsMap.previousValue).length !==
      Object.keys(changes.configParamsMap.currentValue).length
    ) {
      this.updatejsonInputData();
    }
  }

  public isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  private updatejsonInputData(): void {
    this.jsonInputData = Object.entries(this.configParamsMap).reduce(
      (acc, [name, params]) => ({
        ...acc,
        [name]: Object.entries(params).reduce(
          (acc2, [pName, { value }]) => ({
            ...acc2,
            [pName]: value,
          }),
          {}
        ),
      }),
      {}
    );
  }
}
