import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const user = new User();
      user.firstName = userData.firstName;
      user.lastName = userData.lastName;
      user.email = userData.email;
      user.password = userData.password;
      user.mobileNumber = userData.mobileNumber || null;
      user.gender = userData.gender;
      user.userType = userData.userType;

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: string) {
    try {
      const data = await this.userRepository.findOne({ where: { id: id } });
      if (data) {
        await this.userRepository.delete(id);
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(loginCred: LoginDto) {
    try {
      const data = await this.userRepository.findOne({
        where: { email: loginCred.email },
      });
      if (!data) {
        throw new Error("User not found");
      }

      const isMatch = data.validatePassword(loginCred.password);
      if (!isMatch) {
        throw new Error("Invalid Password");
      }
      delete data.password;
      return data;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
