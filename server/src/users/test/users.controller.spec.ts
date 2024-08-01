import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { isURL } from "class-validator";

import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";
import { UserDto } from "../dto/user.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { createMockUsers } from "./shared";
import { UpdateUserDto } from "../dto/update-user.dto";

describe("Users Controller", () => {
  let controller: UsersController;
  let service: UsersService;
  let users: UserDto[];

  beforeEach(async () => {
    users = createMockUsers();
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest
              .fn()
              .mockImplementation(
                (page: number): { users: UserDto[]; totalPages: number } => {
                  if (page <= 0) {
                    throw new BadRequestException("Invalid page value");
                  } else if (page === 1) {
                    return { users, totalPages: 1 };
                  } else {
                    return { users: [], totalPages: 1 };
                  }
                },
              ),
            getOne: jest.fn().mockImplementation((id: string): UserDto => {
              let user = users.filter((user) => user.id === id)[0];
              if (!user) throw new NotFoundException("User not found");
              return user;
            }),
            create: jest
              .fn()
              .mockImplementation((createUserDto: CreateUserDto) => {
                users.push({
                  ...createUserDto,
                  id: "4",
                  photo: createUserDto.photo || "",
                });
                return users.filter((user) => user.id === "4")[0];
              }),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateUserDto: UpdateUserDto) => {
                  users.map((user) => {
                    if (user.id === id) {
                      user.firstName =
                        updateUserDto.firstName || user.firstName;
                      user.lastName = updateUserDto.lastName || user.lastName;
                      user.height = updateUserDto.height || user.height;
                      user.weight = updateUserDto.weight || user.weight;
                      user.address = updateUserDto.address || user.address;
                      user.photo = updateUserDto.photo || user.photo;
                    }
                  });
                  return users.filter((user) => user.id === "1")[0];
                },
              ),
            deleteOne: jest.fn().mockImplementation((id: string): UserDto => {
              let user = users.filter((user) => user.id === id)[0];
              if (!user) throw new NotFoundException("User not found");
              users = users.filter((user) => user.id !== id);
              return user;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAll", () => {
    it("should return an array of users from page 1 and totalPages", async () => {
      expect(await controller.getAll(1)).toEqual({
        users,
        totalPages: 1,
      });
    });
    it("should return an array of users from page more that 1 and totalPages", async () => {
      expect(await controller.getAll(2)).toEqual({
        users: [],
        totalPages: 1,
      });
    });
    it("should throw an error 'Invalid page value'", async () => {
      try {
        await controller.getAll(0);
      } catch (error) {
        expect(error.getStatus()).toBe(400);
        expect(error.getResponse().error).toEqual("Bad Request");
        expect(error.getResponse().message).toEqual("Invalid page value");
      }
    });
  });
  describe("getOne", () => {
    it("should return a user with id==='1'", async () => {
      expect(await controller.getOne("1")).toEqual(users[0]);
    });
    it("should throw an erorr 'User not found'", async () => {
      try {
        await controller.getOne("433");
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.getResponse().error).toEqual("Not Found");
        expect(error.getResponse().message).toEqual("User not found");
      }
    });
  });
  describe("create", () => {
    it("should create a new user with photo and return them", async () => {
      let newUser: CreateUserDto = {
        firstName: "New User",
        lastName: "New User",
        weight: 444,
        height: 444,
        address: "New User",
        photo: "https://newuser.com",
      };
      expect(await controller.create(newUser)).toEqual({ ...newUser, id: "4" });
      let createdUser = users.filter((user) => user.id === "4")[0];
      expect(createdUser.photo).not.toBe("");
      expect(isURL(createdUser.photo)).toBeTruthy();
    });
    it("should create a new user without photo and return them", async () => {
      let newUser: CreateUserDto = {
        firstName: "New User",
        lastName: "New User",
        weight: 444,
        height: 444,
        address: "New User",
      };
      expect(await controller.create(newUser)).toEqual({
        ...newUser,
        id: "4",
        photo: "",
      });
      let createdUser = users.filter((user) => user.id === "4")[0];
      expect(createdUser.photo).toBe("");
    });
  });
  describe("update", () => {
    it("should update all user fields and return this user", async () => {
      let newUser: UpdateUserDto = {
        firstName: "Updated User",
        lastName: "Updated User",
        weight: 555,
        height: 555,
        address: "Updated User",
        photo: "https://updated.com",
      };
      expect(await controller.update("1", newUser)).toEqual({
        ...newUser,
        id: "1",
      });
    });
    it("should update 3 user fields and return this user", async () => {
      let newUser: UpdateUserDto = {
        firstName: "Updated User",
        lastName: "Updated User",
        weight: 555,
      };
      let updatedUser = await controller.update("1", newUser);
      expect(updatedUser.firstName).toBe("Updated User");
      expect(updatedUser.lastName).toBe("Updated User");
      expect(updatedUser.weight).toBe(555);
      expect(updatedUser.height).toBe(111);
      expect(updatedUser.address).toBe("User 1 address");
      expect(updatedUser.photo).toBe("https://user1photo.com");
    });
  });
  describe("delete", () => {
    it("should delete user and return them", async () => {
      expect(await controller.deleteOne("1")).toEqual({
        id: "1",
        firstName: "User 1 firstName",
        lastName: "User 1 lastName",
        height: 111,
        weight: 111,
        address: "User 1 address",
        photo: "https://user1photo.com",
      });
    });
    it("should throw an error 'User not found'", async () => {
      try {
        await controller.deleteOne("4");
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.getResponse().error).toEqual("Not Found");
        expect(error.getResponse().message).toEqual("User not found");
      }
    });
  });
});
