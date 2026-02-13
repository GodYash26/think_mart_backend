import { Column, ObjectId, ObjectIdColumn, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

@Entity("users")
export class User {

    @ObjectIdColumn()
    _id: ObjectId;        
    
    @Column()
    fullname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    address: string;

    @Column({ unique: true })
    phone: string;



    @Column()
    password: string;

    @Column({ default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
