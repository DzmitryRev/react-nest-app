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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  OmitType,
  PartialType,
  getSchemaPath,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

import { UserEntity } from "./swagger/entities/user.entity";

export class GetAllUsersResponse {
  users: UserEntity[];
  totalPages: number;
}

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({ type: OmitType(UserEntity, ["id"]) })
  @ApiCreatedResponse({
    type: UserEntity,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        users: {
          type: "array",
          items: {
            type: "object",
            $ref: getSchemaPath(UserEntity),
          },
        },
        totalPages: { type: "number" },
      },
    },
  })
  getAll(@Query("page") page: number) {
    return this.usersService.getAll(page);
  }

  @Get(":id")
  @ApiOkResponse({
    type: UserEntity,
  })
  getOne(@Param("id") id: string) {
    return this.usersService.getOne(id);
  }

  @Patch(":id")
  @ApiBody({ type: PartialType(OmitType(UserEntity, ["id"])) })
  @ApiOkResponse({
    type: UserEntity,
  })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOkResponse({
    type: UserEntity,
  })
  deleteOne(@Param("id") id: string) {
    return this.usersService.deleteOne(id);
  }
}
