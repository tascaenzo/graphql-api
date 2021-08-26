import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { Session } from 'src/sessions/entities/session.entity';
import { SessionDocument } from 'src/sessions/session.schema';
import { AuthService } from 'src/auth/auth.service';
import { SignInUserInput } from './dto/sign-in.input';

@Resolver(() => Session)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Session)
  signIn(
    @Args('signInUserInput') signInUserInput: SignInUserInput,
    @Context() ctx,
  ): Promise<SessionDocument> {
    return this.authService.signIn(signInUserInput, ctx.req);
  }

  @Mutation(() => Session)
  signOut(
    @Args('token', { type: () => String }) token: string,
  ): Promise<SessionDocument> {
    return this.authService.signOut(token);
  }
}
