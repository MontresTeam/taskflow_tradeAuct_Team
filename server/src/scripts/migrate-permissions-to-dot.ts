/**
 * One-time: normalize colon-era permission strings to dot notation on Role, User, ProjectMember.
 * Run: npx ts-node -r tsconfig-paths/register -r dotenv/config src/scripts/migrate-permissions-to-dot.ts
 */
import { connectDb, disconnectDb } from '../config/db';
import { Role } from '../modules/roles/role.model';
import { User } from '../modules/auth/user.model';
import { ProjectMember } from '../modules/projects/projectMember.model';
import { mapLegacyProjectOrGlobalPermissions } from '../shared/constants/legacyPermissionMap';

async function main() {
  await connectDb();

  const roles = await Role.find({}).select('_id permissions').lean();
  for (const r of roles) {
    const next = mapLegacyProjectOrGlobalPermissions(Array.isArray(r.permissions) ? r.permissions : []);
    await Role.updateOne({ _id: r._id }, { $set: { permissions: next } });
  }
  console.log(`Updated ${roles.length} roles`);

  const users = await User.find({}).select('_id permissions').lean();
  let userCount = 0;
  for (const u of users) {
    if (!Array.isArray(u.permissions) || u.permissions.length === 0) continue;
    const next = mapLegacyProjectOrGlobalPermissions(u.permissions);
    await User.updateOne({ _id: u._id }, { $set: { permissions: next } });
    userCount += 1;
  }
  console.log(`Updated ${userCount} users with non-empty permissions snapshot`);

  const members = await ProjectMember.find({}).select('_id permissions').lean();
  let memCount = 0;
  for (const m of members) {
    if (!Array.isArray(m.permissions) || m.permissions.length === 0) continue;
    const next = mapLegacyProjectOrGlobalPermissions(m.permissions);
    await ProjectMember.updateOne({ _id: m._id }, { $set: { permissions: next } });
    memCount += 1;
  }
  console.log(`Updated ${memCount} project members with non-empty permissions snapshot`);

  await disconnectDb();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
