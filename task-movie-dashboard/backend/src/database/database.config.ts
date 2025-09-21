import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { User } from '../auth/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Movie, User],
  synchronize: true, // Only for development
  logging: true,
};
