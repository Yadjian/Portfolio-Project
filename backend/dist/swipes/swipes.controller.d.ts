import { Request } from 'express';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { SwipesService } from './swipes.service';
export declare class SwipesController {
    private readonly swipesService;
    constructor(swipesService: SwipesService);
    createSwipe(req: Request, createSwipeDto: CreateSwipeDto): Promise<{
        match: boolean;
        matchedAt: Date;
    } | {
        match: boolean;
        matchedAt?: undefined;
    }>;
    undoSwipe(req: Request): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
}
