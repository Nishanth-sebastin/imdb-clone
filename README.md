<p align="center">
  <img src="https://i.postimg.cc/DwSYQmc9/Capture-d-e-cran-2023-08-24-a-22-56-12.png" />
</p>

<p align="center">
  <b>Monorepo template using TurboRepo</b><br/>
  App : React, Node <br />
  Packages : Commons, eslint-config
</p>
<br/>

[![View](https://img.shields.io/badge/monorepo-%201.0.0-brightgreen)](https://github.com/quentinlao/monorepo/tree/main)


`Monorepo` is a template used to create an monorepo app based on [Monorepo tools](https://monorepo.tools/) structure. This project is designed for strict minimum configuration for an application typescript project.

-   **NodeJS** Application backend with an express API
-   **ReactJS** Application simple react app without CRA
-   **Commons** Libs for commons (utils, types, ...)
-   **Eslint-config** Global eslint config use for apps

## Installation

```sh
# install turbo

npm install -g turbo

# install project

 npm install
```


## Project structure

| File or folder                  | Description                                                                                        |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `apps`                 | application of the organization|
| `apps/api`                 | node express api  |
| `apps/web`                 | a simple react app |
| `packages`                 | library use in apps|
| `packages/commons`                 | libs for commons utils, constants, enums |
| `packages/eslint-config`                 | libs for global eslint configuration |



## Usage

```sh
# launch parallel all dev app (api and web)
npm run dev

# launch only web app
npm run web

# launch only api app
npm run api

# launch workspace web
# --command is replace by @repo/web script ej : npm run @repo/web lint
npm run @repo/web --command

# launch workspace api
# --command is replace by @repo/web script ej : npm run @repo/web dev
npm run @repo/api --command


```

## Documentation

-   React :  [React hooks](https://fr.reactjs.org/docs/hooks-intro.html).
-   Typescript : [TS](https://www.typescriptlang.org/).
-   Yarn : package manager [yarn](https://yarnpkg.com/).
-   Webpack : bundler [webpack](https://webpack.js.org/).
-   Babel : JS compiler ECMAScript 2015+ [babel](https://babeljs.io/docs/en/) (arrow function, and so on).
-   Prettier : [prettier](https://prettier.io/) configuration with VScode
-   ESlint : [ESlint](https://eslint.org/) linter fix auto config VScode
-   dotenv to configure .env

## Inspiration for next improvement

- CSS choices (postcss, inline-css, ...)
- query call function API (fetch, axios)
- test e2e (cypress, playwright, ...)
- swc or babel
- lib front tanstack
- storybook for component
- sonar

You can use this minimun configuration to start a clean project, test it and improve it



## Contributor

[Quentin](https://github.com/quentinlao/)


### License




1. npm run dev for dev
2. npm run build for prod
3. npx turbo db:generate
4. npx turbo db:migrate
5. npx prisma db seed