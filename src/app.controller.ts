import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get a greeting message' })
  @ApiResponse({
    status: 200,
    description: 'Returns a greeting message.',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
