import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto, LoginDto } from "../dtos/user.dto";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
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

      const data = await this.userRepository.save(user);
      delete data.password;
      return data;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const data = await this.userRepository.findOne({ where: { id: id } });
      delete data.password;
      return data;
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
      const user = await this.validateUser(loginCred.email, loginCred.password);

      if (user) {
        const accessToken = this.jwtService.sign({
          type: "access",
          email: user.email,
          userType: user.userType,
          userId: user.id,
        });

        delete user.password;
        return { accessToken, user };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user && user.validatePassword(pass)) {
      return user;
    }
    throw new Error("Invalid Cred");
  }
}
