import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
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

  async login(user: any): Promise<{ access_token: string }> {
    const payload: JwtPayload = { userId: user._id, userRole: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
