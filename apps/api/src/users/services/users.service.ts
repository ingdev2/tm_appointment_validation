import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // CREATE FUNTIONS //

  async createUser() {}

  // GET FUNTIONS //

  async getAllUsers() {}

  async getUsersById() {}

  // UPDATE FUNTIONS //

  async updateUser() {}

  async updateUserPassword() {}

  async forgotUserPassword() {}

  async resetUserPassword() {}

  // DELETED-BAN FUNTIONS //

  async banUsers() {}
}
