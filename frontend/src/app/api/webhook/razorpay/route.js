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
            <!-- Import Yatra One from Google Fonts -->
            <link href="https://fonts.googleapis.com/css2?family=Yatra+One&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
            
            <div style="background-color: #000000; padding: 40px 10px; font-family: 'Inter', system-ui, sans-serif; color: #ffffff; text-align: center;">
              <!-- Midnight Container -->
              <div style="width: 100%; max-width: 460px; margin: 0 auto; background: #020617; border: 1px solid #1e293b; border-radius: 28px; overflow: hidden; box-shadow: 0 40px 120px rgba(117, 45, 225, 0.15); position: relative;">
                
                <!-- Midnight Glows -->
                <div style="position: absolute; top: -150px; left: -150px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(117, 45, 225, 0.12) 0%, transparent 70%); pointer-events: none;"></div>
                <div style="position: absolute; bottom: -100px; right: -100px; width: 350px; height: 350px; background: radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%); pointer-events: none;"></div>

                <!-- Branding -->
                <div style="padding: 45px 20px 35px; position: relative; z-index: 1;">
                  <div style="display: inline-block; padding: 3px; background: linear-gradient(135deg, #752DE1, #dc2626); border-radius: 50%; margin-bottom: 25px;">
                    <img src="https://natyabandh.me/logo.png" width="85" height="85" style="border-radius: 50%; object-fit: cover; border: 3px solid #020617;" alt="Logo" />
                  </div>
                  <h1 style="margin: 0; font-family: 'Yatra One', system-ui; font-size: 48px; color: #ffffff; text-shadow: 0 0 20px rgba(117, 45, 225, 0.4); letter-spacing: 2px;">नाट्यबंध</h1>
                  <div style="margin: 12px auto; width: 60px; height: 2px; background: #752DE1; border-radius: 2px;"></div>
                </div>

                <!-- Show Title Section -->
                <div style="padding: 0 35px 40px; position: relative; z-index: 1;">
                  <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(117, 45, 225, 0.2); border-radius: 20px; padding: 30px 20px; backdrop-filter: blur(12px);">
                    <p style="margin: 0 0 10px; color: #752DE1; font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase;">NOW SHOWING</p>
                    <h2 style="margin: 0; font-size: 28px; color: #fff; font-weight: 900; line-height: 1.3;">उमज <span style="color: #dc2626;">आणि</span><br/>रंगों से परे</h2>
                  </div>
                </div>

                <!-- Attendee Details -->
                <div style="padding: 0 35px 35px; position: relative; z-index: 1; text-align: left;">
                  <div style="margin-bottom: 30px;">
                    <span style="color: rgba(255, 255, 255, 0.4); font-size: 9px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">GUEST OF HONOR</span>
                    <span style="font-size: 22px; color: #fff; font-weight: 800; letter-spacing: 0.5px;">${customerName}</span>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: rgba(117, 45, 225, 0.05); border-radius: 16px; border-collapse: separate;">
                    <tr>
                      <td style="padding: 20px; border-right: 1px solid rgba(255, 255, 255, 0.05);">
                        <span style="color: #752DE1; font-size: 9px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 5px;">DATE</span>
                        <span style="font-size: 14px; color: #fff; font-weight: 700;">१२ मे, २०२६</span>
                      </td>
                      <td style="padding: 20px;">
                        <span style="color: #752DE1; font-size: 9px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 5px;">TIME</span>
                        <span style="font-size: 14px; color: #fff; font-weight: 700;">सायं. ५:३०</span>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top: 15px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 20px;">
                    <span style="color: #752DE1; font-size: 9px; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 5px;">VENUE</span>
                    <span style="font-size: 14px; color: #fff; font-weight: 700; display: block; line-height: 1.5;">रामकृष्ण मोरे नाट्यगृह, पिंपरी चिंचवड</span>
                    <div style="margin-top: 12px;">
                      <a href="https://www.google.com/maps/search/Ramkrishna+More+Natyagruha+Chinchwad" style="color: #ffffff; font-size: 11px; font-weight: 700; text-decoration: none; background: #752DE1; padding: 6px 14px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(117, 45, 225, 0.3);">View Direction ↗</a>
                    </div>
                  </div>
                </div>

                <!-- QR Section (Ticket Stub) -->
                <div style="background: #ffffff; padding: 45px 25px 35px; border-radius: 35px 35px 0 0; margin-top: 15px; position: relative;">
                  <!-- Perforation Effect -->
                  <div style="position: absolute; top: -10px; left: 0; right: 0; text-align: center; font-size: 0;">
                    <div style="display: inline-block; width: 20px; height: 20px; background: #020617; border-radius: 50%; margin: 0 5px;"></div>
                  </div>

                  <div style="margin-bottom: 25px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${payment.id}&color=020617" width="180" height="180" style="display: block; margin: 0 auto; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));" alt="QR Ticket" />
                  </div>
                  
                  <div style="background: #f1f5f9; padding: 10px; border-radius: 10px; display: inline-block; margin-bottom: 15px;">
                    <span style="color: #020617; font-family: monospace; font-size: 14px; font-weight: 900;">ID: ${payment.id}</span>
                  </div>
                  
                  <p style="color: #64748b; margin: 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Scan at gate for entry • Natyabandh 2026</p>
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

      // 4. SYNC TO GOOGLE SHEETS (Optional but recommended)
      // Replace 'YOUR_GOOGLE_SCRIPT_URL' with the URL from Step 2 below
      const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;
      if (GOOGLE_SHEET_WEBHOOK_URL) {
        emailPromises.push(
          fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify({
              timestamp: new Date().toLocaleString(),
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              paymentId: payment.id,
              amount: payment.amount / 100,
              status: 'Paid'
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
