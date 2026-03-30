import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get('tag') || process.env.TESTMAIL_TAG || 'test';

  const apiKey = process.env.TESTMAIL_API_KEY;
  const namespace = process.env.TESTMAIL_NAMESPACE;

  if (!apiKey || !namespace) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'TESTMAIL_API_KEY and TESTMAIL_NAMESPACE must be configured' 
      },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `https://api.testmail.app/api/json?apikey=${apiKey}&namespace=${namespace}&tag=${tag}&limit=50`
    );

    return NextResponse.json({
      success: true,
      emails: response.data.emails || [],
      tag: tag
    });
  } catch (error: any) {
    console.error('Error fetching emails:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
