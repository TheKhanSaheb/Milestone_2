import { pool } from "../../db";

const getSystemMetrics = async () => {

  const [
    totalIssues,
    issuesByStatus,
    issuesByType,
    totalUsers,
    usersByRole
  ] = await Promise.all([

    pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM issues`
    ),

    pool.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) AS count
       FROM issues
       GROUP BY status`
    ),

    pool.query<{ type: string; count: string }>(
      `SELECT type, COUNT(*) AS count
       FROM issues
       GROUP BY type`
    ),

    pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM users`
    ),

    pool.query<{ role: string; count: string }>(
      `SELECT role, COUNT(*) AS count
       FROM users
       GROUP BY role`
    ),

  ]);

  return {

    issues: {

      total: Number(totalIssues.rows[0]?.count || 0),

      by_status: Object.fromEntries(
        issuesByStatus.rows.map((r) => [
          r.status,
          Number(r.count)
        ])
      ),

      by_type: Object.fromEntries(
        issuesByType.rows.map((r) => [
          r.type,
          Number(r.count)
        ])
      ),

    },

    users: {

      total: Number(totalUsers.rows[0]?.count || 0),

      by_role: Object.fromEntries(
        usersByRole.rows.map((r) => [
          r.role,
          Number(r.count)
        ])
      ),

    },

  };
};

export const metricsService = {
  getSystemMetrics
};