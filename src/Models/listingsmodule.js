import { EntitySchema } from "typeorm";

export const listingsmodule = new EntitySchema({
  name: "listingsmodule",
  tableName: "listings",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    host_id: {
      type: "int",
      nullable: false,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    subtitle: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    price_per_night: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: true,
    },
    city: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    country: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    address: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    latitude: {
      type: "decimal",
      precision: 10,
      scale: 8,
      nullable: true,
    },
    longitude: {
      type: "decimal",
      precision: 11,
      scale: 8,
      nullable: true,
    },
    max_guests: {
      type: "int",
      nullable: true,
    },
    bedrooms: {
      type: "int",
      nullable: true,
    },
    beds: {
      type: "int",
      nullable: true,
    },
    baths: {
      type: "int",
      nullable: true,
    },
    rating: {
      type: "decimal",
      precision: 2,
      scale: 1,
      nullable: true,
    },
    reviews_count: {
      type: "int",
      nullable: true,
    },
    map_url: {
      type: "text",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    stay_type:{
      type: "text",
      nullable: true,
    },
    property_type:{
      type: "text",
      nullable: true,
    },
    status:{
      type: "text",
      nullable: true,
    },
    current_step:{
      type:"text",
      nullable: true,
    },
  },
  relations: {
    images: {
      type: "one-to-many",
      target: "listing_imagesmodule",
      inverseSide: "listing",
      cascade: true,
    },
  },
});
