const mongoose = require('mongoose');

const ourTankSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
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

export default mongoose.model('OurTank', ourTankSchema);
