import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadPoster(file: Express.Multer.File): Promise<{
        filename: string;
        url: string;
        originalName: string;
        size: number;
    }>;
}
