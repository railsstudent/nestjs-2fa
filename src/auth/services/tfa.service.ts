import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrCode from 'qrcode';
import { Response } from 'express';
import { encoding } from '../constants';
import { LoginDto, OtpUrlOptions } from '../types';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TfaService {

    constructor(private userService: UserService, private jwtService: JwtService) {}

    generateSecret(name: string, issuer: string) {
        const secretCode = speakeasy.generateSecret({
            name,
            issuer
        })

        const { otpauth_url, base32  } = secretCode;
        return { 
            otpauth_url,
            base32
        }
    }

    generateQRCode(data: string, res: Response) {
        qrCode.toFileStream(res, data)
    }

    generateQRCodeFromSecret(options: OtpUrlOptions, res: Response) {
        if (!options) {
            throw new BadRequestException('options does not exist');
        }

        const { secret, issuer, label = 'Unknown', encoding = 'base32' } = options;
        if (!secret) {
            throw new BadRequestException('secret is missing');
        }

        if (!issuer) {
            throw new BadRequestException('issuer is missing');
        }

        const data =  speakeasy.otpauthURL({
            secret,
            issuer,
            label,
            encoding,
        })

        qrCode.toFileStream(res, data);
    }

    totpVerify(secret: string, token: string) {
        if (!secret || !token) {
            return false;
        }

        return speakeasy.totp.verify({ secret,
            encoding,
            token 
        });
    }

    authenticate(loginUser: LoginDto) {
        const { email, password, secret, token } = loginUser;
        const user = this.userService.allUsers().find(u => u.email === email && u.password === password)
        if (!user) {
          throw new Error('User is not authenticated.');
        }

        const verified = this.totpVerify(secret, token);
        if (!verified) {
          throw new UnauthorizedException('Invalid totp token');
        }
        
        return this.jwtService.sign({
            id: user.id,
            email: user.email
        });
    }
}
