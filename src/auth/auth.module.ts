import { CacheModule, Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { SessionModule } from 'src/sessions/session.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from 'src/sessions/session.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CacheModule.register({ ttl: parseInt(process.env.JWT_CACHE_TTL) }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_TIME },
    }),
    SessionModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
