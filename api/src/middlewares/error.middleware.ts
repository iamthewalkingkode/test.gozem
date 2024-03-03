import express from 'express';

const ErrorHandler = (err: Error, _: express.Request, res: express.Response, __: express.NextFunction) => {
    console.log('Middleware Error Hadnling');
    const errStatus = 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}

export default ErrorHandler