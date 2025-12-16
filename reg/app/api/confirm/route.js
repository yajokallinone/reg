import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import WebSocket from 'ws';

const wss = new WebSocket('ws://localhost:8080');

// Function to ensure the WebSocket is open before sending a message
const sendWebSocketMessage = (message) => {
  if (wss.readyState === WebSocket.OPEN) {
    wss.send(JSON.stringify(message));
  } else {
    wss.on('open', () => {
      wss.send(JSON.stringify(message));
    });
  }
};

export async function POST(request) {
  try {
    const { citizen_id } = await request.json();
    if (!citizen_id) {
      return NextResponse.json({ error: 'Citizen ID is required' }, { status: 400 });
    }

    const [result] = await pool.query('UPDATE tcas_69 SET status = ? WHERE citizen_id = ?', ['Y', citizen_id]);

    if (result.affectedRows > 0) {
      // After successful update, fetch the updated student's full name
      const [rows] = await pool.query('SELECT fname, lname FROM tcas_69 WHERE citizen_id = ?', [citizen_id]);
      if (rows.length > 0) {
        const student = rows[0];
        // Send a message to the WebSocket server to trigger a real-time update
        sendWebSocketMessage({ type: 'new_confirmation', student });
      }
      return NextResponse.json({ message: 'Confirmation successful' });
    } else {
      return NextResponse.json({ error: 'Student not found or already confirmed' }, { status: 404 });
    }
  } catch (error) {
    console.error('Confirm API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
