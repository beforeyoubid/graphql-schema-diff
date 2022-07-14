# graphql-schema-diff

Diff GraphQL schemas to find differences between schema versions

[![Maintainability](https://api.codeclimate.com/v1/badges/92660a94b6641ac7b256/maintainability)](https://codeclimate.com/github/beforeyoubid/graphql-schema-diff/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/92660a94b6641ac7b256/test_coverage)](https://codeclimate.com/github/beforeyoubid/graphql-schema-diff/test_coverage)

## Install

Install by typing

```sh
npm install @beforeyoubid/graphql-schema-diff
```

```sh
yarn add @beforeyoubid/graphql-schema-diff
```

## Usage

You can use like the following:

```ts
import Schema from '@beforeyoubid/graphql-schema-diff';

const previousSchema = `.....`;
const currentSchema = `.....`;

const schema = new Schema(previousSchema, currentSchema);
const mismatches = await schema.compareSchemas();
```

### Printing

You can print the schema values by using some of the print utils:

```ts
import Schema, { printType, printField } from '@beforeyoubid/graphql-schema-diff';

const previousSchema = `.....`;
const currentSchema = `.....`;

const schema = new Schema(previousSchema, currentSchema);
const mismatches = await schema.compareSchemas();

let msg = '';
if (mismatches.addedTypes.length > 0) {
  msg += ` - Added types: ${mismatches.addedTypes.map(printType('green')).map(tilde).join(', ')}`;
}
if (mismatches.removedTypes.length > 0) {
  msg += ` - Removed types: ${mismatches.removedTypes.map(printType('red')).map(tilde).join(', ')}`;
}
if (mismatches.addedFields.length > 0) {
  msg += ` - Added fields: ${mismatches.addedFields.map(printField('green')).map(tilde).join(', ')}`;
}
if (mismatches.removedFields.length > 0) {
  msg += ` - Removed fields: ${mismatches.removedFields.map(printField('red')).map(tilde).join(', ')}`;
}
console.log(msg);
```

## Documentation

### Config

#### `config.showDeprecatedAlongsideRegularRemovals`

The parameter `showDeprecatedAlongsideRegularRemovals` controls whether removed fields/types that were marked deprecated
show in the `removed` mismatch outputs.

This defaults to `false`.

### Schema class

The `Schema` class is instatiated with the following arguments:

```ts
  constructor(
    schemaOne: string | DocumentNode, // either a string of the schema, or a GraphQL document node
    schemaTwo: string | DocumentNode, // either a string of the schema, or a GraphQL document node
    config: Config // see config section above
  )
```

#### `Schema`.`compareSchemas`

This function will result in an object containing the mismatches between the two schema versions. This object is
explained below in the mismatches section

### `Mismatches`

`Mismatches` containes all the differences between the two schemas, typically these are outputted as the AST nodes
returned by GraphQL when parsing these documents.

They contain the following properties:

#### `Mismatches.addedTypes`

`addedTypes` includes a list of GraphQL types added in the new schema. (either [Object type][1]) or [Input type][2])

#### `Mismatches.removedTypes`

`removedTypes` includes a list of GraphQL types removed in the new schema. (either Object type or Input type)

This will not contain any types that were deprecated in the previous schema, unless the configuration value
`showDeprecatedAlongsideRegularRemovals` is set to `true`.

#### `Mismatches.removedDeprecatedFields`

`removedDeprecatedFields` includes a list of GraphQL types removed in the new schema that were deprecated in the
previous schema. (either Object type or Input type).

This is an array containing the type alongside the [reason][3] for deprecation as specified on the [`@deprecated`][3]
directive.

#### `Mismatches.typesMadeDeprecated`

`typesMadeDeprecated` includes a list of types newly made deprecated alongside the [reason][3] for deprecation as
specified on the [`@deprecated`][3] directive. (either [Object type][1] or [Input type][2])

#### `Mismatches.addedFields`

`addedFields` includes a list of [fields][4] newly added to the new schema. This list includes the type that the field
is attached to also

#### `Mismatches.removedFields`

`removedFields` includes a list of [fields][4] removed in the new schema. This list includes the type that the field is
attached to also

This will not contain any fields that were deprecated in the previous schema, unless the configuration value
`showDeprecatedAlongsideRegularRemovals` is set to `true`.

#### `Mismatches.removedDeprecatedFields`

`removedDeprecatedFields` includes a list of [fields][4] removed in the new schema that were deprecated in the last
schema. This list includes the type that the field is attached to also.

#### `Mismatches.fieldsMadeNotNull`

`fieldsMadeNotNull` includes a list of [fields][4] that were made not-null in the new schema that were nullable in the
last schema. This list includes the type that the field is attached to also.

#### `Mismatches.addedScalars`

`addedScalars` includes a list of [scalars][5] added in the new schema that were not in the previous schema.

#### `Mismatches.removedScalars`

`removedScalars` includes a list of [scalars][5] removed in the new schema that were in the previous schema.

#### `Mismatches.fieldTypesChanged`

`fieldTypesChanged` includes a list of [fields][4] that had their type changed (ie from `Int` to `String`) (either
[Object type][1] or [Input type][2])

#### `Mismatches.addedArguments`

`addedArguments` includes a list of [arguments][6] added to fields in the new schema that weren't in the previous
schema.

The list of results includes the type and field the argument is attached to.

#### `Mismatches.addedNotNullArguments`

`addedNotNullArguments` includes a list of not null [arguments][6] added to fields in the new schema that weren't in the
previous schema.

The list of results includes the type and field the argument is attached to.

#### `Mismatches.removedArguments`

`removedArguments` includes a list of [arguments][6] removed from fields in the new schema that were in the previous
schema.

The list of results includes the type and field the argument is attached to.

#### `Mismatches.argumentTypesChanged`

`argumentTypesChanged` includes a list of [arguments][6] on fields that had their type changed between schema versions.

The list of results includes the type and field the argument is attached to.

#### `Mismatches.argumentsMadeNotNull`

`argumentsMadeNotNull` includes a list of [arguments][6] on fields that had their type made not null where it was
previously nullable.

The list of results includes the type and field the argument is attached to.

#### `Mismatches.argumentsMadeNullable`

`argumentsMadeNullable` includes a list of [arguments][6] on fields that had their type made nullable where it was
previously not null.

The list of results includes the type and field the argument is attached to.

#### `Mismatches.typesChanged`

`typesChanged` includes a list of types that had their type changed (ie from `Input` to `Type` or vice-versa).

[1]: https://spec.graphql.org/June2018/#sec-Objects
[2]: https://spec.graphql.org/June2018/#sec-Input-Objects
[3]: https://spec.graphql.org/June2018/#sec--deprecated
[4]: https://spec.graphql.org/June2018/#FieldDefinition
[5]: https://spec.graphql.org/June2018/#sec-Scalars
[6]: https://spec.graphql.org/June2018/#sec-Field-Arguments
