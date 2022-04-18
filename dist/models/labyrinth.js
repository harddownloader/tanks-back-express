"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const LabyrinthSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    map: String,
    // adress: String,
    // phones: mongoose.Schema.Types.Mixed,
    // photoOwnerImage: String,
    // photoPasportImage: String,
    // car: String,
    // history: String,
    // whoGave: String,
    // ktoDalTel: String,
    // jivoder: Boolean,
});
exports.default = mongoose.model('Labyrinth', LabyrinthSchema);
