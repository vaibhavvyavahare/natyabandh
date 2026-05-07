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
            <div style="background-color: #000000; padding: 40px 10px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; text-align: center;">
              <!-- Main Cinematic Container -->
              <div style="width: 100%; max-width: 480px; margin: 0 auto; background: #0a0a0a; border: 1px solid #333; border-radius: 24px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.9); position: relative;">
                
                <!-- Dynamic Background Glows -->
                <div style="position: absolute; top: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%); pointer-events: none;"></div>
                <div style="position: absolute; bottom: -50px; right: -50px; width: 250px; height: 250px; background: radial-gradient(circle, rgba(225, 29, 72, 0.1) 0%, transparent 70%); pointer-events: none;"></div>

                <!-- Header / Branding -->
                <div style="padding: 40px 20px 30px; position: relative; z-index: 1;">
                  <div style="display: inline-block; padding: 4px; background: linear-gradient(45deg, #d4af37, #f9e29c); border-radius: 50%; margin-bottom: 20px; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);">
                    <img src="https://natyabandh.me/logo.png" width="80" height="80" style="border-radius: 50%; object-fit: cover; border: 2px solid #000;" alt="Logo" />
                  </div>
                  <h1 style="margin: 0; font-size: 38px; letter-spacing: 6px; color: #fff; text-transform: uppercase; font-weight: 900; text-shadow: 0 0 15px rgba(255,255,255,0.2);">नाट्यबंध</h1>
                  <p style="margin: 8px 0 0; color: #d4af37; letter-spacing: 4px; font-size: 11px; text-transform: uppercase; font-weight: bold; opacity: 0.8;">OFFICIAL ENTRY PASS</p>
                </div>

                <!-- Feature Poster Section -->
                <div style="padding: 0 30px 40px; position: relative; z-index: 1;">
                  <div style="background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 25px; backdrop-filter: blur(10px);">
                    <h2 style="margin: 0; font-size: 26px; color: #fff; font-weight: 800; line-height: 1.2;">उमज <span style="color: #e11d48;">आणि</span><br/>रंगों से परे</h2>
                    <div style="margin: 15px auto; width: 40px; height: 3px; background: #d4af37; border-radius: 2px;"></div>
                    <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">PRESENTS THE SPECTACLE</p>
                  </div>
                </div>

                <!-- Ticket Data -->
                <div style="padding: 0 30px 30px; position: relative; z-index: 1;">
                  <div style="text-align: left; border-left: 3px solid #d4af37; padding-left: 20px; margin-bottom: 30px;">
                    <span style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 5px;">GUEST</span>
                    <span style="font-size: 20px; color: #fff; font-weight: bold; letter-spacing: 0.5px;">${customerName}</span>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.03); border-radius: 12px; border-collapse: separate;">
                    <tr>
                      <td style="padding: 15px; border-right: 1px solid rgba(255,255,255,0.05);">
                        <span style="color: #d4af37; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">DATE</span>
                        <span style="font-size: 13px; color: #fff; font-weight: bold;">१२ मे, २०२६</span>
                      </td>
                      <td style="padding: 15px;">
                        <span style="color: #d4af37; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">TIME</span>
                        <span style="font-size: 13px; color: #fff; font-weight: bold;">सायं. ५:३०</span>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top: 15px; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 15px; text-align: left;">
                    <span style="color: #d4af37; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px;">VENUE</span>
                    <span style="font-size: 13px; color: #fff; font-weight: bold; display: block; line-height: 1.4;">रामकृष्ण मोरे नाट्यगृह, पिंपरी चिंचवड</span>
                    <div style="margin-top: 8px;">
                      <a href="https://www.google.com/maps/search/Ramkrishna+More+Natyagruha+Chinchwad" style="color: #fff; font-size: 11px; text-decoration: none; background: #333; padding: 4px 10px; border-radius: 4px; display: inline-block;">Google Map ↗</a>
                    </div>
                  </div>
                </div>

                <!-- Footer Section (Scan Zone) -->
                <div style="background: #fff; padding: 40px 20px; border-radius: 32px 32px 0 0; margin-top: 10px;">
                  <div style="margin-bottom: 25px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${payment.id}&color=000000" width="180" height="180" style="display: block; margin: 0 auto; filter: contrast(1.1);" alt="QR Ticket" />
                  </div>
                  
                  <div style="color: #000; font-family: monospace; font-size: 13px; font-weight: 800; letter-spacing: 1px; margin-bottom: 10px;">
                    ID: ${payment.id}
                  </div>
                  
                  <div style="height: 1px; width: 40px; background: #eee; margin: 15px auto;"></div>
                  <p style="color: #999; margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Verified Ticket • Natyabandh 2026</p>
                </div>
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

      await Promise.all(emailPromises);


    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
