import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    const key = new Date().getTime().toString();
    const token = this.jwtService.sign({ email: user.email, id: user.id, key });
    const refreshToken = this.jwtService.sign(
      { token },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME },
    );
    this.cacheManager.set(key, { iSrevoked: false });

    return this.sessionModel.create({
      token,
      refreshToken,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      expiredAt: new Date(),
    });
  }

  async signOut(token: string): Promise<SessionDocument> {
    const jwtDecode = this.jwtService.decode(token);
    this.cacheManager.del(jwtDecode['key']);
    return this.sessionModel.findOneAndUpdate(
      { token },
      { deletedAt: new Date() },
    );
  }

  async refresh(refreshToken: string, token: string): Promise<SessionDocument> {
    const session = await this.sessionModel.findOne({ token, refreshToken });
    const refreshTokenDecode = this.jwtService.verify(refreshToken);
    const tokenDecode = this.jwtService.decode(token);

    if (refreshTokenDecode['token'] !== token) {
      throw new UnauthorizedException('Invalid token or refresh token');
    }

    if (session === null || session.deletedAt !== null) {
      throw new NotFoundException('Session not found');
    }

    const key = new Date().getTime().toString();
    const newToken = this.jwtService.sign({
      email: tokenDecode['email'],
      id: tokenDecode['id'],
      key,
    });
    const newRefreshToken = this.jwtService.sign(
      { token: newToken },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME },
    );

    this.cacheManager.set(key, { iSrevoked: false });
    return await this.sessionModel.findOneAndUpdate(
      { _id: session._id },
      {
        token: newToken,
        refreshToken: newRefreshToken,
        refreshNumber: session.refreshNumber + 1,
        refreshedAt: new Date(),
      },
    );
  }
}
