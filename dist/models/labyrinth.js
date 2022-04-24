"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const LabyrinthSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    map: String,
});
exports.default = mongoose.model('Labyrinth', LabyrinthSchema);
