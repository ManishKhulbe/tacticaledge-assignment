import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 1999 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  publishingYear: number;

  @ApiProperty({ example: 'poster-url.jpg', required: false })
  @IsString()
  poster?: string;
}
