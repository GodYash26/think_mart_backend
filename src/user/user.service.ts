import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../auth/entities/auth.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}


  async findAll() {
    const users = await this.userRepository.find({
      order: { createdAt: -1 },
    });

    // Remove password from response
    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user as any;
      return userWithoutPassword;
    });

    return {
      message: 'Users retrieved successfully',
      users: sanitizedUsers,
    };
  }

 
}
