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

export type MatchingDef =
  | ObjectTypeDefinitionNode
  | InterfaceTypeDefinitionNode
  | OperationDefinitionNode
  | InputObjectTypeDefinitionNode
  | ScalarTypeDefinitionNode
  | ObjectTypeExtensionNode;

export function isMatchingType(def: DefinitionNode): def is MatchingDef {
  return (
    isObjectDefinition(def) ||
    isInterfaceDefinition(def) ||
    isOperation(def) ||
    isInputObject(def) ||
    isScalarDefinition(def) ||
    isObjectExtension(def)
  );
}

export type Argument = { argument: InputValueDefinitionNode; field: FieldDefinitionNode; type: NamedObjectType };
export type MismatchedField = {
  /**
   * the [`field`](https://spec.graphql.org/June2018/#FieldDefinition) that has changed.
   */
  field: Field;
  /**
   * the `type` that the field that changed belongs to.
   *
   * (either [Object type](https://spec.graphql.org/June2018/#sec-Objects) or [Input type](https://spec.graphql.org/June2018/#sec-Input-Objects))
   */
  type: NamedObjectType;
};
export type MismatchedFieldWithArguments = MismatchedField & { to: Field };
export type MismatchedTypeChange = { from: NamedObjectType; to: NamedObjectType };
export type MismatchArgumentTypeChange = Argument & { to: InputValueDefinitionNode };

