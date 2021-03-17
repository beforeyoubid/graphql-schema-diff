import Schema from '../index';

describe('Arguments', () => {
  describe('addArguments', () => {
    it('should find new arguments', async () => {
      const schemaOne = `type Query {
        unix: Int
      }`;
      const schemaTwo = `type Query {
        unix(milliseconds: Boolean = false): Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.addedArguments).not.toHaveLength(0);
    });
  });
  describe('removedArguments', () => {
    it('should find removed arguments', async () => {
      const schemaOne = `type Query {
        unix(milliseconds: Boolean = false): Int
      }`;
      const schemaTwo = `type Query {
        unix: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedArguments).not.toHaveLength(0);
    });
  });
  describe('argumentTypesChanged', () => {
    it('should find changed arguments types', async () => {
      const schemaOne = `type Query {
        dayOfMonth(includeWeekends: String): Int
      }`;
      const schemaTwo = `type Query {
        dayOfMonth(includeWeekends: Boolean): Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.argumentTypesChanged).not.toHaveLength(0);
    });
    it('should catch argument type changes when the underlying type where both are non-null changes', async () => {
      const schemaOne = `type Query {
        dayOfMonth(includeWeekends: String!): Int
      }`;
      const schemaTwo = `type Query {
        dayOfMonth(includeWeekends: Boolean!): Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.argumentTypesChanged).not.toHaveLength(0);
    });
    it('should catch argument type changes when the underlying type in a list changes', async () => {
      const schemaOne = `type Query {
        unixAt(days: [String]!): [Int]
      }`;
      const schemaTwo = `type Query {
        unixAt(days: [Int]!): [Int]
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.argumentTypesChanged).not.toHaveLength(0);
    });
  });
  describe('argumentsMadeNotNull', () => {
    it('should find types made not null', async () => {
      const schemaOne = `type Query {
        dayOfMonth(includeWeekends: Boolean): Int
      }`;
      const schemaTwo = `type Query {
        dayOfMonth(includeWeekends: Boolean!): Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.argumentsMadeNotNull).not.toHaveLength(0);
    });
  });
  describe('argumentsMadeNullable', () => {
    it('should find types made not null', async () => {
      const schemaOne = `type Query {
        dayOfMonth(includeWeekends: Boolean!): Int
      }`;
      const schemaTwo = `type Query {
        dayOfMonth(includeWeekends: Boolean): Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.argumentsMadeNullable).not.toHaveLength(0);
    });
  });
});
