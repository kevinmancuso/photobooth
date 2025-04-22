import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req) {
  try {
    const { to, imageUrl, body } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: body || "📸 Your photo booth picture is ready!",
      from: fromPhone,
      to,
      ...(imageUrl ? { mediaUrl: [imageUrl] } : {})
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error('Twilio error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
