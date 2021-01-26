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

[Live Demo](https://intelowlclient.firebaseapp.com/) hosted on firebase. (_Last Updated for IntelOwl v2.0.0_)

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

## Docker

IntelOwl-ng's Docker image on [Dockerhub](https://hub.docker.com/r/intelowlproject/intelowl_ng) is a data-only image. In other terms, it's a scratch image that contains only the final production build artifacts and cannot be started as a container. This makes the image super light-weight i.e. ~7 mb uncompressed and we can use Docker's multi-stage builds to inject these build artifacts into another base container such as `nginx`. Official [example](https://github.com/intelowlproject/IntelOwl/blob/develop/Dockerfile_nginx) from Intel Owl repository.

> You should never need to build/start this docker image yourself, you should always use the docker-compose files from main IntelOwl repository.

## Installation

For a development server, we make use of proxy configuration given in [proxy.config.json](proxy.conf.json) to make calls to the backend server.
Therefore, this application requires Intel Owl running on `http://localhost:80` (by default). If you wish to change this URL, you can do so by changing
the `target` parameter in [proxy.config.json](proxy.conf.json).

#### Clone this repository

```bash 
$ git clone https://github.com/intelowlproject/intelowl-ng
$ cd intelowl-ng/
``` 

### Build locally

##### Dependencies

- [node.js](https://github.com/nodejs/node):
`v12.18.0` (Latest LTS)
- any one of: [yarn](https://github.com/yarnpkg/yarn): `v1.22.4` or [npm](https://github.com/npm/npm)
  for package management.

##### Install packages

Install the packages described in the `package.json` and
verify that it works: 

```bash
intelowl-ng$ yarn install
``` 
 
or,

```bash
intelowl-ng$ npm install
``` 

##### Development server

Run `npm start` or `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will
automatically reload if you change any of the source files. Shut it down manually with <mark>Ctrl-C</mark>.

## Developing

##### Project structure

```
dist/                        compiled version
e2e/                         end-to-end tests
src/                         project source code
|- app/                      app components
|  |- @core/                 core module (singleton services and single-use components)
|     |- models/models.ts    various interfaces used
|     |- services/           injectable services
|  |- @theme/                reusable theme module, reusable components, directives, pipes.
|     |- styles/             ngx-admin themes and global scss variables
|  |- pages/                 app's primary modules and components
|  |- app.component.*        app root component (shell)
|  |- app.module.ts          app root module definition
|  |- app-routing.module.ts  app routes
|- assets/                   app assets (images, etc.)
|- environments/             values for various build environments
|- index.html                html entry point
|- main.ts                   app entry point
|- polyfills.ts              polyfills needed by Angular
+- test.ts                   unit tests entry point
README.md                    project docs and coding guides
Dockerfile                   multi-staged Dockerfile
```

##### Libraries

- [Angular](https://angular.io) - `v10.x`
- [Nebular](https://akveo.github.io/nebular/5.1.0/) - `v6.2.x`
- [ngx-admin](https://github.com/akveo/ngx-admin)
- [RxJS](http://reactivex.io/rxjs) - `v6.6.x`
- [Eva Icons](https://akveo.github.io/eva-icons/)
- [Bootstrap 4](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
- [ng2-smart-table](https://akveo.github.io/ng2-smart-table/#/)

##### Code scaffolding

Run `ng generate component component-name` to generate a new component. 
You can also use `ng generate directive/pipe/service/class/module`.

##### Build

Run `ng build` or `yarn build` to build the project. The build artifacts will be
stored in the `dist/` directory. Use the `--prod` flag for a production build.

##### Further help

To get more help on the angular-cli use `ng --help` or go check out the Angular-CLI README.

## Contributing 

1. Please create a new branch based on the `develop` branch that contains the most recent changes.

```bash
$ git checkout -b myfeature develop
```

2. Run this before committing your changes to git.

```bash
$ yarn prettier:write
$ yarn lint
```

Fix the linting issues, if there are any.

3. Read [this](https://intelowl.readthedocs.io/en/latest/Contribute.html#create-a-pull-request) before submitting a pull request.