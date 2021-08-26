import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignInUserInput } from 'src/auth/dto/sign-in.input';
import { UserDocument, User } from 'src/users/users.schema';
import { SessionDocument, Session } from '../sessions/session.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    signInUserInput: SignInUserInput,
    req: Request,
  ): Promise<SessionDocument> {
    const { email, password } = signInUserInput;

    const user = await this.userModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ ...user });

    return this.sessionModel.create({
      token,
      refreshToken: token,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      expiredAt: new Date(),
    });
  }

  async signOut(token: string): Promise<SessionDocument> {
    return this.sessionModel.findOneAndUpdate(
      { token },
      { deletedAt: new Date() },
    );
  }
}
