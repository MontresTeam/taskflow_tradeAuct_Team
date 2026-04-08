import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomerProjectMapping extends Document {
  customerOrgId: Types.ObjectId;
  projectId: Types.ObjectId;
  mappedBy: Types.ObjectId;
  allowedRequestTypes: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const customerProjectMappingSchema = new Schema<ICustomerProjectMapping>(
  {
    customerOrgId: { type: Schema.Types.ObjectId, ref: 'CustomerOrg', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    mappedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    allowedRequestTypes: {
      type: [String],
      default: ['bug', 'feature', 'suggestion', 'concern', 'other'],
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

customerProjectMappingSchema.index({ customerOrgId: 1, projectId: 1 }, { unique: true });

export const CustomerProjectMapping = mongoose.model<ICustomerProjectMapping>(
  'CustomerProjectMapping',
  customerProjectMappingSchema
);
