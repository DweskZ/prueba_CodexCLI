import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User"; 
import { Weather } from "./models/Weather"; 

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "34.51.47.220",
  port: 5432,
  username: "user",
  password: "password",
  database: "clima",
  synchronize: true,
  logging: true,
  entities: [User, Weather],
});
