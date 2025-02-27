# MyApp2

A sample project covering all the funcional areas of system monitoring.

## Table of contents

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Quick Start](#quick-start)


## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Grafana _(Free account)_**
- **Docker for Visual Studio Code _(Extension)_**
- **Node.js (v22.13.1)**

## Installation

To install all dependencies

```bash
npm install
```

Change the parameters in [collector-config.yaml](collector-config.yaml) as follow:

```yaml
...
exporters:
  otlphttp:
    endpoint: <OTLP Endpoint>
    headers:
      Authorization: "Basic <Token>"

extensions:
  basicauth/otlp:
    client_auth:
      username: <Grafana Username>
      password: <Grafana Password>
...
```
Build images before start containers

```js
docker compose up --build
```

# Quick Start

```bash
npm node --require ./instrumentation.js app.js
```

View the website at: http://localhost:8080
