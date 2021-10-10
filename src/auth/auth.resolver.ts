import {
  Resolver,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Session } from 'src/sessions/entities/session.entity';
import { SessionDocument } from 'src/sessions/session.schema';
import { AuthService } from 'src/auth/auth.service';
import { SignInUserInput } from './dto/sign-in.input';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Resolver(() => Session)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

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

  @Mutation(() => Session)
  refresh(
    @Args('token', { type: () => String }) token: string,
    @Args('refreshToken', { type: () => String }) refreshToken: string,
  ): Promise<SessionDocument> {
    return this.authService.refresh(refreshToken, token);
  }

  @ResolveField(() => User)
  async user(@Parent() session: { user: string }) {
    return await this.userService.findOne(session.user);
  }
}
