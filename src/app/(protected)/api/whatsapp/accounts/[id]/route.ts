import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma';
import { onUserInfor } from '@/actions/user'; 
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await onUserInfor()
    const sessionId = session.data?.id
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accountId = params.id;

    // Verify account belongs to user
    const account = await client.whatsAppAccount.findFirst({
      where: {
        id: accountId,
        userId: sessionId
      }
    });

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await client.whatsAppAccount.update({
      where: { id: accountId },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting WhatsApp account:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}