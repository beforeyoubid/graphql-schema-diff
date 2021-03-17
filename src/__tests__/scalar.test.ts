import Schema from '../index';

describe('Scalars', () => {
  describe('addScalars', () => {
    it('should find new scalars', async () => {
      const schemaOne = `scalar UUID`;
      const schemaTwo = `${schemaOne}
      scalar Email
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.addedScalars).not.toHaveLength(0);
    });
  });
  describe('removedScalars', () => {
    it('should find removed scalars', async () => {
      const schemaTwo = `scalar UUID`;
      const schemaOne = `${schemaTwo}
      scalar Email
      `;
      const schema = new Schema(schemaOne, schemaTwo);
      const mismatches = await schema.compareSchemas();
      expect(mismatches.removedScalars).not.toHaveLength(0);
    });
  });
});
