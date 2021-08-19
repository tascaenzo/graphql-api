import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field(() => String, { description: 'E-mail' })
  email: string;

  @IsString()
  @Field(() => String, { description: 'Name' })
  name: string;

  @IsString()
  @Field(() => String, { description: 'Surname' })
  surname: string;

  @IsString()
  @Field(() => String, { description: 'Password' })
  password: string;
}
