import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto, req: any): Promise<import("./entities/movie.entity").Movie>;
    findAll(req: any, page?: number, limit?: number): Promise<{
        movies: import("./entities/movie.entity").Movie[];
        total: number;
        totalPages: number;
    }>;
    findOne(id: number, req: any): Promise<import("./entities/movie.entity").Movie>;
    update(id: number, updateMovieDto: UpdateMovieDto, req: any): Promise<import("./entities/movie.entity").Movie>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
