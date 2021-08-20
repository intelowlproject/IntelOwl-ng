import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PluginService {
  pluginType: string;

  constructor() {}

  private toTitleCase(value: string): string {
    return value[0].toUpperCase() + value.substring(1).toLowerCase();
  }
}
