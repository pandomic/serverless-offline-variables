import { Plugin, PluginConfig, Serverless, Options } from "./types";

import { parseDotEnv } from './parser';
import { readFileContent } from './files';

const CONFIGURATION_NAME = 'offline-variables';
const WATCHED_SOURCE_NAMES = ['CloudFormation', 'SSM', 'S3']
const WATCHED_SOURCE_REGEX = ['env:']

const DEFAULT_CONFIG = {
  stages: ['local'],
  file: '.env'
};

const isWatchedByName = (name?: string): boolean =>
  !!name && WATCHED_SOURCE_NAMES.includes(name);

const isWatchedByRegex = (regex?: RegExp): boolean =>
  !!regex && WATCHED_SOURCE_REGEX.some(str => regex.toString().includes(str));

class ServerlessOfflineVariables implements Plugin {
  hooks = {};

  private config: PluginConfig;
  private options: Options;
  private log: (message: string) => null;
  private serverless: Serverless;

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
      if (!isWatchedByName(variableResolver.serviceName) && !isWatchedByRegex(variableResolver.regex)) continue;

      variableResolver.resolver = async (variable: string) => {
        const value = envVariables && envVariables[variable] || this.config.variables?.[variable];

        if (!value) this.log(`Could not resolve value for` + variable);

        return value;
      }
    }
  }
}

export = ServerlessOfflineVariables;
