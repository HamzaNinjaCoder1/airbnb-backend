import { EntitySchema } from "typeorm";

export const conversationsmodule = new EntitySchema({
  name: "conversationsmodule",
  tableName: "conversations",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user1_id: {
      type: "int",
      nullable: false,
    },
    user2_id: {
      type: "int",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    user1: {
      type: "many-to-one",
      target: "usersmodule",
      joinColumn: { name: "user1_id" },
      nullable: false,
    },
    user2: {
      type: "many-to-one",
      target: "usersmodule",
      joinColumn: { name: "user2_id" },
      nullable: false,
    },
    messages: {
      type: "one-to-many",
      target: "messagesmodule",
      inverseSide: "conversation",
    },
  },
});
