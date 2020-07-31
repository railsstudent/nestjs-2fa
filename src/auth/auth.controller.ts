import { Controller, Get, Res, UseGuards, Post, Body, UnauthorizedException, Put } from '@nestjs/common';
import { Response } from 'express';
import { TfaService } from './services';
import { LoginDto, CustomQRCodeDto } from './types';
import { Public } from '../shared';
import { Encoding } from 'speakeasy';
import { Issuer } from './constants';

@Controller('auth')
export class AuthController {

    constructor(private tfaService: TfaService) {}

    @Public()
    @Get('generate')
    generateQRCode(@Res() res: Response) {
        const { otpauth_url, base32 } =  this.tfaService.generateSecret('SomeSecretKey', Issuer);
        // TODO: store secret key of the user in database
        console.log('otpauth_url', otpauth_url);
        console.log('base32', base32)
        this.tfaService.generateQRCode(otpauth_url, res);
    }

    @Public()
    @Get('secret')
    generateSecretCode() {
      const { base32 } =  this.tfaService.generateSecret('SomeSecretKey', Issuer);
      console.log('base32', base32)
      return {
        secret: base32
      }
    }

    @Public()
    @Put('generate/custom')
    generateQRCodeFromSecret(@Body() body: CustomQRCodeDto, @Res() res: Response) {
      const options = {
        issuer: Issuer,
        secret: body.secret,
        label: body.label,
        encoding: 'base32' as Encoding,
      }
      this.tfaService.generateQRCodeFromSecret(options, res);
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
