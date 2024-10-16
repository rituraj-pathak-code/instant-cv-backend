import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String },
});

const User = mongoose.model('User', userSchema);

export default User;
