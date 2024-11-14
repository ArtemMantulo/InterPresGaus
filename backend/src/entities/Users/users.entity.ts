import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;
}
