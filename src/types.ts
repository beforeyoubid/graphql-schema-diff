import {
  DefinitionNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
  OperationDefinitionNode,
  ScalarTypeDefinitionNode,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectTypeExtensionNode,
} from 'graphql';

export type NamedObjectType = ObjectTypeDefinitionNode | InputObjectTypeDefinitionNode;
export type Field = FieldDefinitionNode | InputValueDefinitionNode;
export const isNamedObjectType = (node: Maybe<DefinitionNode>): node is NamedObjectType =>
  isObjectDefinition(node) || isInputObject(node) || isScalarDefinition(node) || isObjectExtension(node);

export type Maybe<T> = null | undefined | T;
export const notEmpty = <TValue>(value: Maybe<TValue>): value is TValue => value !== null && value !== undefined;
export const isInputValueDefinition = (value: Maybe<Field>): value is InputValueDefinitionNode =>
  notEmpty(value) && value.kind === 'InputValueDefinition';
export const isObjectDefinition = (value: Maybe<DefinitionNode>): value is ObjectTypeDefinitionNode =>
  notEmpty(value) && value.kind === 'ObjectTypeDefinition';
export const isObjectExtension = (value: Maybe<DefinitionNode>): value is ObjectTypeExtensionNode =>
  notEmpty(value) && value.kind === 'ObjectTypeExtension';
export const isInterfaceDefinition = (value: Maybe<DefinitionNode>): value is InterfaceTypeDefinitionNode =>
  notEmpty(value) && value.kind === 'InterfaceTypeDefinition';
export const isOperation = (value: Maybe<DefinitionNode>): value is OperationDefinitionNode =>
  notEmpty(value) && value.kind === 'OperationDefinition';
export const isInputObject = (value: Maybe<DefinitionNode>): value is InputObjectTypeDefinitionNode =>
  notEmpty(value) && value.kind === 'InputObjectTypeDefinition';
export const isFieldDefinition = (value: Maybe<Field>): value is FieldDefinitionNode =>
  notEmpty(value) && value.kind === 'FieldDefinition';
export const isInputValueBasicObject = (value: Maybe<InputValueDefinitionNode['type']>): value is NamedTypeNode =>
  notEmpty(value) && value.kind === 'NamedType';
export const isInputValueNonNull = (value: Maybe<InputValueDefinitionNode['type']>): value is NonNullTypeNode =>
  notEmpty(value) && value.kind === 'NonNullType';
export const isInputValueList = (value: Maybe<InputValueDefinitionNode['type']>): value is ListTypeNode =>
  notEmpty(value) && value.kind === 'ListType';
export const isScalarDefinition = (value: Maybe<DefinitionNode>): value is ScalarTypeDefinitionNode =>
  notEmpty(value) && value.kind === 'ScalarTypeDefinition';

export type Argument = { argument: InputValueDefinitionNode; field: FieldDefinitionNode; type: NamedObjectType };
export type MismatchedField = { field: Field; type: NamedObjectType };
export type MismatchedFieldWithArguments = MismatchedField & { to: Field };
export type MismatchedTypeChange = { from: NamedObjectType; to: NamedObjectType };
export type MismatchArgumentTypeChange = Argument & { to: InputValueDefinitionNode };

export type Mismatches = {
  // [key: string]: DefinitionNode[],
  addedTypes: NamedObjectType[];
  addedScalars: ScalarTypeDefinitionNode[];
  removedScalars: ScalarTypeDefinitionNode[];
  removedTypes: NamedObjectType[];

  addedFields: MismatchedField[];
  removedFields: MismatchedField[];

  fieldsMadeNotNull: MismatchedField[];
  fieldsMadeNullable: MismatchedField[];

  fieldTypesChanged: MismatchedFieldWithArguments[];
  addedArguments: Argument[];
  addedNotNullArguments: Argument[];
  removedArguments: Argument[];
  argumentTypesChanged: MismatchArgumentTypeChange[];
  argumentsMadeNotNull: Argument[];
  argumentsMadeNullable: Argument[];
  typesChanged: MismatchedTypeChange[];
};
