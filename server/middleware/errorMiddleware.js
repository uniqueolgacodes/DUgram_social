// ERROR MIDDLEWARE || NEXT FUNCTION

const errorMiddleware = (err, req, res, next) => {
    const defaultError = {
        statusCode: 404,
        status: "failed",
        message: err,
    };
    if (err?.name === "ValidationError") {
        defaultError.statusCode = 404;
        defaultError.message = Object.values(err, errors)
        .map((el) => el.message)
        .join(",")
    }

    //DUPLICATE ERROR

    if(err.code && err.code === 11000){
        defaultError.statusCode = 404;
        defaultError.message = `${Object.values(err.keyValue)} field has to be unique!`;
    }

    res.status(defaultError.statusCode).json({
        status:defaultError.status,
        message: defaultError.message,
    });
};

export default errorMiddleware;