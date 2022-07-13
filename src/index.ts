import { FieldDefinitionNode, parse, InputValueDefinitionNode, DocumentNode } from 'graphql';
import {
  Maybe,
  Field,
  NamedObjectType,
  isFieldDefinition,
  isInputValueBasicObject,
  isInputValueDefinition,
  isInputValueNonNull,
  isNamedObjectType,
  isScalarDefinition,
  isMatchingType,
  MatchingDef,
  notEmpty,
  Mismatches,
  Config,
} from './types';
import { combineConfig, DEFAULT_MISMATCHES } from './utils';

export * from './print';

export default class Schema {
  types: DocumentNode;
  types2: DocumentNode;
  config: Required<Config>;
  private mismatches: Mismatches = DEFAULT_MISMATCHES;

  constructor(schema1: DocumentNode | string, schema2: DocumentNode | string, userConfig?: Config) {
    this.types = typeof schema1 === 'string' ? parse(schema1) : schema1;
    this.types2 = typeof schema2 === 'string' ? parse(schema2) : schema2;
    this.config = combineConfig(userConfig ?? {});
  }
  private instantiateMismatches() {
    this.mismatches = DEFAULT_MISMATCHES;
  }

  findOtherType(type: MatchingDef, side: 'first' | 'second'): Maybe<MatchingDef> {
    const matchFunction = (def: MatchingDef) => {
      return def.name?.value === type.name?.value;
    };
    if (side === 'first') return this.types2.definitions.filter(isMatchingType).find(matchFunction);
    if (side === 'second') return this.types.definitions.filter(isMatchingType).find(matchFunction);
  }

  async iterateFirstTypes(): Promise<void> {
    const matchingDefinitions = this.types.definitions.filter(isMatchingType);
    for (const type of matchingDefinitions) {
      const matchingType = this.findOtherType(type, 'first');

      if (!matchingType && isNamedObjectType(type)) {
        if (isScalarDefinition(type)) {
          this.mismatches.removedScalars.push(type);
        } else {
          const wasDeprecated = (type.directives ?? []).some(directive => directive.name.value === 'deprecated');
          if (wasDeprecated) {
            this.mismatches.removedDeprecatedTypes.push(type);
          }
          if (wasDeprecated && this.config.showDeprecatedAlongsideRegularRemovals) {
            this.mismatches.removedTypes.push(type);
          }
          if (!wasDeprecated) {
            this.mismatches.removedTypes.push(type);
          }
        }
      }

      if (matchingType && isNamedObjectType(matchingType) && isNamedObjectType(type)) {
        await this.compareTypes(type, matchingType);
      }
    }
  }

  async iterateSecondTypes(): Promise<void> {
    const matchingDefinitions = this.types2.definitions.filter(isMatchingType);
    for (const type of matchingDefinitions) {
      const matchingType = this.findOtherType(type, 'second');
      if (matchingType) continue;

      if (!isNamedObjectType(type)) continue;

      if (isScalarDefinition(type)) {
        this.mismatches.addedScalars.push(type);
      } else {
        this.mismatches.addedTypes.push(type);
      }
    }
  }

  async compareSchemas(): Promise<Mismatches> {
    this.instantiateMismatches();
    await this.iterateFirstTypes();
    await this.iterateSecondTypes();
    return this.mismatches;
  }

