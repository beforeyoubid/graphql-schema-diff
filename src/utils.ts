import { Config } from './types';

export const DEFAULT_CONFIG: Required<Config> = {
  showDeprecatedAlongsideRegularRemovals: false,
};

export function combineConfig(config: Partial<Config>): Required<Config> {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}
