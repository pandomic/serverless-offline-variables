import { VariableResolver } from './types';

const WATCHED_SOURCE_NAMES = ['CloudFormation', 'SSM', 'S3'];
const WATCHED_SOURCE_REGEX = ['env:'];

export const extractFeature = (resolver: VariableResolver): string =>
  resolver.serviceName || resolver.regex.toString();

export const isWatched = (resolver: VariableResolver): boolean =>
  WATCHED_SOURCE_NAMES.includes(extractFeature(resolver)) ||
  WATCHED_SOURCE_REGEX.some((regStr) => extractFeature(resolver).includes(regStr));
