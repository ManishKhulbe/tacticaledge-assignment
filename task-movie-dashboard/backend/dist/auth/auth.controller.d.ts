import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: Omit<import("./entities/user.entity").User, "password">;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<import("./entities/user.entity").User, "password">;
        token: string;
    }>;
}
