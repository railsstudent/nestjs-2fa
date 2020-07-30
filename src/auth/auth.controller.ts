import { Controller, Get, Res, UseGuards, Post, Body, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { TfaService } from './services';
import { LoginDto } from './types';
import { Public } from '../shared';

@Controller('auth')
export class AuthController {

    constructor(private tfaService: TfaService) {}

    @Public()
    @Get('generate')
    generateQRCode(@Res() res: Response) {
        const { otpauth_url, base32 } =  this.tfaService.generateSecret('SomeSecretKey', 'Abc Company');
        // TODO: store secret key of the user in database
        console.log('otpauth_url', otpauth_url);
        console.log('base32', base32)
        this.tfaService.generateQRCode(otpauth_url, res);
    }

    @Public()
    @Post('login')
    login(@Body() credential: LoginDto) {
        try {
            return this.tfaService.authenticate(credential);
          } catch (err) {
            throw new UnauthorizedException(err.message);
          }
    }
}
