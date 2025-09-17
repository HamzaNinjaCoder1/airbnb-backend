-----  Steps to Create Database with the help of the "TypeORM" ----------
1) -> install necessary dependicies as like 
       "npm install mysql2 typeorm reflect-metadata dotenv"
2) -> sab sa pahla config ka nam pa folder bnana hai aur is ka andar db.js ka nam pa file create kara
3) -> then put the necessary data inside in it as like as:
   /*                              -------Code-------
   import { DataSource } from "typeorm";
    import "dotenv/config";
    import dotenv from "dotenv";

    dotenv.config();

    const AppDataSource = new DataSource({
        type: "mysql",
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
        logging: false,
        synchronize: false
    })

    export default AppDataSource;
   */
4) -> write the code inside the users.js in models folder accurately as:
  /*
  import { EntitySchema } from "typeorm";

export const usersmodule = new EntitySchema({
    name: "usersmodule",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
          },
          name: {
            type: "varchar",
            length: 100,
            nullable: false,
          },
          email: {
            type: "varchar",
            length: 150,
            unique: true,
            nullable: false,
          },
          password_hash: {
            type: "varchar",
            length: 255,
            nullable: false,
          },
          phone: {
            type: "varchar",
            length: 20,
            nullable: true,
          },
          profile_picture: {
            type: "text",
            nullable: true,
          },
          role: {
            type: "enum",
            enum: ["guest", "host", "admin"],
            default: "guest",
          },
          created_at: {
            type: "timestamp",
            createDate: true,
          },
    }
})
  */

4) -> sab sa pahla hama kisi bhi controller ma ya 3 cheeza mustly import karni hi pada gi for example
(i) import {usermodule} from 'usermodules' -> is liya ka is typeorm database ka table jo ham na bniya hai us ko map kar sakha hamra code ka sath easily and accurately
(ii) import {AppDatasource} from '../config/db' taka ham apni data base ko yaha par register kar sakha
(iii) const userRepo = AppDatasource.getReposity(usermodule) in order to perform the crud operations

is ka baad hama phir requests aur response creates karna hota hai according to or operations accurately like as if we want to register or add a new user then
export const userRegister = (req, res) => 
    {
        try
            {
                const user = userRepo.create(req.body);
                const savedUser = userRepo.save(user);
                res.status(210).json({success: true, data:savedUser})
            }
        catch
            {
                res.status(500).json({success: false error: err.message})
            }
    }
  
5) -> inside the router folder in the realted router file define all of the routes as like as
import express from 'express'
import userController from 'userController'
const userRouter = express.Router();
userRouter.post('/register', usercontroller)

"""" By default or boilerplaite code of the express app.js is: """"
import express from "express";

const app = express();

app.get("/", (req, res) => 
    {
    res.send("Hello World");
    });

const port = 8081;
app.listen(port, () => 
    {
    console.log(`Server running on port ${port}`);
    });
// ---- frontened ma data get karna ----
(1) -> import axios karo 
(2) -> import {useState, useEffect} from 'react'
