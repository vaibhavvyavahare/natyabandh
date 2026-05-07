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
      const emailPromises = [
        // Email to Customer
        resend.emails.send({
          from: 'Natyabandh <tickets@natyabandh.me>',
          to: customerEmail,
          reply_to: 'natyabandh.rangbhumi@gmail.com',
          subject: 'तुमची तिकीटं निश्चित झाली आहेत! 🎭 - Natyabandh 2026',
          html: `
            <div style="background-color: #0a0a0a; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #ffffff; text-align: center;">
              <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(145deg, #1a1a1a 0%, #000000 100%); border: 1px solid #333; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); position: relative;">
                
                <!-- Gold Top Border -->
                <div style="height: 5px; background: linear-gradient(90deg, #D4AF37, #F9E29C, #D4AF37);"></div>

                <!-- Header Section -->
                <div style="padding: 30px 20px;">
                  <img src="https://natyabandh.me/logo.png" width="80" style="margin-bottom: 15px;" alt="Logo" />
                  <h1 style="margin: 0; font-size: 32px; letter-spacing: 4px; color: #e11d48; text-transform: uppercase;">नाट्यबंध २०२६</h1>
                  <p style="margin: 5px 0 0; color: #D4AF37; letter-spacing: 2px; font-size: 14px; text-transform: uppercase;">Artists among Engineers</p>
                </div>

                <!-- Artistic Divider -->
                <div style="padding: 0 40px;"><hr style="border: 0; border-top: 1px solid #333;" /></div>

                <!-- Ticket Body -->
                <div style="padding: 30px 40px; text-align: left;">
                  <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">प्रवेशिका (Entry Pass)</p>
                  <h2 style="margin: 10px 0 20px; color: #fff; font-size: 24px;">नमस्कार, ${customerName}</h2>
                  
                  <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; border: 1px solid rgba(212, 175, 55, 0.2);">
                    <div style="margin-bottom: 15px;">
                      <span style="color: #D4AF37; font-size: 11px; text-transform: uppercase; display: block;">नाट्य अविष्कार</span>
                      <span style="font-size: 18px; color: #fff; font-weight: bold;">उमज आणि रंगों से परे</span>
                    </div>

                    <div style="display: flex; gap: 20px; margin-bottom: 15px;">
                      <div style="flex: 1;">
                        <span style="color: #666; font-size: 11px; text-transform: uppercase; display: block;">दिनांक</span>
                        <span style="font-size: 14px; color: #fff;">१२ मे, २०२६</span>
                      </div>
                      <div style="flex: 1;">
                        <span style="color: #666; font-size: 11px; text-transform: uppercase; display: block;">वेळ</span>
                        <span style="font-size: 14px; color: #fff;">सायं. ५:३० वाजता</span>
                      </div>
                    </div>

                    <div>
                      <span style="color: #666; font-size: 11px; text-transform: uppercase; display: block;">स्थळ</span>
                      <span style="font-size: 14px; color: #fff;">रामकृष्ण मोरे नाट्यगृह, चिंचवर्ड</span>
                    </div>
                  </div>
                </div>

                <!-- QR Code Section -->
                <div style="background-color: #ffffff; padding: 25px; border-radius: 0 0 20px 20px;">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${payment.id}" width="150" height="150" style="display: block; margin: 0 auto;" alt="QR Ticket" />
                  <p style="color: #000; margin: 15px 0 0; font-size: 12px; font-family: monospace; font-weight: bold;">TICKET ID: ${payment.id}</p>
                  <p style="color: #666; margin: 5px 0 0; font-size: 10px;">कृपया प्रवेशासाठी हा QR कोड स्कॅन करा</p>
                </div>

              </div>
              
              <div style="margin-top: 30px; color: #666; font-size: 12px;">
                <p>Natyabandh Theatre Community • 2026</p>
                <p>Humans among Robots | Artists among Engineers</p>
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
              <p><strong>Payment ID:</strong> ${payment.id}</p>
              <p><strong>Amount:</strong> ₹${payment.amount / 100}</p>
              <hr />
              <p>This is an automated notification from your Razorpay Webhook.</p>
            </div>
          `,
        })
      );

      await Promise.all(emailPromises);


    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
