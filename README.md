# upload.ai

<p align="center">
  <img src="https://img.shields.io/badge/NLW-upload.ai-%23835afd" />
  <img src="https://img.shields.io/github/last-commit/IgorSAssis/upload.ai?color=835afd"></img> 
  <img src="https://img.shields.io/github/languages/top/IgorSAssis/upload.ai?color=774DD6&logo=Typescript&logoColor=blue"></img>
  <img src="https://img.shields.io/github/repo-size/IgorSAssis/upload.ai?color=774DD6"></img>
  <img src="https://img.shields.io/github/license/IgorSAssis/upload.ai?color=774DD6"></img>
</p>

> :clipboard: Application that allows to users upload videos and,through AI, automatically generate captivating titles and descriptions with good indexing.

## :pushpin: Table of contents
* [Screenshots](#Screenshots)
* [Technologies](#Technologies)
* [Deployment](#Deployment)
* [How to run](#HowToRun)

<a name="Screenshots" />

## :camera: Screenshots

<p align="center">
  <a href="https://github.com/IgorSAssis/upload.ai/blob/main/.github/app.png">
    <img src="https://github.com/IgorSAssis/upload.ai/blob/main/.github/app.png"/>
  </a>
</p>

## :computer: Technologies used
* [Node.js](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [TailwindCSS](https://tailwindcss.com/)
* [Prisma](https://www.prisma.io/)
* [Fastify](https://fastify.dev/)
* [shadcn/ui](https://ui.shadcn.com/)

<a name="HowToRun" />

## 📋 How to run

### 🖥 API
```shell
$ cd api
$ pnpm install
$ pnpm prisma generate
$ pnpm run prisma:migrate:dev
$ pnpm run prisma:seed:dev
$ pnpm run dev
```
Create a **.env** file and add the following settings:
```shell
OPENAI_KEY=<YOUR_OPENAI_KEY>
```
### 🌐 Website
```shell
$ cd web
$ pnpm install
$ pnpm run dev
```
