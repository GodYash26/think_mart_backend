import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity("favorites")
export class Favorite {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: ObjectId;

  @Column()
  productIds: ObjectId[];
}