
exports.statusCreated = (res, data) => {
    res.status(201).json({
        status : 201,
        message : "created",
        errors : [],
        data : data
    })
}

exports.statusOk = (res, data) => {
    res.status(200).json({
        status : 200,
        message : "ok",
        errors : [],
        data : data
    })
}

exports.statusBadRequest = (res, errors) => {
    res.status(400).json({
        status : 400,
        message : "bad request",
        errors : errors,
        data : null
    })
}

exports.statusBadGateway = (res, errors) => {
    res.status(500).json({
        status : 500,
        message : "bad gateway",
        errors : errors,
        data : null
    })
}

exports.statusUnauthorized = (res, errors) => {
    res.status(401).json({
        status : 401,
        message : "unauthorized",
        errors : errors,
        data : null
    })
}
