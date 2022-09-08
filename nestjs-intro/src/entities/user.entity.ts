import {
  Entity,
  Column,
  Unique,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";
import * as bcrypt from "bcryptjs";

type userType = "customer" | "consumer";
type userGender = "male" | "female";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50, nullable: false })
  firstName: string;

  @Column({ length: 50, nullable: false })
  lastName: string;

  @Unique("email", ["email"])
  @Column({ length: 320, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({
    type: "enum",
    enum: ["male", "female"],
    default: "male",
  })
  gender: userGender;

  @Column({
    type: "enum",
    enum: ["customer", "consumer"],
    default: "customer",
  })
  userType: userType;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
