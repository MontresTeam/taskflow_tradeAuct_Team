import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectMember extends Document {
  project: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  /** @deprecated Prefer designationId + permissions snapshot */
  role?: mongoose.Types.ObjectId;
  designationId?: mongoose.Types.ObjectId;
  /** Snapshot from ProjectDesignation (dot-notation strings) */
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
    designationId: { type: Schema.Types.ObjectId, ref: 'ProjectDesignation', default: null },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);

projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

export const ProjectMember = mongoose.model<IProjectMember>('ProjectMember', projectMemberSchema);
