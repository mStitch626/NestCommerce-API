import { Controller, Request, Post, UseGuards, Get, Res } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. The access token is stored in a secure cookie, and the refresh token is returned in the response for session management.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized access if the username is invalid or the password is incorrect. Specific reasons: Invalid username or Invalid password.',
  })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const jwt = await this.authService.login(req.user);

    response.cookie('jwt', jwt.access_token, {
      httpOnly: true,
    });
    return { message: 'Successful login', refresh_token: jwt.refresh_token };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description:
      'Generates a new access token stored in a secure cookie using a valid refresh token passed via Bearer Token in the Authorization header.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized access if the refresh token is invalid, expired, or not provided in the Authorization header.',
  })
  async refreshTokens(@Request() req, @Res({ passthrough: true }) response: Response) {
    const user_id = req.user.userId;
    const refresh_token = req.user['refresh_token'];
    const new_tokens = await this.authService.refreshTokens(user_id, refresh_token);
    response.cookie('jwt', new_tokens.access_token, {
      httpOnly: true,
    });
    return { refresh_token: new_tokens.refresh_token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description:
      'Successfully logs out the user by clearing the access token cookie and invalidating the refresh token.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized access if the user is not authenticated or if cookies are deleted, making the access token unavailable.',
  })
  logout(@Request() req, @Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    const user_id = req.user.userId;
    this.authService.logout(user_id);
    return {
      message: 'Successful logout user',
    };
  }
}
