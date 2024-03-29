import Schema from '../index';

describe('Types', () => {
  describe('addTypes', () => {
    it('should find new types', async () => {
      const schemaOne = `type User {
        id: Int
      }`;
      const schemaTwo = `${schemaOne}
      type Company {
        id: Int
      }
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.addedTypes).not.toHaveLength(0);
    });
    describe('should find no new types if not present', () => {
      it('Type', async () => {
        const schemaOne = `type User {
          id: Int
        }`;
        const schemaTwo = schemaOne;
        const schema = new Schema(schemaOne, schemaTwo);
        const mismatches = await schema.compareSchemas();
        expect(mismatches.addedTypes).toHaveLength(0);
      });
      it('Input', async () => {
        const schemaOne = `input User {
          id: Int
        }`;
        const schemaTwo = schemaOne;
        const schema = new Schema(schemaOne, schemaTwo);
        const mismatches = await schema.compareSchemas();
        expect(mismatches.addedTypes).toHaveLength(0);
      });
    });
  });
  describe('removedTypes', () => {
    it('should find removed types', async () => {
      const schemaTwo = `type User {
        id: Int
      }`;
      const schemaOne = `${schemaTwo}
      type Company {
        id: Int
      }
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedTypes).not.toHaveLength(0);
    });
    describe('config.showDeprecatedAlongsideRegularRemovals', () => {
      it('true - should find removed type w/ deprecated directive', async () => {
        const schemaTwo = `type User {
        id: Int
      }`;
        const schemaOne = `${schemaTwo}
      type Company @deprecated {
        id: Int
      }
      `;
        const schema = new Schema(schemaOne, schemaTwo, { showDeprecatedAlongsideRegularRemovals: true });
        const mismatches = await schema.compareSchemas();
        expect(mismatches.removedTypes).not.toHaveLength(0);
      });
      it('false - should not find removed type w/ deprecated directive', async () => {
        const schemaTwo = `type User {
        id: Int
      }`;
        const schemaOne = `${schemaTwo}
      type Company @deprecated {
        id: Int
      }
      `;
        const schema = new Schema(schemaOne, schemaTwo, { showDeprecatedAlongsideRegularRemovals: false });
        const mismatches = await schema.compareSchemas();
        expect(mismatches.removedTypes).toHaveLength(0);
      });
    });
  });
  describe('removedDeprecatedTypes', () => {
    it('should find removed deprecated types', async () => {
      const schemaTwo = `type User {
        id: Int
      }`;
      const schemaOne = `${schemaTwo}
      type Company @deprecated {
        id: Int
      }
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedDeprecatedTypes).not.toHaveLength(0);
    });
  });
  describe('typesChanged', () => {
    it('should find changed types', async () => {
      const schemaTwo = `type User {
        id: Int
      }`;
      const schemaOne = `input User {
        id: Int
      }
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.typesChanged).not.toHaveLength(0);
    });
  });
  describe('typesMadeDeprecated', () => {
    it('should find new deprecated types', async () => {
      const schemaOne = `type User {
        id: Int
      }`;
      const schemaTwo = `type User @deprecated {
        id: Int
      }
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.typesMadeDeprecated).not.toHaveLength(0);
    });
    it('should find new deprecated types w/ reason', async () => {
      const schemaOne = `type User {
        id: Int
      }`;
      const schemaTwo = `type User @deprecated(reason: "no more users!") {
        id: Int
      }
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.typesMadeDeprecated).not.toHaveLength(0);
      expect(mismatches.typesMadeDeprecated[0].reason).not.toBeUndefined();
    });
  });
});
