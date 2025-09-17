// src/entities/PushSubscription.js
import { EntitySchema } from "typeorm";

export const PushSubscription = new EntitySchema({
  name: "PushSubscription",
  tableName: "push_subscriptions",
  columns: {
    id: {
         type: "int", 
         primary: true,
         generated: true,
    },
    user_id: { 
         type: "int",
         nullable: true,
    },
    endpoint: { 
         type: "varchar",
         length: 512,
         nullable: false,
         unique: true,
    },
    p256dh: { type: "varchar",
         length: 255,
         nullable: false,
    },
    auth: { type: "varchar",
         length: 255,
         nullable: false,
    },
    created_at: { 
        type: "timestamp", 
        createDate: true,
    },
  }
});
