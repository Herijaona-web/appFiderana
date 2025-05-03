import mongoose from 'mongoose';

const TarikaSchema = new mongoose.Schema({
  anarana: {
    type: String,
    required: [true, 'Please provide a tarika'],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tarika = mongoose.model('Tarika', TarikaSchema);

export default Tarika;