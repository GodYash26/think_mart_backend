import { Column, Entity, ObjectIdColumn } from "typeorm";
import { ObjectId } from "mongodb";


@Entity("categories")
export class Category {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    category_name: string;
}



