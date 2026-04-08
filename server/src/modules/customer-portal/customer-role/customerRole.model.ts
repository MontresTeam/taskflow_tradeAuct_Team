import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomerRole extends Document {
  customerOrgId: Types.ObjectId;
  name: string;
  permissions: string[];
  isDefault: boolean;      // assigned to new members automatically
  isSystemRole: boolean;   // built-in roles (Org Admin, Member) — cannot delete
  createdAt: Date;
  updatedAt: Date;
}

const customerRoleSchema = new Schema<ICustomerRole>(
  {
    customerOrgId: { type: Schema.Types.ObjectId, ref: 'CustomerOrg', required: true, index: true },
    name: { type: String, required: true, trim: true },
    permissions: [{ type: String }],
    isDefault: { type: Boolean, default: false },
    isSystemRole: { type: Boolean, default: false },
  },
  { timestamps: true }
);

customerRoleSchema.index({ customerOrgId: 1, name: 1 }, { unique: true });

export const CustomerRole = mongoose.model<ICustomerRole>('CustomerRole', customerRoleSchema);
