import {
  IsString,
  IsUrl,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsDefined,
  ValidateIf,
  IsDate,
} from "class-validator";

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @ValidateIf((user) => user.photo !== "")
  @IsString()
  @IsUrl()
  photo?: string = "";

  @IsDate()
  createdAt: Date;
}
