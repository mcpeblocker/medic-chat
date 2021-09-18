import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @Column({
    default: false
  })
  public fromSelf: boolean;

  @ManyToOne(() => User)
  public user: User;
}

export default Message;
