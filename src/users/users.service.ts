import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSaltSync, hashSync } from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashPassword(plainText: string) {
    const salt = genSaltSync(10);
    return hashSync(plainText, salt);
  }

  async create(dto: CreateUserDto) {
    const newUser = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.password),
      bio: dto.bio,
    });

    return newUser;
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findById({ _id: id });
  }

  async update(dto: UpdateUserDto) {
    const result = await this.userModel.updateOne({ _id: dto.id }, { ...dto });
    if (result) {
      return 'Cập nhật thành công!';
    }
    return 'Thất bại';
  }

  async remove(id: string) {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount) return 'Xóa thành công!';
    console.log(result);
    return Error('Xóa thất bại');
  }
}
