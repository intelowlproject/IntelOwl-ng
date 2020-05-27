# IntelOwl-ng

Web client for [Intel Owl](https://github.com/intelowlproject/intelowl), a scalable API which gathers threat intelligence data about a particular file or observable (ip, domain, url, hash) by querying many different analyzers and services that are externally or internally available.

Built with [Angular 9](https://github.com/angular/angular) on top of [ngx-admin](https://github.com/akveo/ngx-admin).

> This project is in very early stages of development. Don't use this in production.

#### Demo

[Live Demo](https://intelowlclient.firebaseapp.com/)

## Installation

##### Dependencies

- [node.js](https://github.com/nodejs/node): `v12.17.0` (Latest LTS)
- [npm](https://github.com/npm/npm): `v6.14.3`
- [Angular CLI](https://github.com/angular/angular-cli): `v9.1.7`

##### Clone the repo

```bash
$ git clone https://github.com/intelowlproject/intelowl-ng
$ cd intelowl-ng/
```

##### Install npm packages

Install the [npm](https://github.com/npm/npm) packages described in the `package.json` and verify that it works:

```bash
$ npm install
```

##### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. 
Shut it down manually with Ctrl-C.

This application requires Intel Owl running on `http://localhost:80`. If you wish to change this URL, you can do so by changing the `api` parameter in [environment.ts](src/environments/environment.ts) for development server and on [environment.prod.ts](src/environments/environment.prod.ts) for production build.

> Note: Dockerfile coming soon!

## Developing / Contributing

##### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

##### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

##### Further help

To get more help on the angular-cli use `ng --help` or go check out the Angular-CLI README.