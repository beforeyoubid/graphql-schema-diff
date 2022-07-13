import Schema from '../index';

describe('Fields', () => {
  describe('addFields', () => {
    it('should find new field', async () => {
      const schemaOne = `type User {
        id: Int
      }`;
      const schemaTwo = `type User {
        id: Int
        email: String
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.addedFields).not.toHaveLength(0);
    });
    it('should find new field in extended type', async () => {
      const schemaOne = `extend type User {
        id: Int
      }`;
      const schemaTwo = `extend type User {
        id: Int
        email: String
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.addedFields).not.toHaveLength(0);
    });
  });
  describe('removedFields', () => {
    it('should find removed field', async () => {
      const schemaOne = `type User {
        id: Int
        email: String
      }`;
      const schemaTwo = `type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedFields).not.toHaveLength(0);
    });
    it('should find removed field in extended type', async () => {
      const schemaOne = `extend type User {
        id: Int
        email: String
      }`;
      const schemaTwo = `extend type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedFields).not.toHaveLength(0);
    });
    describe('config.showDeprecatedAlongsideRegularRemovals', () => {
      it('true - should find removed field w/ deprecated directive', async () => {
        const schemaOne = `type User {
          id: Int
          email: String @deprecated
        }`;
        const schemaTwo = `type User {
          id: Int
        }`;
        const schema = new Schema(schemaOne, schemaTwo, { showDeprecatedAlongsideRegularRemovals: true });
        const mismatches = await schema.compareSchemas();
        expect(mismatches.removedFields).not.toHaveLength(0);
      });
      it('true - should find removed extended field w/ deprecated directive', async () => {
        const schemaOne = `extend type User {
        id: Int
        email: String @deprecated
      }`;
        const schemaTwo = `extend type User {
        id: Int
      }`;
        const schema = new Schema(schemaOne, schemaTwo, { showDeprecatedAlongsideRegularRemovals: true });
        const mismatches = await schema.compareSchemas();
        expect(mismatches.removedFields).not.toHaveLength(0);
      });
      it('false - should not find removed field w/ deprecated directive', async () => {
        const schemaOne = `type User {
          id: Int
          email: String @deprecated
        }`;
        const schemaTwo = `type User {
          id: Int
        }`;
        const schema = new Schema(schemaOne, schemaTwo, { showDeprecatedAlongsideRegularRemovals: false });
        const mismatches = await schema.compareSchemas();
        expect(mismatches.removedFields).toHaveLength(0);
      });
      it('false - should not find removed extended field w/ deprecated directive', async () => {
        const schemaOne = `extend type User {
        id: Int
        email: String @deprecated
      }`;
        const schemaTwo = `extend type User {
        id: Int
      }`;
        const schema = new Schema(schemaOne, schemaTwo, { showDeprecatedAlongsideRegularRemovals: false });
        const mismatches = await schema.compareSchemas();
        expect(mismatches.removedFields).toHaveLength(0);
      });
    });
  });
  describe('removedDeprecatedFields', () => {
    it('should find removed field', async () => {
      const schemaOne = `type User {
        id: Int
        email: String @deprecated
      }`;
      const schemaTwo = `type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedDeprecatedFields).not.toHaveLength(0);
    });
    it('should find removed field in extended type', async () => {
      const schemaOne = `extend type User {
        id: Int
        email: String @deprecated
      }`;
      const schemaTwo = `extend type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedDeprecatedFields).not.toHaveLength(0);
    });
  });
  describe('fieldTypesChanged', () => {
    it('should find changed field types', async () => {
      const schemaOne = `type User {
        id: String
      }`;
      const schemaTwo = `type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldTypesChanged).not.toHaveLength(0);
    });
    it('should find changed field types in extended types', async () => {
      const schemaOne = `extend type User {
        id: String
      }`;
      const schemaTwo = `extend type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldTypesChanged).not.toHaveLength(0);
    });
    it('should catch field type changes when the underlying type where both are non-null changes', async () => {
      const schemaOne = `type User {
        id: String
        email: String!
      }`;
      const schemaTwo = `type User {
        id: String
        email: [String]!
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldTypesChanged).not.toHaveLength(0);
    });
    it('should catch field type changes when the underlying type in a list changes', async () => {
      const schemaOne = `type Ocean {
        fish: Fish
      }
      type Fish {
        kind: String
      }`;
      const schemaTwo = `type Ocean {
        fish: [Fish]
      }
      type Fish {
        kind: String
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldTypesChanged).not.toHaveLength(0);
    });
  });
  describe('fieldsMadeNotNull', () => {
    it('should find types made not null', async () => {
      const schemaOne = `type User {
        id: Int
      }`;
      const schemaTwo = `type User {
        id: Int!
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldsMadeNotNull).not.toHaveLength(0);
    });
    it('should find types made not null in extended type', async () => {
      const schemaOne = `extend type User {
        id: Int
      }`;
      const schemaTwo = `extend type User {
        id: Int!
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldsMadeNotNull).not.toHaveLength(0);
    });
  });
  describe('fieldsMadeNullable', () => {
    it('should find types made not null', async () => {
      const schemaOne = `type User {
        id: Int!
      }`;
      const schemaTwo = `type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldsMadeNullable).not.toHaveLength(0);
    });
    it('should find types made not null in extended type', async () => {
      const schemaOne = `extend type User {
        id: Int!
      }`;
      const schemaTwo = `extend type User {
        id: Int
      }`;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.fieldsMadeNullable).not.toHaveLength(0);
    });
  });
});
