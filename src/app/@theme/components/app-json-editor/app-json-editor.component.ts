import { Component, Input, ViewChild } from '@angular/core';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-json-editor',
  templateUrl: './app-json-editor.component.html',
  styleUrls: ['./app-json-editor.component.scss'],
})
export class AppJsonEditorComponent {
  @ViewChild(JsonEditorComponent, { static: false })
  editor: JsonEditorComponent;

  @Input() data: any;
  @Input() editorOptions: JsonEditorOptions = new JsonEditorOptions();

  constructor(protected dialogRef: NbDialogRef<any>) {}

  save() {
    this.dialogRef.close(this.editor.get());
  }
}
