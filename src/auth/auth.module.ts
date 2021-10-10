import { CacheModule, Global, Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { SessionModule } from 'src/sessions/session.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from 'src/sessions/session.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CacheModule.register(),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_TIME },
    }),
    SessionModule,
  ],
  providers: [AuthResolver, AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
