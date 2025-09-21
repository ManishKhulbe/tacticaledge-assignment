import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: Omit<User, 'password'>;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<User, 'password'>;
        token: string;
    }>;
    validateUser(userId: number): Promise<Omit<User, 'password'> | null>;
}
