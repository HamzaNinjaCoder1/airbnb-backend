import { EntitySchema } from "typeorm";

export const listing_imagesmodule = new EntitySchema({
  name: "listing_imagesmodule",
  tableName: "listing_images",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    listing_id: {
      type: "int",
      nullable: false,
    },
    image_url: {
      type: "text",
      nullable: false,
    },
  },
  relations: {
    listing: {
      type: "many-to-one",
      target: "listingsmodule",
      joinColumn: { name: "listing_id" },
      onDelete: "CASCADE",
    },
  },
});
