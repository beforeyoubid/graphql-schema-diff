import { parse } from 'graphql';
import Schema from '../index';

describe('Schema class', () => {
  afterEach(() => {
    // sandbox.restore();
  });

  describe('constructor', () => {
    it('should take strings', () => {
      const schemaOne = `type Query {
        unix: Int
      }`;
      const schema = new Schema(schemaOne, schemaOne);
      expect(schema.types).not.toBeNull();
      expect(schema.types2).not.toBeNull();
    });

    it('should take DocumentNodes', () => {
      const schemaOne = parse(`type Query {
        unix: Int
      }`);
      const schema = new Schema(schemaOne, schemaOne);
      expect(schema.types).not.toBeNull();
      expect(schema.types2).not.toBeNull();
    });
  });
});
