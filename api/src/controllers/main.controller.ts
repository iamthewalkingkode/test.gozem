import express, { Request, Response } from 'express';
import { types } from '@/utils/index';

const router = express.Router();


router.get('/', (_: Request, res: Response) => {
    res.status(types.HttpStatus.Success).json({
        message: 'Welcome to GoZem backend written by TheWalkingKode',
    });
});

export default router;