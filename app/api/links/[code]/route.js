import pool from '../../../../lib/db';  
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { code } = await params;  
  
  try {
    const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { code } = await params;  
  
  try {
    const result = await pool.query(
      'DELETE FROM links WHERE code = $1 RETURNING *',
      [code]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Link deleted', code: result.rows[0].code });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}