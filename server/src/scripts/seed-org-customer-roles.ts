/**
 * Seed default customer roles for each CustomerOrg.
 * Run: npx ts-node -r tsconfig-paths/register -r dotenv/config src/scripts/seed-org-customer-roles.ts
 */
import { connectDb, disconnectDb } from '../config/db';
import { CustomerOrg } from '../modules/customer-portal/customer-org/customerOrg.model';
import { CustomerRole } from '../modules/customer-portal/customer-role/customerRole.model';
import {
  ALL_CUSTOMER_PERMISSIONS,
  CUSTOMER_PERMISSIONS,
  flattenPermissions,
} from '../shared/constants/permissions';

const issueBlock = flattenPermissions(CUSTOMER_PERMISSIONS.ISSUE as unknown as Record<string, unknown>);

const orgMemberPerms = [
  CUSTOMER_PERMISSIONS.PROJECT.PROJECT.READ,
  CUSTOMER_PERMISSIONS.PROJECT.PROJECT.LIST,
  ...issueBlock,
];

const orgViewerPerms = [
  CUSTOMER_PERMISSIONS.PROJECT.PROJECT.READ,
  CUSTOMER_PERMISSIONS.PROJECT.PROJECT.LIST,
  CUSTOMER_PERMISSIONS.ISSUE.ISSUE.READ,
  CUSTOMER_PERMISSIONS.ISSUE.ISSUE.LIST,
];

async function main() {
  await connectDb();
  const orgs = await CustomerOrg.find().select('_id').lean();
  for (const org of orgs) {
    const orgId = org._id;
    const templates: Array<{ name: string; permissions: string[]; isSystemRole: boolean }> = [
      {
        name: 'Org Admin',
        permissions: [...ALL_CUSTOMER_PERMISSIONS],
        isSystemRole: true,
      },
      { name: 'Org Member', permissions: orgMemberPerms, isSystemRole: true },
      { name: 'Org Viewer', permissions: orgViewerPerms, isSystemRole: true },
    ];
    for (const t of templates) {
      await CustomerRole.findOneAndUpdate(
        { customerOrgId: orgId, name: t.name },
        {
          $set: { permissions: t.permissions, isSystemRole: t.isSystemRole },
          $setOnInsert: { name: t.name, isDefault: false },
        },
        { upsert: true, new: true }
      );
      console.log('Upserted customer role', String(orgId), t.name);
    }
  }
  await disconnectDb();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
