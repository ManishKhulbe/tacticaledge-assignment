"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("./entities/movie.entity");
let MoviesService = class MoviesService {
    movieRepository;
    constructor(movieRepository) {
        this.movieRepository = movieRepository;
    }
    async create(createMovieDto, user) {
        const movie = this.movieRepository.create({
            ...createMovieDto,
            userId: user.id,
        });
        return this.movieRepository.save(movie);
    }
    async findAll(userId, page = 1, limit = 8) {
        const [movies, total] = await this.movieRepository.findAndCount({
            where: { userId },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        const totalPages = Math.ceil(total / limit);
        return { movies, total, totalPages };
    }
    async findOne(id, userId) {
        const movie = await this.movieRepository.findOne({
            where: { id, userId },
        });
        if (!movie) {
            throw new common_1.NotFoundException('Movie not found');
        }
        return movie;
    }
    async update(id, updateMovieDto, userId) {
        const movie = await this.findOne(id, userId);
        Object.assign(movie, updateMovieDto);
        return this.movieRepository.save(movie);
    }
    async remove(id, userId) {
        const movie = await this.findOne(id, userId);
        await this.movieRepository.remove(movie);
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], MoviesService);
//# sourceMappingURL=movies.service.js.map