import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TfaService } from './tfa.service';
import { UserService } from './user.service';
import { jwtConstants } from '../constants';

describe('TfaService', () => {
  let service: TfaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: {  
            expiresIn: '1d',
            algorithm: 'HS512', 
          },
        })
      ],
      providers: [TfaService, UserService],
    }).compile();

    service = module.get<TfaService>(TfaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
