import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectTypeDefinitionNode,
  ScalarTypeDefinitionNode,
} from 'graphql';
import chalk from 'chalk';
import Schema from '../index';
import {
  printFieldType,
  printType,
  printArgument,
  printArgumentTypeChanges,
  printField,
  printFieldTypeChange,
  printTypeChange,
} from '../print';

describe('Print utils', () => {
  describe('printFieldType', () => {
    it('should print non-null fields', () => {
      const node: NonNullTypeNode = {
        kind: 'NonNullType',
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        },
      };
      const output = printFieldType(node);
      expect(output).toEqual('Type!');
    });
    it('should print list fields', () => {
      const node: ListTypeNode = {
        kind: 'ListType',
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        },
      };
      const output = printFieldType(node);
      expect(output).toEqual('[Type]');
    });

    it('should print non-null list fields', () => {
      const node: NonNullTypeNode = {
        kind: 'NonNullType',
        type: {
          kind: 'ListType',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Type',
            },
          },
        },
      };
      const output = printFieldType(node);
      expect(output).toEqual('[Type]!');
    });
    it('should print regular fields', () => {
      const node: NamedTypeNode = {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'Type',
        },
      };
      const output = printFieldType(node);
      expect(output).toEqual('Type');
    });
  });
  describe('printType', () => {
    describe('color as red', () => {
      it('should print type names', () => {
        const node: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const output = printType('red')(node);
        expect(output).toEqual(chalk.red('Type'));
      });
      it('should print scalar type names', () => {
        const node: ScalarTypeDefinitionNode = {
          kind: 'ScalarTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const output = printType('red')(node);
        expect(output).toEqual(chalk.red('Type'));
      });
    });
    describe('color as green', () => {
      it('should print type names', () => {
        const node: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const output = printType('green')(node);
        expect(output).toEqual(chalk.green('Type'));
      });
      it('should print scalar type names', () => {
        const node: ScalarTypeDefinitionNode = {
          kind: 'ScalarTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const output = printType('green')(node);
        expect(output).toEqual(chalk.green('Type'));
      });
    });
  });
  describe('printField', () => {
    describe('color as red', () => {
      it('should print field names', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const output = printField('red')({ type, field });
        expect(output).toEqual(chalk.red('Type.Field'));
      });
    });
    describe('color as green', () => {
      it('should print field names', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const output = printField('green')({ type, field });
        expect(output).toEqual(chalk.green('Type.Field'));
      });
    });
  });
  describe('printFieldTypeChange', () => {
    describe('color as red', () => {
      it('should print field type change', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const to: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const output = printFieldTypeChange('red')({ type, field, to });
        expect(output).toEqual(chalk.red('Type.Field: Int -> String'));
      });
    });
    describe('color as green', () => {
      it('should print field type change', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const to: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const output = printFieldTypeChange('green')({ type, field, to });
        expect(output).toEqual(chalk.green('Type.Field: Int -> String'));
      });
    });
  });
  describe('printTypeChange', () => {
    describe('color as red', () => {
      it('should print type change', async () => {
        const schemaTwo = `type User {
          id: Int
        }`;
        const schemaOne = `input User {
          id: Int
        }
        `;
        const schema = new Schema(schemaOne, schemaTwo);
        const mismatches = await schema.compareSchemas();

        expect(mismatches.typesChanged).toHaveLength(1);
        expect(printTypeChange('red')(mismatches.typesChanged[0])).toEqual(
          chalk.red('InputObjectTypeDefinition -> ObjectTypeDefinition')
        );
      });
    });
    describe('color as green', () => {
      it('should print type change', async () => {
        const schemaTwo = `type User {
          id: Int
        }`;
        const schemaOne = `input User {
          id: Int
        }
        `;
        const schema = new Schema(schemaOne, schemaTwo);
        const mismatches = await schema.compareSchemas();

        expect(mismatches.typesChanged).toHaveLength(1);
        expect(printTypeChange('green')(mismatches.typesChanged[0])).toEqual(
          chalk.green('InputObjectTypeDefinition -> ObjectTypeDefinition')
        );
      });
    });
  });
  describe('printArgument', () => {
    describe('color as red', () => {
      it('should print field type change', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const argument: InputValueDefinitionNode = {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'Argument',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
        };
        const output = printArgument('red')({ type, field, argument });
        expect(output).toEqual(chalk.red('Type.Field(Argument)'));
      });
    });
    describe('color as green', () => {
      it('should print field type change', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const argument: InputValueDefinitionNode = {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'Argument',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
        };
        const output = printArgument('green')({ type, field, argument });
        expect(output).toEqual(chalk.green('Type.Field(Argument)'));
      });
    });
  });
  describe('printArgumentTypeChanges', () => {
    describe('color as red', () => {
      it('should print field type change', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const to: InputValueDefinitionNode = {
          kind: 'InputValueDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const argument: InputValueDefinitionNode = {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'Argument',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
        };
        const output = printArgumentTypeChanges('red')({ type, field, argument, to });
        expect(output).toEqual(chalk.red('Type.Field(Argument: Int -> String)'));
      });
    });
    describe('color as green', () => {
      it('should print field type change', () => {
        const type: ObjectTypeDefinitionNode = {
          kind: 'ObjectTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Type',
          },
        };
        const field: FieldDefinitionNode = {
          kind: 'FieldDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const to: InputValueDefinitionNode = {
          kind: 'InputValueDefinition',
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
          name: {
            kind: 'Name',
            value: 'Field',
          },
        };
        const argument: InputValueDefinitionNode = {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'Argument',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'Int',
            },
          },
        };
        const output = printArgumentTypeChanges('green')({ type, field, argument, to });
        expect(output).toEqual(chalk.green('Type.Field(Argument: Int -> String)'));
      });
    });
  });
});
