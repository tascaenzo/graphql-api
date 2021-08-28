import { CacheModule, Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { SessionModule } from 'src/sessions/session.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from 'src/sessions/session.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { AuthService } from './auth.service';

const jwtRegister = {
  secret: process.env.JWT_KEY,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_TIME },
};

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CacheModule.register({ ttl: 10 }),
    JwtModule.register(jwtRegister),
    SessionModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
