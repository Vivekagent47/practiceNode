import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from "class-validator";

enum userGender {
  male = "male",
  female = "female",
}

enum userType {
  customer = "customer",
  consumer = "consumer",
}

export class CreateUserDto {
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @MaxLength(50)
  readonly firstName: string;

  @IsNotEmpty()
  @MaxLength(50)
  readonly lastName: string;

  @IsOptional()
  @MaxLength(14)
  readonly mobileNumber: string;

  @IsEnum(userGender)
  readonly gender: userGender;

  @IsEnum(userType)
  readonly userType: userType;
}

export class LoginDto {
  @IsEmail()
  @MaxLength(320)
  email: string;

  @IsNotEmpty()
  password: string;
}
