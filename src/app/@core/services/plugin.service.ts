import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PluginService {
  pluginType: string;

  constructor() {}

  // for the demo
  public _verificationChoices = [
    {
      configured: true,
      error_message: null,
      missing_secrets: [],
    },
    {
      configured: false,
      error_message: '(api_key_name, api_key_url) not set, 2/4 secrets missing',
      missing_secrets: ['api_key_name', 'api_key_url'],
    },
    {
      configured: true,
      error_message: null,
      missing_secrets: [],
    },
  ];

  private toTitleCase(value: string): string {
    return value[0].toUpperCase() + value.substring(1).toLowerCase();
  }
}
