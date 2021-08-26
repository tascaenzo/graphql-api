import { InputType, Field } from '@nestjs/graphql';
import { IsJWT } from 'class-validator';

@InputType()
export class RefreshTokenInput {
  @IsJWT()
  @Field(() => String, { description: 'Refresh Token' })
  refreshToken: string;

  @IsJWT()
  @Field(() => String, { description: 'Token' })
  token: string;
}
