import { Request, Response, NextFunction } from 'express';
import { Schema,  } from 'yup';

const yupValidator = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, { abortEarly: false });
        return next();
    } catch (error: any) {
        return res.status(400).json(error.errors);
    }
};

export default yupValidator;
