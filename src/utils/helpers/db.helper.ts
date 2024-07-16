/* eslint-disable @typescript-eslint/no-empty-function */
import {DBClient} from '../../config/database.config';

export class DBOperation {
  constructor() {}

  async executeQuery(queryString: string, values: any) {
    const client = await DBClient();
    await client.connect();
    const result = await client.query(queryString, values);
    await client.end();
    return result;
  }
}
