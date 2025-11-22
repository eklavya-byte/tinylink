
import pool from '@/lib/db';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { code } = await params;
  let client;

  try {
    client = await pool.connect();
    
    await client.query('BEGIN');
    
    const result = await client.query(
      'SELECT * FROM links WHERE code = $1 FOR UPDATE',
      [code]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      notFound();
    }

    const link = result.rows[0];

    await client.query(
      `UPDATE links 
       SET clicks = clicks + 1, 
           last_clicked = CURRENT_TIMESTAMP 
       WHERE code = $1`,
      [code]
    );

    await client.query('COMMIT');
    
    redirect(link.target_url); 
    
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    
    if (error.digest?.startsWith('NEXT_REDIRECT') || error.digest?.startsWith('NEXT_NOT_FOUND')) {
      throw error;
    }
    
    console.error('Redirect error:', error);
    notFound();
  } finally {
    if (client) {
      client.release();
    }
  }
}