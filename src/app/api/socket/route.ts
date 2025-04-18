import { NextResponse } from 'next/server';
import { initSocket } from '@/lib/socket';

export async function GET() {
  try {
    //const io = initSocket();
    return NextResponse.json({ success: true, message: 'Socket server initialized' });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initialize socket server' },
      { status: 500 }
    );
  }
} 