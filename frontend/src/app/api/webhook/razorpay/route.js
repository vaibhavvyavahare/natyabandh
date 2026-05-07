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
      const customerName = payment.notes?.name || "Art Lover"; // Ensure you pass 'name' in Razorpay Notes

      // 3. SEND EMAILS (Customer and Admin Notification)
      await Promise.all([
        // Email to Customer
        resend.emails.send({
          from: 'Natyabandh <tickets@natyabandh.me>',
          to: customerEmail,
          reply_to: 'natyabandh.rangbhumi@gmail.com',
          subject: 'तुमची तिकीटं निश्चित झाली आहेत! 🎭 - Natyabandh 2026',
          html: `
            <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <div style="background-color: #4A0404; color: white; padding: 15px; text-align: center; border-radius: 5px;">
                <h1>नाट्यबंध २०२६</h1>
              </div>
              <p>नमस्कार <strong>${customerName}</strong>,</p>
              <p>'उमज' आणि 'रंगों से परे' नाटकासाठी तुमचे बुकिंग यशस्वी झाले आहे.</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #D4AF37; margin: 20px 0;">
                <p>📍 <strong>स्थळ:</strong> रामकृष्ण मोरे नाट्यगृह, चिंचवर्ड</p>
                <p>📅 <strong>दिनांक:</strong> १२ मे, २०२६</p>
                <p>⏰ <strong>वेळ:</strong> सायं. ५:३० वाजता</p>
                <p>💳 <strong>Payment ID:</strong> ${payment.id}</p>
              </div>
              <p>प्रवेशासाठी ही ईमेल दाखवणे आवश्यक आहे.</p>
              <p>भेटूया लवकर!</p>
              <hr />
              <p style="font-size: 12px; color: #666; text-align: center;">Artists among Engineers | Humans among Robots</p>
            </div>
          `,
        }),

        // Email to Admin
        resend.emails.send({
          from: 'Natyabandh System <system@natyabandh.me>',
          to: 'natyabandh.rangbhumi@gmail.com',
          subject: `New Ticket Booking: ${customerName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>New Booking Received! 🎭</h2>
              <p><strong>Customer Name:</strong> ${customerName}</p>
              <p><strong>Customer Email:</strong> ${customerEmail}</p>
              <p><strong>Payment ID:</strong> ${payment.id}</p>
              <p><strong>Amount:</strong> ₹${payment.amount / 100}</p>
              <hr />
              <p>This is an automated notification from your Razorpay Webhook.</p>
            </div>
          `,
        })
      ]);

    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
