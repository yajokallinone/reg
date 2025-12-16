import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT major,count(*) as total,sum(case when status ='Y' then 1 else 0 end) as regis FROM tcas_69 GROUP BY major");
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Confirmed API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
