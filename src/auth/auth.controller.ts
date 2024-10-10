import { Controller, Request, Post, UseGuards, Get, Res } from '@nestjs/common';
import { LocalAuthGuard } from './strategies/local-auth.guard';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserRole } from 'src/user/user.schema';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const jwt = await this.authService.login(req.user);

    response.cookie('jwt', jwt.access_token, {
      httpOnly: true,
    });
    return { message: 'Login success', access_token: jwt.access_token };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('test')
  getProfile() {
    return { message: 'JwtAuthGuard work', user: 'test' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
