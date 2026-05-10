import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.hostName,
  port: Number(process.env.port),
  username: process.env.userName,
  password: process.env.password,
  database: process.env.databaseName,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // set to false in production
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
