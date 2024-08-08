import { UserDto } from "src/users/dto/user.dto";

export function createMockUsers(): UserDto[] {
  let users = [
    {
      id: "1",
      firstName: "User 1 firstName",
      lastName: "User 1 lastName",
      height: 111,
      weight: 111,
      address: "User 1 address",
      photo: "https://user1photo.com",
      createdAt: new Date(),
    },
    {
      id: "2",
      firstName: "User 2 firstName",
      lastName: "User 2 lastName",
      height: 222,
      weight: 222,
      address: "User 2 address",
      photo: "https://user2photo.com",
      createdAt: new Date(),
    },
    ,
    {
      id: "3",
      firstName: "User 3 firstName",
      lastName: "User 3 lastName",
      height: 333,
      weight: 333,
      address: "User 3 address",
      photo: "https://user3photo.com",
      createdAt: new Date(),
    },
  ];

  return users;
}
