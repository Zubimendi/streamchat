import mongoose, { Schema, Document } from 'mongoose';

export interface IDirectMessage extends Document {
  participants: mongoose.Types.ObjectId[];
  senderId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const directMessageSchema = new Schema<IDirectMessage>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image'],
    default: 'text'
  },
  fileUrl: {
    type: String,
    default: null
  },
  readBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound index for participant queries
directMessageSchema.index({ participants: 1, createdAt: -1 });

export const DirectMessage = mongoose.model<IDirectMessage>('DirectMessage', directMessageSchema);

