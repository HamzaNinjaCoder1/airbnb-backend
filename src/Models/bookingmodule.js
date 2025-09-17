import { EntitySchema } from "typeorm";

export const bookingmodule = new EntitySchema({
  name: "bookingmodule",
  tableName: "bookings",
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
    guest_id: {
      type: "int",
      nullable: false,
    },
    check_in_date: {
      type: "date",
      nullable: false,
    },
    check_out_date: {
      type: "date",
      nullable: false,
    },
    guests: {
      type: "int",
      nullable: false,
    },
    total_price: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    status: {
      type: "varchar",
      length: 50,
      default: "confirmed",
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
    listing: {
      type: "many-to-one",
      target: "listingsmodule",
      joinColumn: { name: "listing_id" },
      onDelete: "CASCADE",
    },
    guest: {
      type: "many-to-one",
      target: "usersmodule",
      joinColumn: { name: "guest_id" },
      onDelete: "CASCADE",
    },
  },
});




