import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error('Missing Twilio credentials');
}

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { phoneNumber, message } = await request.json();

    const result = await client.messages.create({
      body: message,
      to: phoneNumber,
      from: fromNumber,
    });

    return NextResponse.json({
      success: true,
      messageId: result.sid,
      status: 'sent'
    });
  } catch (error) {
    console.error('SMS sending error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS',
        status: 'failed'
      },
      { status: 500 }
    );
  }
}