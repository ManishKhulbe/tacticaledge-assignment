import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { User } from '../auth/entities/user.entity';
export declare class MoviesService {
    private movieRepository;
    constructor(movieRepository: Repository<Movie>);
    create(createMovieDto: CreateMovieDto, user: User): Promise<Movie>;
    findAll(userId: number, page?: number, limit?: number): Promise<{
        movies: Movie[];
        total: number;
        totalPages: number;
    }>;
    findOne(id: number, userId: number): Promise<Movie>;
    update(id: number, updateMovieDto: UpdateMovieDto, userId: number): Promise<Movie>;
    remove(id: number, userId: number): Promise<void>;
}
