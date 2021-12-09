import { createConnection, getConnectionOptions } from "typeorm";

export default async () => {
  const defaultConnection = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultConnection, {
      database:
        process.env.NODE_ENV === "test"
          ? "fin_api_test"
          : defaultConnection.database,
    })
  );
};
