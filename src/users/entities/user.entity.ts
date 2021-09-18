import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;
}

export default User;
