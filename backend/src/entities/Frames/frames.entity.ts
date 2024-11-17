import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Frames {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column({ default: 0 })
    renderer_id: number;

    // @Column("jsonb", { nullable: true })
    // config: Record<string, any>;

    // @Column("jsonb", { nullable: true })
    // config_viewer: Record<string, any>;

    @Column({ default: true })
    preview: string = "";
}
