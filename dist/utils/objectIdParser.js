"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIdToString = exports.ObjectID = void 0;
const mongodb_1 = require("mongodb");
const ObjectID = (id) => {
    try {
        return new mongodb_1.ObjectId(id);
    }
    catch (error) {
        return null;
    }
};
exports.ObjectID = ObjectID;
const objectIdToString = (id) => {
    return id.toString();
};
exports.objectIdToString = objectIdToString;
