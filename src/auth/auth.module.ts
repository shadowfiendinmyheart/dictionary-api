import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: `${process.env.JWT_PRIVATE_KEY}`,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AuthModule, JwtModule],
})
export class AuthModule {}
