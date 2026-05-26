
import type { IssueStatus, IssueType } from "../../types";
import { pool } from "../../db";
const getAllIssuesFromDB = async (filters :
    {
   sort?: string | undefined;
type?: IssueType | undefined;
status?: IssueStatus | undefined;
    }
)=>{

    const{sort,type,status}=filters;
    
  const conditions: string[] = [];
  const values: unknown[]    = [];
  let   param                = 1;

  if (type)   { conditions.push(`type = $${param++}`);   values.push(type);   }
  if (status) { conditions.push(`status = $${param++}`); values.push(status); }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = sort === "oldest" ? "ASC" : "DESC";

  const issuesResult =await pool.query(`
    SELECT id ,title, description,type,reporter_id,created_at,updated_at
    FROM issues
    ${where}
    ORDER BY created_at ${order}
  `, values);

   const issues = issuesResult.rows;
  if (issues.length === 0) return [];

  
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id as number))];

  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds],
  );

    const reporterMap: Record<number, { id: number; name: string; role: string }> = {};
  for (const r of reportersResult.rows) {
    reporterMap[r.id as number] = { id: r.id, name: r.name, role: r.role };
  }

  return issues.map(({ reporter_id, ...rest }) => ({
    ...rest,
    reporter: reporterMap[reporter_id as number] || null,
  }));




};






export const issueService = {
  getAllIssuesFromDB,
 
};