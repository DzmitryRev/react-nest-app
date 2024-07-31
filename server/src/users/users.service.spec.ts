import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserDto } from "./dto/user.dto";
import { ValidationError, validate } from "class-validator";
import { UpdateUserDto } from "./dto/update-user.dto";

function createMockDB(): UserDto[] {
  let users = [
    {
      id: "1",
      firstName: "User 1 firstName",
      lastName: "User 1 lastName",
      height: 120,
      weight: 112,
      address: "User 1 address",
      photo: "https://user1photo.com",
    },
    {
      id: "2",
      firstName: "User 2 firstName",
      lastName: "User 2 lastName",
      height: 150,
      weight: 100,
      address: "User 2 address",
      photo: "https://user2photo.com",
    },
    ,
    {
      id: "3",
      firstName: "User 3 firstName",
      lastName: "User 3 lastName",
      height: 170,
      weight: 110,
      address: "User 3 address",
      photo: "https://user3photo.com",
    },
  ];

  return users;
}

describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;
  let allUsers: UserDto[];
  let oneUser: UserDto;

  beforeEach(async () => {
    allUsers = createMockDB();
    oneUser = allUsers[0];
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
                    return allUsers.slice(skip, take);
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
                    return allUsers.filter((user) => user.id == id)[0] || null;
                  },
                ),
              create: jest
                .fn()
                .mockImplementation(
                  ({ data }: { data: CreateUserDto }): UserDto => {
                    let newUser = { ...data, id: "4" };
                    allUsers.push(newUser);
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
                    allUsers.map((user) => {
                      if (user.id === where.id) {
                        user.firstName = data.firstName;
                        user.lastName = data.lastName;
                        user.height = data.height;
                        user.weight = data.weight;
                        user.address = data.address;
                        user.photo = data.photo;
                      }
                    });
                    let targerUser = allUsers.find(
                      (user) => user.id === where.id,
                    );
                    return targerUser;
                  },
                ),
              delete: jest
                .fn()
                .mockImplementation(
                  ({ where: { id } }: { where: { id: string } }): UserDto => {
                    let deletedUser = allUsers.filter(
                      (user) => user.id === id,
                    )[0];
                    allUsers = allUsers.filter((user) => user.id !== id);
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
      expect(response).toEqual({ users: allUsers, totalPages: 1 });
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
      expect(allUsers).toEqual(
        allUsers.filter((user) => user.id !== oneUser.id),
      );
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
      const response = await service.create(newUser);
      expect(allUsers.filter((user) => user.id === "4")[0]).toEqual(response);
      expect(response).toEqual({ ...newUser, id: "4" });
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
      const response = await service.update("1", newUser);
      console.log(response);
      expect(allUsers.filter((user) => user.id === "1")[0]).toEqual(response);
      expect(response).toEqual({ ...newUser, id: "1" });
    });
    it("should throw an error 'User not found' while updating", async () => {
      await expect(service.deleteOne("")).rejects.toEqual(
        new NotFoundException({
          message: "User not found",
        }),
      );
    });
  });
});
