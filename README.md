# serverless-offline-variables

## About

`serverless-offline-variables` is a lightweight plugin to replace ${cf:}, ${s3:}, ${ssm:} and ${env:}
parameters during the local (offline) runs, which can be very useful when testing microservices in isolation.

## Installation

Use `yarn` or `npm` to add the plugin to your package dependecies:

```
npm install --save-dev serverless-offline-variables
```

or

```
yarn add serverless-offline-variables --dev
```

## Usage

1. Add plugin to you serverless plugins

```yaml
plugins:
  ...
  - serverless-offline-variables
```

2. Configure plugin (optional)

```yaml
custom:
  ...
  offline-variables:
    stages:
      - local  # Default
    file: .env # Default
    variables: # Optional
      - ssm:hello-world: my value
```

By default plugin will first try to locate your variable in `.env` file
(or in the file you specified), and only then under the `variables` section.

## Contributions

You are welcome to create pull requests to improve the project. Please check out
the [contributing](https://github.com/pandomic/serverless-offline-variables/blob/master/CONTRIBUTING.md)
quick guide to get started.

## License

The project is distributed under [MIT](https://github.com/pandomic/serverless-offline-variables/blob/master/LICENSE) license.
