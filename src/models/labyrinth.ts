const mongoose = require('mongoose');

const LabyrinthSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  map: String,
});

export default mongoose.model('Labyrinth', LabyrinthSchema);
