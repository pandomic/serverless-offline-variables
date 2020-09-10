import * as ServerlessType from "serverless";

export { default as Plugin } from "serverless/classes/Plugin";

export type Resolver = (variable: string) =>
  Promise<string | null | undefined>;

export type VariableResolver = {
  regex: RegExp,
  resolver: Resolver,
  isDisabledAtPrepopulation?: boolean,
  serviceName?: string
}

export type Serverless = ServerlessType & {
  variables: {
    variableResolvers: Array<VariableResolver>
  }
}

export type PluginConfig = {
  stages: Array<string>,
  file?: string,
  variables?: { [name: string]: string }
}

export type Options = ServerlessType.Options;
