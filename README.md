# IntelOwl-ng

[![Travis build status](https://api.travis-ci.com/intelowlproject/IntelOwl-ng.svg?branch=master&status=passed)](https://travis-ci.com/github/intelowlproject/IntelOwl-ng/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/intelowlproject/IntelOwl-ng.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/intelowlproject/IntelOwl-ng/context:javascript)
[![CodeFactor](https://www.codefactor.io/repository/github/intelowlproject/intelowl-ng/badge)](https://www.codefactor.io/repository/github/intelowlproject/intelowl-ng)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Official web client for [Intel Owl](https://github.com/intelowlproject/intelowl), a scalable API which gathers
threat intelligence data about a particular file or observable (ip, domain, url,
hash) by querying many different analyzers and services that are externally or
internally available.

Built with [Angular 10](https://github.com/angular/angular) on top of [ngx-admin](https://github.com/akveo/ngx-admin). 

#### Demo

[Live Demo](https://intelowlclient.firebaseapp.com/)

## Features

- A dashboard to display different visualizations of Job data, with the following features: 
    - Tabular view of all jobs which can be filtered, sorted or searched through. 
    - Pie charts for visualizing job data on the basis of `status`, `observable_classification`, `file_mimetype` and `is_sample`. 
    - Clicking on any slice on the Pie Chart will filter the jobs list based on the selected classification. 
    - “Save as PNG” feature for the graphs. 
- Job result can be viewed as a nested list or prettified JSON. 
- [`analyzer_config.json`](https://github.com/intelowlproject/IntelOwl/blob/master/configuration/analyzer_config.json) 
from IntelOwl in a tabular view which can be filtered, sorted or searched through. Along with this, there's also a dendogram-tree view. 
- Requesting new analysis/scans with simple-to-use forms. They take care of warnings for you and 
also lets you specify tags to group different analysis' together.