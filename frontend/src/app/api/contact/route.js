import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    console.log(`Processing contact form for: ${name} (${email})`);

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('UserTable')
      .insert([{ Name: name, Email: email, Msg: message }]);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      throw dbError;
    }

    // 2. Send Email via Resend
    // We try sending from system@natyabandh.me first. 
    // If that fails (due to domain not verified), we'll know in the logs.
    const { data, error: emailError } = await resend.emails.send({
      from: 'Natyabandh <system@natyabandh.me>',
      to: 'natyabandh.rangbhumi@gmail.com',
      reply_to: email,
      subject: `New Message from ${name} 🎭`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">नवीन संदेश (New Message)</h2>
          <div style="margin: 20px 0;">
            <p><strong>नाव (Name):</strong> ${name}</p>
            <p><strong>ईमेल (Email):</strong> ${email}</p>
            <p style="margin-top: 20px;"><strong>संदेश (Message):</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626; font-style: italic;">
              ${message}
            </div>
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666; text-align: center;">Sent from Natyabandh Website Contact Form</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend Email Error:', emailError);
      // We don't throw here so the user still gets a success message for the DB save
      // but we log it for debugging.
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Saved to DB and email triggered',
      emailId: data?.id 
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
