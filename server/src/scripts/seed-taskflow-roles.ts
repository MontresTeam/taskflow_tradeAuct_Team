/**
 * Seed TaskFlow system roles (dot-notation permissions).
 * Run: npx ts-node -r tsconfig-paths/register -r dotenv/config src/scripts/seed-taskflow-roles.ts
 */
import { connectDb, disconnectDb } from '../config/db';
import { Role } from '../modules/roles/role.model';
import {
  ALL_TASK_FLOW_PERMISSIONS,
  TASK_FLOW_PERMISSIONS,
  flattenPermissions,
} from '../shared/constants/permissions';

const projectManagerPerms = [
  ...flattenPermissions(TASK_FLOW_PERMISSIONS.PROJECT as unknown as Record<string, unknown>),
  TASK_FLOW_PERMISSIONS.AUTH.USER.READ,
  TASK_FLOW_PERMISSIONS.AUTH.USER.LIST,
];

const developerPerms = [
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.READ,
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.LIST,
  TASK_FLOW_PERMISSIONS.PROJECT.MEMBER.READ,
];

const viewerPerms = [
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.READ,
  TASK_FLOW_PERMISSIONS.PROJECT.PROJECT.LIST,
];

const orgManagerPerms = flattenPermissions(TASK_FLOW_PERMISSIONS.ORG as unknown as Record<string, unknown>);

async function main() {
  await connectDb();

  const seeds: Array<{ code: string; name: string; permissions: string[]; isSystem: boolean }> = [
    { code: 'super_admin', name: 'Super Admin', permissions: [...ALL_TASK_FLOW_PERMISSIONS], isSystem: true },
    { code: 'project_manager', name: 'Project Manager', permissions: projectManagerPerms, isSystem: true },
    { code: 'developer', name: 'Developer', permissions: developerPerms, isSystem: true },
    { code: 'viewer', name: 'Viewer', permissions: viewerPerms, isSystem: true },
    { code: 'org_manager', name: 'Org Manager', permissions: orgManagerPerms, isSystem: true },
  ];

  for (const s of seeds) {
    await Role.findOneAndUpdate(
      { code: s.code },
      { $set: { name: s.name, permissions: s.permissions, isSystem: s.isSystem } },
      { upsert: true, new: true }
    );
    console.log('Upserted role', s.code);
  }

  await disconnectDb();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
