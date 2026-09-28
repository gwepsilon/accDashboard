import { NextResponse } from 'next/server'
import { fetchDispositionMatrix } from '@/lib/dispositions'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const data = await fetchDispositionMatrix(pool)
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/dispositions failed', error)
    return NextResponse.json(
      {
        error: 'Failed to load disposition matrix',
        detail:
          error instanceof Error ? error.message : 'Unknown database error',
      },
      { status: 500 },
    )
  }
}
