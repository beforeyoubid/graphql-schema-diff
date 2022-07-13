import { Config, Mismatches } from './types';

export const DEFAULT_CONFIG: Required<Config> = {
  showDeprecatedAlongsideRegularRemovals: false,
};

export const DEFAULT_MISMATCHES = (): Mismatches => ({
  addedTypes: [],
  // addedOperations: [],
  addedFields: [],
  addedScalars: [],

  removedTypes: [],
  removedDeprecatedTypes: [],
  // removedOperations: [],
  removedFields: [],
  removedDeprecatedFields: [],
  removedScalars: [],

  fieldTypesChanged: [],
  fieldsMadeNotNull: [],
  fieldsMadeNullable: [],

  addedArguments: [],
  addedNotNullArguments: [],
  removedArguments: [],
  argumentTypesChanged: [],
  argumentsMadeNotNull: [],
  argumentsMadeNullable: [],

  typesChanged: [],
  // operationFieldsMadeNotNull: [],
  // operationFieldsMadeNullable: [],
});

export function combineConfig(config: Partial<Config>): Required<Config> {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}
