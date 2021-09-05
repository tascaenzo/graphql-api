import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import Role from 'src/users/user-role';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const token: string = ctx.req.headers.authorization;

    if (token === undefined || token.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const auth = await this.authService.verify(token.split(' ')[1]);
    if (auth === null) return false;
    ctx.auth = auth;

    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());

    if (roles === undefined) return true;
    if (auth.role.includes(Role.Developer)) return true;
    for (const role of auth.role) {
      if (roles.includes(role)) return true;
    }
    return false;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
