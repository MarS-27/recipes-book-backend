import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TLogin, TUserRequest } from 'src/types/global-types';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('Incorrect User Data!');
  }

  async login(user: TUserRequest): Promise<TLogin> {
    const { id, email, imgPath, userName } = user;
    return {
      id,
      email,
      imgPath,
      userName,
      token: this.jwtService.sign({
        id,
        email,
        imgPath,
        userName,
      }),
    };
  }
}
