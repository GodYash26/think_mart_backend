import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";



@Entity("images")
export class Media {
  @ObjectIdColumn()
  _id: Object;

//   image kit url field
  @Column()
  url: string; 

  @Column()
  fileId: string; 

  @Column()
  fileName: string;

  @Column({ nullable: true })
  size?: number;

  @Column({ nullable: true })
  mimeType?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}