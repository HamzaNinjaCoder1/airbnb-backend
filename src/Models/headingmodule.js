import { EntitySchema } from "typeorm";

export const headingsModule = new EntitySchema({
  name: "headingsModule", 
  tableName: "headings",  

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true, 
    },
    heading_text: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    city: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
  },
});
