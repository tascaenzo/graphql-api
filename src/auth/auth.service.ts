import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignInUserInput } from 'src/auth/dto/sign-in.input';
import { UserDocument, User } from 'src/users/users.schema';
import { SessionDocument, Session } from '../sessions/session.schema';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import AuthInterface from './dto/auth.interface';

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
    const token = this.jwtService.sign({ role: user.role, id: user.id, key });
    const tokenDecode = this.jwtService.decode(token);
    const refreshToken = this.jwtService.sign(
      { token },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME },
    );
    this.cacheManager.set(
      key,
      {
        iSrevoked: false,
        role: user.role,
        user: user.id,
      },
      { ttl: parseInt(process.env.JWT_CACHE_TTL) },
    );

    return this.sessionModel.create({
      token,
      refreshToken,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      expiredAt: new Date(tokenDecode['exp'] * 1000),
      user: user._id,
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
    const newTokenDecode = this.jwtService.decode(newToken);

    return await this.sessionModel.findOneAndUpdate(
      { _id: session._id },
      {
        token: newToken,
        refreshToken: newRefreshToken,
        refreshNumber: session.refreshNumber + 1,
        expiredAt: new Date(newTokenDecode['exp'] * 1000),
        refreshedAt: new Date(),
      },
    );
  }

  async verify(token: string): Promise<AuthInterface> {
    const key = this.jwtService.verify(token)['key'];
    const auth: AuthInterface = await this.cacheManager.get(key);
    if (auth === undefined) {
      const session = await this.sessionModel
        .findOne({ token })
        .populate('user');
      if (session === null || session.deletedAt !== null) {
        return null;
      }

      this.cacheManager.set(key, {
        iSrevoked: false,
        role: session.user.role,
        user: session.user.id,
      });
    }
    return auth;
  }
}
