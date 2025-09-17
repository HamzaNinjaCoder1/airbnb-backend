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
    name: {
      type: "varchar",
      length: 100,
      nullable: true, 
    },
    first_name: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    last_name: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    dob: {
      type: "date",
      nullable: true,
    },
  },
});
