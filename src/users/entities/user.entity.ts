import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID, { description: 'ID' })
  id: string;

  @Field(() => String, { description: 'e-mail' })
  email: string;

  @Field(() => String, { description: 'Name' })
  name: string;

  @Field(() => String, { description: 'Surname' })
  surname: string;

  @Field(() => String, { description: 'isBanned' })
  isBanned: boolean;

  @Field(() => Date, { description: 'Created Data' })
  createdAt: Date;

  @Field(() => Date, { description: 'Updated Data' })
  updatedAt: Date;
}
