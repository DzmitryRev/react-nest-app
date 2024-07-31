import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma?: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    return this.prisma.user.create({ data: createUserDto });
  }

  async getAll(
    page: number,
    usersPerPage: number = 20,
  ): Promise<{ users: UserDto[]; totalPages: number }> {
    if (page < 0) throw new BadRequestException("Incorrect page value");
    let users = await this.prisma.user.findMany({
      skip: (page - 1) * usersPerPage,
      take: usersPerPage,
    });
    let totalPages = Math.ceil((await this.prisma.user.count()) / usersPerPage);
    return {
      users,
      totalPages,
    };
  }

  async getOne(id: string): Promise<UserDto> {
    let user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    let user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.prisma.user.update({
      data: { ...updateUserDto },
      where: { id },
    });
  }

  async deleteOne(id: string): Promise<UserDto> {
    let user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.prisma.user.delete({ where: { id } });
  }
}
