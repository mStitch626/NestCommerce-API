import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pwd: string): Promise<any> {
    const user = await this.userService.findOne({ username: username });

    if (!user) throw new UnauthorizedException('Invalid username');

    if (!(await bcrypt.compare(pwd, user.password))) throw new UnauthorizedException('Invalid password');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.toObject();
    return result;
  }

  async login(user: any): Promise<{ access_token: string; refresh_token: string }> {
    const tokens = await this.create_tokens(user);
    const hashedToken = await bcrypt.hash(tokens.refresh_token, 10);

    await this.userService.update(user._id.toString(), { refresh_token: hashedToken });

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.update(userId, { refresh_token: null });
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findById(userId);
    if (!user || !user.refresh_token) throw new ForbiddenException('Access Denied');

    if (!(await bcrypt.compare(refreshToken, user.refresh_token))) throw new UnauthorizedException('Access Denied');

    const payload: JwtPayload = { userId: user._id.toString(), userRole: user.role };
    const new_access_token = await this.create_access_token(payload);
    // const hashedToken = await bcrypt.hash(tokens.refresh_token, 10);
    // await this.userService.update(user._id, { refresh_token: hashedToken });
    return { access_token: new_access_token, refresh_token: refreshToken };
  }

  async create_tokens(user: any) {
    const payload: JwtPayload = { userId: user._id.toString(), userRole: user.role };

    const access_token = await this.create_access_token(payload);
    const refresh_token = await this.create_refresh_token(payload);

    return { access_token, refresh_token };
  }

  async create_access_token(payload: JwtPayload) {
    return await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_LIVED,
    });
  }

  async create_refresh_token(payload: JwtPayload) {
    return await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_LIVED,
    });
  }
}
