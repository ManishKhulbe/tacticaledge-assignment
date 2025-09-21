import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto, user: User): Promise<Movie> {
    const movie = this.movieRepository.create({
      ...createMovieDto,
      userId: user.id,
    });

    return this.movieRepository.save(movie);
  }

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 8,
  ): Promise<{ movies: Movie[]; total: number; totalPages: number }> {
    const [movies, total] = await this.movieRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return { movies, total, totalPages };
  }

  async findOne(id: number, userId: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id, userId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
    userId: number,
  ): Promise<Movie> {
    const movie = await this.findOne(id, userId);

    Object.assign(movie, updateMovieDto);
    return this.movieRepository.save(movie);
  }

  async remove(id: number, userId: number): Promise<void> {
    const movie = await this.findOne(id, userId);
    await this.movieRepository.remove(movie);
  }
}
