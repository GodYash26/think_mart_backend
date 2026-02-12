import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectId } from "mongodb";

@Entity("images")
export class Media {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  fileId: string;

  @Column()
  url: string;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  size?: number;

  @Column({ nullable: true })
  mimeType?: string;

  @Column({ nullable: true })
  height?: number;

  @Column({ nullable: true })
  width?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}