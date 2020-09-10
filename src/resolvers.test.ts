import { isWatched, extractFeature } from './resolvers';

describe('isWatched()', () => {
  test('returns true for watched resolver by name', () => {
    const resolver = { serviceName: 'SSM', regex: /.+/, resolver: async () => null };

    expect(isWatched(resolver)).toEqual(true);
  });

  test('returns true for watched resolver by regex', () => {
    const resolver = { regex: /^env:/, resolver: async () => null };

    expect(isWatched(resolver)).toEqual(true);
  });

  test('returns false for unknown resolver', () => {
    const resolver = { regex: /self:(.+)/, resolver: async () => null };

    expect(isWatched(resolver)).toEqual(false);
  });
});
