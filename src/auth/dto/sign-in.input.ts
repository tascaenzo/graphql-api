import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class SignInUserInput {
  @IsEmail()
  @Field(() => String, { description: 'E-mail' })
  email: string;

  @IsString()
  @Field(() => String, { description: 'Password' })
  password: string;
}