export type Mismatches = {
  /**
   * `addedTypes` includes a list of GraphQL types added in the new schema.
   *
   * (either [Object type](https://spec.graphql.org/June2018/#sec-Objects) or [Input type](https://spec.graphql.org/June2018/#sec-Input-Objects))
   */
  addedTypes: NamedObjectType[];
  /**
   * `removedTypes` includes a list of GraphQL types removed in the new schema.
   *
   * (either [Object type](https://spec.graphql.org/June2018/#sec-Objects) or [Input type](https://spec.graphql.org/June2018/#sec-Input-Objects))
   *
   * This will not contain any types that were deprecated in the previous schema, unless the configuration value `showDeprecatedAlongsideRegularRemovals` is set to `true`.
   */
  removedTypes: NamedObjectType[];
  /**
   * `removedDeprecatedFields` includes a list of GraphQL types removed in the new schema that were deprecated in the previous schema.
   *
   * (either [Object type](https://spec.graphql.org/June2018/#sec-Objects) or [Input type](https://spec.graphql.org/June2018/#sec-Input-Objects))
   */
  removedDeprecatedTypes: NamedObjectType[];
  /**
   * `typesMadeDeprecated` includes a list of types newly made deprecated alongside the [reason](https://spec.graphql.org/June2018/#sec--deprecated) for deprecation as specified on the [`@deprecated`](https://spec.graphql.org/June2018/#sec--deprecated) directive.
   *
   * (either [Object type](https://spec.graphql.org/June2018/#sec-Objects) or [Input type](https://spec.graphql.org/June2018/#sec-Input-Objects))
   */
  typesMadeDeprecated: { type: NamedObjectType; reason?: string }[];

  /**
   * `addedFields` includes a list of [fields](https://spec.graphql.org/June2018/#FieldDefinition) newly added to the new schema.
   *
   * This list includes the type that the field is attached to also.
   */
  addedFields: MismatchedField[];
  /**
   * `removedFields` includes a list of [fields](https://spec.graphql.org/June2018/#FieldDefinition) removed in the new schema.
   *
   * This list includes the type that the field is attached to also.
   *
   * This will not contain any fields that were deprecated in the previous schema, unless the configuration value `showDeprecatedAlongsideRegularRemovals` is set to `true`.
   */
  removedFields: MismatchedField[];
  /**
   * `removedDeprecatedFields` includes a list of [fields](https://spec.graphql.org/June2018/#FieldDefinition) removed in the new schema that were deprecated in the previous schema.
   *
   * This list includes the type that the field is attached to also.
   */
  removedDeprecatedFields: MismatchedField[];

  /**
   * `fieldsMadeNotNull` includes a list of [fields](https://spec.graphql.org/June2018/#FieldDefinition) that were made not-null in the new schema that were nullable in the last schema.
   *
   * This list includes the type that the field is attached to also.
   */
  fieldsMadeNotNull: MismatchedField[];
  /**
   * `fieldsMadeNullable` includes a list of [fields](https://spec.graphql.org/June2018/#FieldDefinition) that were made nullable in the new schema that were not-null in the last schema.
   *
   * This list includes the type that the field is attached to also.
   */
  fieldsMadeNullable: MismatchedField[];

  /**
   * `addedScalars` includes a list of [scalars](https://spec.graphql.org/June2018/#sec-Scalars) added in the new schema that were not in the previous schema.
   */
  addedScalars: ScalarTypeDefinitionNode[];
  /**
   * `removedScalars` includes a list of [scalars](https://spec.graphql.org/June2018/#sec-Scalars) removed in the new schema that were in the previous schema.
   */
  removedScalars: ScalarTypeDefinitionNode[];
  /**
   * `fieldTypesChanged` includes a list of [fields](https://spec.graphql.org/June2018/#FieldDefinition) that had their type changed (ie from `Int` to `String`)
   *
   * (either [Object type](https://spec.graphql.org/June2018/#sec-Objects) or [Input type](https://spec.graphql.org/June2018/#sec-Input-Objects))
   */
  fieldTypesChanged: MismatchedFieldWithArguments[];
  /**
   * `addedArguments` includes a list of [arguments](https://spec.graphql.org/June2018/#sec-Field-Arguments) added to fields in the new schema that weren't in the previous schema.
   *
   * The list of results includes the type and field the argument is attached to.
   */
  addedArguments: Argument[];
  /**
   * `addedNotNullArguments` includes a list of not null [arguments](https://spec.graphql.org/June2018/#sec-Field-Arguments) added to fields in the new schema that weren't in the previous schema.
   *
   * The list of results includes the type and field the argument is attached to.
   */
  addedNotNullArguments: Argument[];
  /**
   * `removedArguments` includes a list of [arguments](https://spec.graphql.org/June2018/#sec-Field-Arguments) removed from fields in the new schema that were in the previous schema.
   *
   * The list of results includes the type and field the argument is attached to.
   */
  removedArguments: Argument[];
  /**
   * `argumentTypesChanged` includes a list of [arguments](https://spec.graphql.org/June2018/#sec-Field-Arguments) on fields that had their type changed between schema versions.
   *
   * The list of results includes the type and field the argument is attached to.
   */
  argumentTypesChanged: MismatchArgumentTypeChange[];
  /**
   * `argumentsMadeNotNull` includes a list of [arguments](https://spec.graphql.org/June2018/#sec-Field-Arguments) on fields that had their type made not null where it was previously nullable.
   *
   * The list of results includes the type and field the argument is attached to.
   */
  argumentsMadeNotNull: Argument[];
  /**
   * `argumentsMadeNullable` includes a list of [arguments](https://spec.graphql.org/June2018/#sec-Field-Arguments) on fields that had their type made nullable where it was previously not null.
   *
   * The list of results includes the type and field the argument is attached to.
   */
  argumentsMadeNullable: Argument[];
  /**
   * `typesChanged` includes a list of types that had their type changed (ie from `Input` to `Type` or vice-versa)
   *
   * (either [Object type](https://spec.graphql.org/June2018/#sec-Objects) or [Input type](https://spec.graphql.org/June2018/#sec-Input-Objects))
   */
  typesChanged: MismatchedTypeChange[];
};

/**
 * Configuration for the `Schema` constructor
 */
export type Config = {
  /**
   * This argument controls whether fields/types that are removed show inside the `removedFields`/`removedTypes` or not.
   *
   * Default to `false`
   */
  showDeprecatedAlongsideRegularRemovals?: boolean;
};
