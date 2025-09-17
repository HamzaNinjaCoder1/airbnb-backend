import { EntitySchema } from "typeorm";

export const messagesmodule = new EntitySchema({
  name: "messagesmodule",
  tableName: "messages",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    message_text: {
      type: "text",
      nullable: true,
    },
    file_url: {
      type: "text",
      nullable: true,
    },
    message_type: {
      type: "enum",
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
    status: {
      type: "enum",
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
    conversation_id: {
      type: "int",
      nullable: false,
    },
    sender_id: {
      type: "int",
      nullable: false,
    },
    receiver_id: {
      type: "int",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    conversation: {
      type: "many-to-one",
      target: "conversationsmodule",
      joinColumn: { name: "conversation_id" },
      onDelete: "CASCADE",
    },
    sender: {
      type: "many-to-one",
      target: "usersmodule",
      joinColumn: { name: "sender_id" },
      nullable: false,
    },
    receiver: {
      type: "many-to-one",
      target: "usersmodule",
      joinColumn: { name: "receiver_id" },
      nullable: false,
    },
  },
});
