import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Session {
  @Field(() => String, { description: 'Token' })
  token: string;

  @Field(() => Number, { description: 'Session refreshed number' })
  refreshNumber: number;

  @Field(() => String, { description: 'IP address' })
  ip: string;

  @Field(() => String, { description: 'User agent' })
  userAgent: string;

  @Field(() => Date, { description: 'Created Data' })
  createdAt: Date;

  @Field(() => Date, { description: 'Refreshed data' })
  refreshedAt: Date;

  @Field(() => String, { description: 'Token expired date' })
  expiredAt: Date;

  @Field(() => User, { description: 'User' })
  user: User;
}
