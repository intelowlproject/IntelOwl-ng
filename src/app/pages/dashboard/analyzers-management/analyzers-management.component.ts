import { Component, OnInit } from '@angular/core';
import {
  observable_analyzers,
  file_analyzers,
} from '../../../../assets/analyzers_list';

@Component({
  selector: 'analyzers-management',
  templateUrl: './analyzers-management.component.html',
  styleUrls: ['./analyzers-management.component.scss'],
})

export class AnalyzersManagementComponent implements OnInit {
  // Tree Data

  ip_analyzers_names: string[] = [];
  url_analyzers_names: string[] = [];
  domain_analyzers_names: string[] = [];
  hash_analyzers_names: string[] = [];
  file_analyzers_names: string[] = [];

  tree_data: any;

  constructor() {
    observable_analyzers.forEach(obs => {
      if (obs['observable_supported'].includes('ip')) {
        this.ip_analyzers_names.push(obs['name']);
      }
      if (obs['observable_supported'].includes('url')) {
        this.url_analyzers_names.push(obs['name']);
      }
      if (obs['observable_supported'].includes('domain')) {
        this.domain_analyzers_names.push(obs['name']);
      }
      if (obs['observable_supported'].includes('hash')) {
        this.hash_analyzers_names.push(obs['name']);
      }
    });

    this.file_analyzers_names = file_analyzers.map(obs => obs['name']);
  }

  ngOnInit() {
    this.tree_data = {
      name: 'IntelOwl',
      children: [
        {
          name: 'Observable Analyzers',
          children: [
            {
              name: 'IP',
              children: this.ip_analyzers_names.map(d => {
                return { name: d };
              }),
            },
            {
              name: 'URL',
              children: this.url_analyzers_names.map(d => {
                return { name: d };
              }),
            },
            {
              name: 'Domain',
              children: this.domain_analyzers_names.map(d => {
                return { name: d };
              }),
            },
            {
              name: 'Hash',
              children: this.hash_analyzers_names.map(d => {
                return { name: d };
              }),
            },
          ],
        },
        {
          name: 'File Analyzers',
          children: this.file_analyzers_names.map(d => {
            return { name: d };
          }),
        },
      ],
    };
  }
}
