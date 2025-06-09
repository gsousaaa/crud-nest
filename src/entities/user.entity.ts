import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar' })
    email!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @Column({ type: 'date', default: new Date() })
    created_at?: Date;

    @Column({ type: 'date' })
    updated_at?: Date;
}
