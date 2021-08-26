import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { SessionModule } from 'src/sessions/session.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from 'src/sessions/session.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { AuthService } from './auth.service';

const jwtRegister = {
  secret: 'KEY',
  signOptions: { expiresIn: '24h' },
};

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register(jwtRegister),
    SessionModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
