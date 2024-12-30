import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // POST METHODS //

  // @EnableAuditLog()
  @Post('/createUser')
  async transformGenderNumber() {
    return await this.usersService.createUser();
  }

  // GET METHODS //

  // @Auth(AdminRolType.SUPER_ADMIN, AdminRolType.ADMIN)
  @Get('/getAllUsers')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  // @Auth(AdminRolType.SUPER_ADMIN, AdminRolType.ADMIN)
  @Get('/getUser/:id')
  async getUsersById() {
    return await this.usersService.getUsersById();
  }

  // PATCH METHODS //

  // @EnableAuditLog()
  // @Auth(
  //   AdminRolType.SUPER_ADMIN,
  //   UserRolType.USER,
  // )
  @Patch('/updatePassword/:id')
  async updateUserPassword() {
    return await this.usersService.updateUserPassword();
  }

  @Patch('/resetPassword')
  async resetUserPassword() {
    return await this.usersService.resetUserPassword();
  }

  // @EnableAuditLog()
  // @Auth(AdminRolType.SUPER_ADMIN, AdminRolType.ADMIN)
  @Patch()
  async banUsers() {
    return await this.usersService.banUsers();
  }
}
