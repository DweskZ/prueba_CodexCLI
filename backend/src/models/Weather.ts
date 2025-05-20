import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  city!: string;

  @Column()
  description!: string;

  @Column("float")
  temperature!: number;

  @Column()
  date!: string;

  @ManyToOne(() => User, (user) => user.id)
  user!: User;
}
