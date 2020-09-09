import { Serverless as ServerlessType } from './types';
import Plugin from './index';

const createServerless = (): ServerlessType => ({
  cli: {
    log: (message: string) => null
  },
  // @ts-ignore
  service: {
    custom: {
      'offline-variables': {
        stages: ['local'],
        variables: {
          'ssm:variable': 'replaced-ssm',
          's3:variable': 'replaced-s3',
          'cf:variable': 'replaced-cf',
          'env:variable': 'replaced-env',
        }
      }
    }
  },
  // @ts-ignore
  variables: {
    variableResolvers: [
      {
        regex: /.+/i,
        serviceName: 'SSM',
        resolver: async () => 'original-ssm'
      },
      {
        regex: /.+/i,
        serviceName: 'S3',
        resolver: async () => 'original-s3'
      },
      {
        regex: /.+/i,
        serviceName: 'CloudFormation',
        resolver: async () => 'original-cf'
      },
      {
        regex: /^env:/g,
        resolver: async () => 'original-env'
      }
    ]
  }
});

test('replaces original resolvers', async () => {
  const serverless = createServerless();

  new Plugin(serverless, { stage: 'local', region: '' });

  const ssmResolver = serverless.variables.variableResolvers
    .find(({ serviceName }) => serviceName === 'SSM');

  const s3Resolver = serverless.variables.variableResolvers
    .find(({ serviceName }) => serviceName === 'S3');

  const cfResolver = serverless.variables.variableResolvers
    .find(({ serviceName }) => serviceName === 'CloudFormation');

  const envResolver = serverless.variables.variableResolvers
    .find(({ regex }) => regex?.toString()?.includes('env:'));

  const ssmValue = ssmResolver && await ssmResolver.resolver('ssm:variable');
  const s3Value = s3Resolver && await s3Resolver.resolver('s3:variable');
  const cfValue = cfResolver && await cfResolver.resolver('cf:variable');
  const envValue = envResolver && await envResolver.resolver('env:variable');

  expect(ssmValue).toEqual('replaced-ssm');
  expect(s3Value).toEqual('replaced-s3');
  expect(cfValue).toEqual('replaced-cf');
  expect(envValue).toEqual('replaced-env');
});

test('does nothing when stage does not match', async () => {
  const serverless = createServerless();

  new Plugin(serverless, { stage: 'prod', region: '' });

  const ssmResolver = serverless.variables.variableResolvers
    .find(({ serviceName }) => serviceName === 'SSM');

  const s3Resolver = serverless.variables.variableResolvers
    .find(({ serviceName }) => serviceName === 'S3');

  const cfResolver = serverless.variables.variableResolvers
    .find(({ serviceName }) => serviceName === 'CloudFormation');

  const envResolver = serverless.variables.variableResolvers
    .find(({ regex }) => regex?.toString()?.includes('env:'));

  const ssmValue = ssmResolver && await ssmResolver.resolver('ssm:variable');
  const s3Value = s3Resolver && await s3Resolver.resolver('s3:variable');
  const cfValue = cfResolver && await cfResolver.resolver('cf:variable');
  const envValue = envResolver && await envResolver.resolver('env:variable');

  expect(ssmValue).toEqual('original-ssm');
  expect(s3Value).toEqual('original-s3');
  expect(cfValue).toEqual('original-cf');
  expect(envValue).toEqual('original-env');
});
