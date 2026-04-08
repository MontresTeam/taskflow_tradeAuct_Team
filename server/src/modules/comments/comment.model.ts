import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IComment extends Document {
  body: string;
  issue: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  // Customer portal fields
  portalVisible?: boolean;      // true when body contains @requ — shown in portal request view
  portalHighlighted?: boolean;  // true when posted from portal via @issue — highlighted in issue view
  portalAuthorName?: string;    // customer user display name for portal-originated comments
  customerRequestId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    body: { type: String, required: true },
    issue: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    portalVisible: { type: Boolean, default: false },
    portalHighlighted: { type: Boolean, default: false },
    portalAuthorName: { type: String },
    customerRequestId: { type: Schema.Types.ObjectId, ref: 'CustomerRequest' },
  },
  { timestamps: true }
);

commentSchema.index({ issue: 1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
