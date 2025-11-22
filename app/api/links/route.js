import pool from '@/lib/db';
import { NextResponse } from 'next/server';

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { targetUrl, customCode } = await request.json();

    // Validate URL
    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(targetUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let code = customCode;
    
    if (customCode) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters [A-Za-z0-9]' },
          { status: 400 }
        );
      }
      code = customCode;
    } else {
      code = generateRandomCode();
      
      let attempts = 0;
      while (attempts < 10) {
        const existingLink = await pool.query(
          'SELECT * FROM links WHERE code = $1',
          [code]
        );
        
        if (existingLink.rows.length === 0) {
          break;
        }
        
        code = generateRandomCode();
        attempts++;
      }
      
      if (attempts === 10) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    }

    if (customCode) {
      const existingLink = await pool.query(
        'SELECT * FROM links WHERE code = $1',
        [code]
      );

      if (existingLink.rows.length > 0) {
        return NextResponse.json(
          { error: 'This short code is already in use' },
          { status: 409 }  
        );
      }
    }

    const result = await pool.query(
      `INSERT INTO links (code, target_url) 
       VALUES ($1, $2) 
       RETURNING *`,
      [code, targetUrl]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}