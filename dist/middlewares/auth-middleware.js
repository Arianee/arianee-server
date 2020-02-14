"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthByApiKey = function (apiKey) { return function (request, response, next) {
    var apiKeyInHeader = request.headers.authorization && request.headers.authorization.split('Basic ')[1];
    if (apiKey === apiKeyInHeader) {
        return next();
    }
    else {
        return response.status(401).send('not allowed');
    }
}; };
//# sourceMappingURL=auth-middleware.js.map