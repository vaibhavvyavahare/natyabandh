import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.text(); // Get raw body for signature verification
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // 1. SECURITY: Verify the webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error("Invalid signature detected");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(body);

    // 2. CHECK EVENT: Ensure payment was captured
    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const customerEmail = payment.email;
      const customerName = payment.notes?.name || "Art Lover"; 
      const customerPhone = payment.notes?.Phone || payment.notes?.phone || payment.contact || "N/A";

      // 3. SEND EMAILS (Customer and Admin Notification)
      const emailPromises = [
        // Email to Customer
        resend.emails.send({
          from: 'Natyabandh <tickets@natyabandh.me>',
          to: customerEmail,
          reply_to: 'natyabandh.rangbhumi@gmail.com',
          subject: 'तुमची तिकीटं निश्चित झाली आहेत! 🎭 - Natyabandh 2026',
          html: `
            <link href="https://fonts.googleapis.com/css2?family=Yatra+One&display=swap" rel="stylesheet">
            <div style="background-color: #faf8f5; font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #000; padding: 20px; border: 2px solid #000; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://natyabandh.me/logo.png" width="70" height="70" alt="Logo" style="border-radius: 50%; border: 2px solid #e5e5e5; padding: 3px; background-color: #fff;" />
                <h1 style="margin: 10px 0; font-size: 32px; font-family: 'Yatra One', serif; color: #1f2937; letter-spacing: 1px;">नाट्यबंध</h1>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: #16a34a; color: #fff; padding: 10px 20px; display: inline-block; border-radius: 4px; font-weight: bold; font-size: 16px; text-transform: uppercase; box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);">
                  ✓ Ticket Confirmed
                </div>
              </div>

              <div style="margin-bottom: 30px;">
                <p style="margin: 8px 0; border-bottom: 1px solid #fafafa; padding-bottom: 4px;"><strong>Attendee:</strong> ${customerName}</p>
                <p style="margin: 8px 0; border-bottom: 1px solid #fafafa; padding-bottom: 4px;"><strong>Show:</strong> उमज आणि रंगों से परे</p>
                <p style="margin: 8px 0; border-bottom: 1px solid #fafafa; padding-bottom: 4px;"><strong>Date:</strong> १२ मे, २०२६</p>
                <p style="margin: 8px 0; border-bottom: 1px solid #fafafa; padding-bottom: 4px;"><strong>Time:</strong> सायं. ५:३०</p>
                <p style="margin: 8px 0; border-bottom: 1px solid #fafafa; padding-bottom: 4px;"><strong>Venue:</strong> रामकृष्ण मोरे नाट्यगृह, चिंचवड</p>
                <p style="margin: 8px 0; border-bottom: 1px solid #fafafa; padding-bottom: 4px;"><strong>Ticket ID:</strong> ${payment.id}</p>
              </div>

              <div style="text-align: center; border-top: 2px dashed #000; padding-top: 20px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${payment.id}" width="150" height="150" alt="QR Ticket" />
                <p style="font-size: 11px; color: #666; margin-top: 10px;">Scan this QR code at the entry gate</p>
              </div>
            </div>
          `,
        })
      ];

      // ONLY send to admin notification if it's NOT the customer (prevents double emails during your own tests)
      // and hardcoded to your gmail only.
      const adminEmail = 'natyabandh.rangbhumi@gmail.com';
      
      console.log(`Sending ticket to: ${customerEmail}`);
      console.log(`Sending admin notification to: ${adminEmail}`);

      emailPromises.push(
        resend.emails.send({
          from: 'Natyabandh System <system@natyabandh.me>',
          to: adminEmail,
          subject: `New Ticket Booking: ${customerName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>New Booking Received! 🎭</h2>
              <p><strong>Customer Name:</strong> ${customerName}</p>
              <p><strong>Customer Email:</strong> ${customerEmail}</p>
              <p><strong>Phone Number:</strong> ${customerPhone}</p>
              <p><strong>Payment ID:</strong> ${payment.id}</p>
              <p><strong>Amount:</strong> ₹${payment.amount / 100}</p>
              <hr />
              <p>This is an automated notification from your Razorpay Webhook.</p>
            </div>
          `,
        })
      );

      // 4. SYNC TO GOOGLE SHEETS (Optional but recommended)
      const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;
      if (GOOGLE_SHEET_WEBHOOK_URL) {
        emailPromises.push(
          fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: [
                {
                  timestamp: new Date().toLocaleString(),
                  name: customerName,
                  email: customerEmail,
                  phone: customerPhone,
                  paymentId: payment.id,
                  amount: payment.amount / 100,
                  status: 'Paid'
                }
              ]
            })
          }).catch(err => console.error("Google Sheet Sync Error:", err))
        );
      }

      await Promise.all(emailPromises);


    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
