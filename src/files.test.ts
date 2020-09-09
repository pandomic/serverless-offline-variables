import { readFileContent } from './files';

test('reads file if file exists', () => {
  const content = readFileContent('resources/test-file.txt');
  expect(content?.trim()).toEqual('Hello World');
});

test('returns null if file does not exist', () => {
  const content = readFileContent('resources/non-existing-file.txt');
  expect(content).toEqual(null);
});
