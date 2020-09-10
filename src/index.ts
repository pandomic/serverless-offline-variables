import { Plugin, PluginConfig, Serverless, Options, Resolver } from "./types";

import { parseDotEnv } from './parser';
import { readFileContent } from './files';
import { isWatched, extractFeature } from './resolvers';

const CONFIGURATION_NAME = 'offline-variables';

const DEFAULT_CONFIG = {
  stages: ['local'],
  file: '.env'
};

class ServerlessOfflineVariables implements Plugin {
  hooks = {};

  private config: PluginConfig;
  private options: Options;
  private log: (message: string) => null;
  private serverless: Serverless;
  private originalResolvers: { [feature: string]: Resolver } = {};

  constructor(serverless: Serverless, options: Options) {

    this.log = serverless.cli.log.bind(serverless.cli)
    this.config = serverless.service.custom[CONFIGURATION_NAME] || DEFAULT_CONFIG;

    this.options = options;
    this.serverless = serverless;

    if (this.allowedStage()) this.replaceResolvers();
  }

  private allowedStage (): boolean {
    return this.config.stages.includes(
      this.options.stage || this.serverless.service.provider?.stage
    );
  }

  private replaceResolvers() {
    const envContent = this.config.file && readFileContent(this.config.file);
    const envVariables = envContent && parseDotEnv(envContent);

    for (const variableResolver of this.serverless.variables.variableResolvers) {
      if (!isWatched(variableResolver)) continue;

      const resolverFeature = extractFeature(variableResolver);
      this.originalResolvers[resolverFeature] = variableResolver.resolver;

      variableResolver.resolver = async (variable: string) => {
        const value = envVariables && envVariables[variable] || this.config.variables?.[variable];

        if (!value) {
          this.log(`Could not resolve value for ${variable}, trying with original resolver...`);
          return this.originalResolvers[resolverFeature](variable);
        }

        return value;
      }
    }
  }
}

export = ServerlessOfflineVariables;
