import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { SharedModule } from '../shared';
import { JwtStrategy, JwtAuthGuard } from './jwt';
import { TfaService, UserService } from './services';

@Module({
  imports: [
    SharedModule,
    PassportModule.register({ defaultStrategy: 'jwt-tfa' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {  
        expiresIn: '1d',
        algorithm: 'HS512', 
      },
    })
  ],
  providers: [TfaService, UserService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard]
})
export class AuthModule {}
