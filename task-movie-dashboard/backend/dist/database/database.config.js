"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const movie_entity_1 = require("../movies/entities/movie.entity");
const user_entity_1 = require("../auth/entities/user.entity");
exports.databaseConfig = {
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [movie_entity_1.Movie, user_entity_1.User],
    synchronize: true,
    logging: true,
};
//# sourceMappingURL=database.config.js.map