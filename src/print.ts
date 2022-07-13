import chalk from 'chalk';
import { InputValueDefinitionNode, ScalarTypeDefinitionNode } from 'graphql';
import {
  isInputValueBasicObject,
  isInputValueNonNull,
  isInputValueList,
  NamedObjectType,
  MismatchedField,
  MismatchedTypeChange,
  MismatchedFieldWithArguments,
  MismatchArgumentTypeChange,
  Argument,
} from './types';

export const printFieldType = (type: InputValueDefinitionNode['type']): string =>
  isInputValueBasicObject(type)
    ? type.name.value
    : isInputValueNonNull(type)
    ? `${printFieldType(type.type)}!`
    : isInputValueList(type)
    ? `[${printFieldType(type.type)}]`
    : '';
export const printType =
  (color: 'red' | 'green') =>
  (type: NamedObjectType | ScalarTypeDefinitionNode): string =>
    chalk[color](type.name.value);
export const printField =
  (color: 'red' | 'green') =>
  ({ field, type }: MismatchedField): string =>
    chalk[color](`${type.name.value}.${field.name?.value ?? ''}`);
export const printFieldTypeChange =
  (color: 'red' | 'green') =>
  ({ field, type, to }: MismatchedFieldWithArguments): string =>
    chalk[color](
      `${type.name.value}.${field.name?.value ?? ''}: ${printFieldType(field.type)} -> ${printFieldType(to.type)}`
    );
export const printTypeChange =
  (color: 'red' | 'green') =>
  ({ from, to }: MismatchedTypeChange): string =>
    chalk[color](`${from.kind} -> ${to.kind}`);
export const printArgument =
  (color: 'red' | 'green') =>
  ({ field, type, argument }: Argument): string =>
    chalk[color](`${type.name.value}.${field.name?.value ?? ''}(${argument.name.value})`);
export const printArgumentTypeChanges =
  (color: 'red' | 'green') =>
  ({ field, type, argument, to }: MismatchArgumentTypeChange): string =>
    chalk[color](
      `${type.name.value}.${field.name?.value ?? ''}(${argument.name.value}: ${printFieldType(
        argument.type
      )} -> ${printFieldType(to.type)})`
    );
