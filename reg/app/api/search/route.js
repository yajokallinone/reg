import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request) {
  try {
    const { citizen_id } = await request.json();
    if (!citizen_id || citizen_id.length !== 13) {
      return NextResponse.json({ error: 'Invalid citizen ID' }, { status: 400 });
    }

    const [rows] = await pool.query('SELECT fname, lname, status FROM tcas_69 WHERE citizen_id = ?', [citizen_id]);

    if (rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
