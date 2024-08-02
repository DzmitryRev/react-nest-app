import { User } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  address: string;

  @ApiProperty({ required: false })
  photo: string;
}
