import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  Get,
  Query,
  Patch,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  getAll(@Query("page") page: number) {
    return this.usersService.getAll(page);
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.usersService.getOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  deleteOne(@Param("id") id: string) {
    return this.usersService.deleteOne(id);
  }
}
