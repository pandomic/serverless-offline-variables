import { parseDotEnv } from './parser';

const sampleContent = `
  env:my-great-env-resource=Hello World
  cf:my-great-cloud-formation-resource="arn::xxx:xxx:xxx-xxx"
  ssm:my-great-ssm-value="my partially quoted secret
`;

test('parses env file', () => {
  expect(parseDotEnv(sampleContent)).toEqual({
    'env:my-great-env-resource': 'Hello World',
    'cf:my-great-cloud-formation-resource': 'arn::xxx:xxx:xxx-xxx',
    'ssm:my-great-ssm-value': '"my partially quoted secret'
  });
});