  async compareFieldTypes(
    type: InputValueDefinitionNode['type'],
    type2: InputValueDefinitionNode['type'],
    field: Field,
    field2: Field,
    objectType: NamedObjectType,
    isArgument = false,
    argumentField?: FieldDefinitionNode
  ): Promise<void> {
    if (isArgument && !notEmpty(argumentField)) return;
    if (type.kind !== type2.kind) {
      if (isInputValueNonNull(type2)) {
        if (isArgument && notEmpty(argumentField) && isInputValueDefinition(field)) {
          this.mismatches.argumentsMadeNotNull.push({ field: argumentField, type: objectType, argument: field });
        } else {
          this.mismatches.fieldsMadeNotNull.push({ field, type: objectType });
        }
      } else if (isInputValueNonNull(type)) {
        if (isArgument && notEmpty(argumentField) && isInputValueDefinition(field)) {
          this.mismatches.argumentsMadeNullable.push({ field: argumentField, type: objectType, argument: field });
        } else {
          this.mismatches.fieldsMadeNullable.push({ field, type: objectType });
        }
      } else {
        if (isInputValueDefinition(field) && isInputValueDefinition(field2) && isArgument && notEmpty(argumentField)) {
          this.mismatches.argumentTypesChanged.push({
            field: argumentField,
            type: objectType,
            to: field2,
            argument: field,
          });
        } else {
          this.mismatches.fieldTypesChanged.push({ field, type: objectType, to: field2 });
        }
      }
    } else {
      if (!isInputValueBasicObject(type) && !isInputValueBasicObject(type2)) {
        return await this.compareFieldTypes(
          type.type,
          type2.type,
          field,
          field2,
          objectType,
          isArgument,
          argumentField
        );
      } else {
        if (isInputValueBasicObject(type) && isInputValueBasicObject(type2)) {
          if (type.name.value !== type2.name.value) {
            if (
              isArgument &&
              notEmpty(argumentField) &&
              isInputValueDefinition(field) &&
              isInputValueDefinition(field2)
            ) {
              this.mismatches.argumentTypesChanged.push({
                field: argumentField,
                type: objectType,
                to: field2,
                argument: field,
              });
            } else {
              this.mismatches.fieldTypesChanged.push({ field, type: objectType, to: field2 });
            }
          }
        }
      }
    }
  }
  async compareFields(field: Field, field2: Field, type: NamedObjectType): Promise<void> {
    await this.compareFieldTypes(field.type, field2.type, field, field2, type);
    if (isFieldDefinition(field)) {
      if (field.arguments !== undefined && field.arguments.length > 0) {
        for (const argument of field.arguments) {
          const matchingArgument =
            isFieldDefinition(field2) && field2.arguments !== undefined
              ? field2.arguments.find(arg => arg.name.value === argument.name.value)
              : undefined;
          if (!matchingArgument) {
            this.mismatches.removedArguments.push({ field, argument, type });
            continue;
          }
          await this.compareFieldTypes(
            argument.type,
            matchingArgument.type,
            argument,
            matchingArgument,
            type,
            true,
            field
          );
        }
      }
    }
    if (isFieldDefinition(field2)) {
      if (field2.arguments !== undefined && field2.arguments.length > 0) {
        for (const argument of field2.arguments) {
          const matchingArgument =
            isFieldDefinition(field) && field.arguments !== undefined
              ? field.arguments.find(arg => arg.name.value === argument.name.value)
              : undefined;
          if (!matchingArgument) {
            if (!isInputValueBasicObject(argument.type) && argument.type.kind === 'NonNullType') {
              this.mismatches.addedNotNullArguments.push({ field: field2, argument, type });
            } else {
              this.mismatches.addedArguments.push({ field: field2, argument, type });
            }
            continue;
          }
          if (argument.type.kind !== matchingArgument.type.kind) {
            if (matchingArgument.type.kind === 'NonNullType') {
              this.mismatches.argumentsMadeNullable.push({ argument, type, field: field2 });
            }
          }
        }
      }
    }
  }
  async compareTypes(type1: NamedObjectType, type2: NamedObjectType): Promise<void> {
    if (type1.kind !== type2.kind) this.mismatches.typesChanged.push({ from: type1, to: type2 });
    for (const field of type1.fields ?? []) {
      const fields: readonly Field[] = type2.fields ?? [];
      const matchingField = fields.find(newField => newField.name.value == field.name.value);
      if (!matchingField) {
        const wasDeprecated = (field.directives ?? []).some(directive => directive.name.value === 'deprecated');
        if (wasDeprecated) {
          this.mismatches.removedDeprecatedFields.push({ field, type: type2 });
          if (this.config.showDeprecatedAlongsideRegularRemovals) {
            this.mismatches.removedFields.push({ field, type: type2 });
          }
        } else {
          this.mismatches.removedFields.push({ field, type: type2 });
        }
        continue;
      }

      await this.compareFields(field, matchingField, type1);
    }
    for (const field of type2.fields ?? []) {
      const fields: readonly Field[] = type1.fields ?? [];
      const matchingField = fields.find(newField => newField.name.value == field.name.value);
      if (!matchingField) {
        this.mismatches.addedFields.push({ field, type: type2 });
        continue;
      }
    }
  }
}
