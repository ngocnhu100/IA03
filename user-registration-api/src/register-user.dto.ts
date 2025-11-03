import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from "class-validator";

export class RegisterUserDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail(
    {},
    { message: "Please provide a valid email address (e.g., user@example.com)" }
  )
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(8, {
    message: "Password must be at least 8 characters long to ensure security",
  })
  @MaxLength(128, { message: "Password must not exceed 128 characters" })
  password!: string;
}
