import { combineConfig, DEFAULT_CONFIG } from '../utils';

describe('combineConfig', () => {
  it('should return default value if not present', () => {
    expect(combineConfig({})).toStrictEqual(DEFAULT_CONFIG);
  });
  it('should return value if present', () => {
    const values = [true, false];
    for (const value of values) {
      expect(combineConfig({ showDeprecatedAlongsideRegularRemovals: value })).toStrictEqual({
        ...DEFAULT_CONFIG,
        showDeprecatedAlongsideRegularRemovals: value,
      });
    }
  });
});
