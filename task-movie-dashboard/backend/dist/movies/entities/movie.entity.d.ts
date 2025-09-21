import { User } from '../../auth/entities/user.entity';
export declare class Movie {
    id: number;
    title: string;
    publishingYear: number;
    poster: string;
    userId: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
