import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ValidationError, validate } from "class-validator";

import { PrismaService } from "../../prisma/prisma.service";
import { UsersService } from "../users.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserDto } from "../dto/user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { createMockUsers } from "./shared";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;
  let users: UserDto[];
  let oneUser: UserDto;
  const CREATION_DATE = new Date(2024, 7, 4);

  beforeEach(async () => {
    users = createMockUsers();
    oneUser = users[0];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest
                .fn()
                .mockImplementation(
                  ({
                    skip,
                    take,
                  }: {
                    skip: number;
                    take: number;
                  }): UserDto[] => {
                    return users.slice(skip, take);
                  },
                ),
              findUnique: jest
                .fn()
                .mockImplementation(
                  ({
                    where: { id },
                  }: {
                    where: { id: string };
                  }): UserDto | null => {
                    return users.filter((user) => user.id == id)[0] || null;
                  },
                ),
              create: jest
                .fn()
                .mockImplementation(
                  ({ data }: { data: CreateUserDto }): UserDto => {
                    let newUser = {
                      ...data,
                      id: "4",
                      createdAt: CREATION_DATE,
                    };
                    users.push(newUser);
                    return newUser;
                  },
                ),
              update: jest
                .fn()
                .mockImplementation(
                  ({
                    data,
                    where,
                  }: {
                    data: UpdateUserDto;
                    where: { id: string };
                  }): UserDto => {
                    users.map((user) => {
                      if (user.id === where.id) {
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.height = data.height;
                        user.weight = data.weight;
                        user.address = data.address;
                        user.photo = data.photo;
                      }
                    });
                    let targerUser = users.find((user) => user.id === where.id);
                    return targerUser;
                  },
                ),
              delete: jest
                .fn()
                .mockImplementation(
                  ({ where: { id } }: { where: { id: string } }): UserDto => {
                    let deletedUser = users.filter((user) => user.id === id)[0];
                    users = users.filter((user) => user.id !== id);
                    return deletedUser;
                  },
                ),
              count: jest.fn().mockResolvedValue(3),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("should return an array of users from page 1", async () => {
      const response = await service.getAll(1);
      expect(response).toEqual({ users: users, totalPages: 1 });
    });
    it("should return an array of users from non-existent page", async () => {
      const response = await service.getAll(24);
      expect(response).toEqual({ users: [], totalPages: 1 });
    });
    it("should throw an error 'Incorrect page value'", async () => {
      await expect(service.getAll(-1)).rejects.toEqual(
        new BadRequestException({
          message: "Incorrect page value",
        }),
      );
    });
  });

  describe("getOne", () => {
    it("should return the user by id", async () => {
      const response = await service.getOne(oneUser.id);
      expect(response).toEqual(oneUser);
    });
    it("should throw an error 'User not found'", async () => {
      await expect(service.getOne("")).rejects.toEqual(
        new NotFoundException({
          message: "User not found",
        }),
      );
    });
  });

  describe("deleteOne", () => {
    it("should delete user and return them", async () => {
      const response = await service.deleteOne(oneUser.id);
      expect(users).toEqual(users.filter((user) => user.id !== oneUser.id));
      expect(response).toEqual(oneUser);
    });
    it("should throw an error 'User not found' while deleting", async () => {
      await expect(service.deleteOne("")).rejects.toEqual(
        new NotFoundException({
          message: "User not found",
        }),
      );
    });
  });

  describe("class-validator", () => {
    it("should throw an validation errors in 7 fields", async () => {
      let newUser = new UserDto();
      let validationErrors: ValidationError[] = await validate(newUser);
      expect(validationErrors.length).toBe(7);
    });
    it("should throw an isUuid, isString, isNotEmpty validation errors for 'id' field", async () => {
      let newUser = new UserDto();
      let validationErrors: ValidationError[] = await validate(newUser);
      let idValidationError: ValidationError = validationErrors.find(
        (error: ValidationError) => error.property === "id",
      );
      expect(Object.keys(idValidationError.constraints)).toEqual([
        "isUuid",
        "isString",
        "isNotEmpty",
      ]);
    });
    it("should throw an maxLength, isString, isNotEmpty validation errors for 'firstName' field", async () => {
      let newUser = new UserDto();
      let validationErrors: ValidationError[] = await validate(newUser);
      let idValidationError: ValidationError = validationErrors.find(
        (error: ValidationError) => error.property === "firstName",
      );
      expect(Object.keys(idValidationError.constraints)).toEqual([
        "maxLength",
        "isString",
        "isNotEmpty",
      ]);
    });
    it("should throw an maxLength, isString, isNotEmpty validation errors for 'lastName' field", async () => {
      let newUser = new UserDto();
      let validationErrors: ValidationError[] = await validate(newUser);
      let idValidationError: ValidationError = validationErrors.find(
        (error: ValidationError) => error.property === "lastName",
      );
      expect(Object.keys(idValidationError.constraints)).toEqual([
        "maxLength",
        "isString",
        "isNotEmpty",
      ]);
    });
    it("should throw an isNumber, isNotEmpty validation errors for 'height' field", async () => {
      let newUser = new UserDto();
      let validationErrors: ValidationError[] = await validate(newUser);
      let idValidationError: ValidationError = validationErrors.find(
        (error: ValidationError) => error.property === "height",
      );
      expect(Object.keys(idValidationError.constraints)).toEqual([
        "isNumber",
        "isNotEmpty",
      ]);
    });
    it("should throw an isNumber, isNotEmpty validation errors for 'weight' field", async () => {
      let newUser = new UserDto();
      let validationErrors: ValidationError[] = await validate(newUser);
      let idValidationError: ValidationError = validationErrors.find(
        (error: ValidationError) => error.property === "weight",
      );
      expect(Object.keys(idValidationError.constraints)).toEqual([
        "isNumber",
        "isNotEmpty",
      ]);
    });
    it("should throw an isUrl validation errors for 'photo' field", async () => {
      let newUser = new UserDto();
      newUser.photo = "not url";
      let validationErrors: ValidationError[] = await validate(newUser);
      let idValidationError: ValidationError = validationErrors.find(
        (error: ValidationError) => error.property === "photo",
      );
      expect(Object.keys(idValidationError.constraints)).toEqual(["isUrl"]);
    });
  });

  describe("create", () => {
    it("should create user and return them", async () => {
      let newUser = new CreateUserDto();
      newUser.firstName = "New user firstName";
      newUser.lastName = "New user lastName";
      newUser.height = 140;
      newUser.weight = 10;
      newUser.address = "Vitebsk";
      newUser.photo = "https://newuserphoto.com";
      let response = await service.create(newUser);
      expect(users.filter((user) => user.id === "4")[0]).toEqual({
        ...response,
        id: "4",
        createdAt: CREATION_DATE,
      });
      expect(response).toEqual({
        ...newUser,
        id: "4",
        createdAt: CREATION_DATE,
      });
    });
  });

  describe("update", () => {
    it("should update user and return them", async () => {
      let newUser = new UpdateUserDto();
      newUser.firstName = "Updated user firstName";
      newUser.lastName = "Updated user lastName";
      newUser.height = 141;
      newUser.weight = 11;
      newUser.address = "Minsk";
      newUser.photo = "https://updateduserphoto.com";
      let { createdAt, ...body } = await service.update("1", newUser);
      let userInDB = users.filter((user) => user.id === "1")[0];
      expect(userInDB.firstName).toEqual(body.firstName);
      expect(userInDB.lastName).toEqual(body.lastName);
      expect(userInDB.height).toEqual(body.height);
      expect(userInDB.weight).toEqual(body.weight);
      expect(userInDB.address).toEqual(body.address);
      expect(userInDB.photo).toEqual(body.photo);
      expect(body).toEqual({
        ...newUser,
        id: "1",
      });
    });
    it("should throw an error 'User not found' while updating", async () => {
      await expect(service.update("", {})).rejects.toEqual(
        new NotFoundException({
          message: "User not found",
        }),
      );
    });
  });
});
