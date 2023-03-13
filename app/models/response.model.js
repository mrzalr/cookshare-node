exports.statusBadRequest = (res, errors) => {
    res.status(400).json({
        status : 400,
        message : "bad request",
        errors : errors,
        data : null
    })
}

exports.statusCreated = (res, data) => {
    res.status(201).json({
        status : 201,
        message : "created",
        errors : [],
        data : data
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
