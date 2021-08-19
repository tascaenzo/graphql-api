import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString, IsEmail } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID, { description: 'ID' })
  id: string;

  @IsEmail()
  @Field(() => String, { description: 'E-mail' })
  email: string;

  @IsString()
  @Field(() => String, { description: 'Name' })
  name: string;

  @IsString()
  @Field(() => String, { description: 'Surname' })
  surname: string;
}
