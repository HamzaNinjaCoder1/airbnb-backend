import { EntitySchema } from "typeorm";

export const wishlistmodule = new EntitySchema({
  name: "wishlistmodule",
  tableName: "wishlist",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
      nullable: false,
    },
    listing_id: {
      type: "int",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "usersmodule",
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
    },
    listing: {
      type: "many-to-one",
      target: "listingsmodule",
      joinColumn: { name: "listing_id" },
      onDelete: "CASCADE",
    },
  },
});


