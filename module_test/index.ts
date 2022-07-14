import Schema from '@beforeyoubid/graphql-schema-diff';

const schema1 = `
  type Query {
    user: User
    users: [User]
  }
  type User {
    id: Int
  }
`;

const schema2 = `
  type Query {
    users: [User] @deprecated(reason: "some reason")
  }
  type User {
    id: Int
  }
`;

async function go() {
  const schema = new Schema(schema1, schema2);
  const mismatches = await schema.compareSchemas();
  console.log({ mismatches });
}

go();
