import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class RefreshTokenInput {
  @IsString()
  @Field(() => String, { description: 'Old Password' })
  oldPassword: string;

  @IsString()
  @Field(() => String, { description: 'New Password' })
  newPassword: string;
}
