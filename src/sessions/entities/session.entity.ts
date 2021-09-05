import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Session {
  @Field(() => String, { description: 'Token' })
  token: string;

  @Field(() => String, { description: 'Refresh Token' })
  refreshToken: string;

  @Field(() => Number, { description: 'Session refreshed number' })
  refreshNumber: number;

  @Field(() => String, { description: 'IP address' })
  ip: string;

  @Field(() => String, { description: 'User agent' })
  userAgent: string;

  @Field(() => Date, { description: 'Created Data' })
  createdAt: Date;

  @Field(() => Date, { description: 'Refreshed data', nullable: true })
  refreshedAt: Date;

  @Field(() => Date, { description: 'Token expired date' })
  expiredAt: Date;

  @Field(() => User, { description: 'User' })
  user: User;
}
