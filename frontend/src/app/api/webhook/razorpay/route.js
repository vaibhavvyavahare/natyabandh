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
            <div style="background-color: #1a020d; padding: 50px 20px; font-family: 'Georgia', serif; color: #ffffff; text-align: center;">
              <div style="max-width: 550px; margin: 0 auto; background: #3d081d; border: 3px solid #c5a059; border-radius: 4px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.8); position: relative; border-image: linear-gradient(to bottom, #f9e29c, #d4af37, #8a6d3b) 1;">
                
                <!-- Watermark / Texture Effect -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.05; pointer-events: none; background-image: radial-gradient(#d4af37 1px, transparent 1px); background-size: 20px 20px;"></div>

                <!-- Header Section -->
                <div style="padding: 50px 30px 30px; position: relative; z-index: 1;">
                <div style="margin-bottom: 25px;">
                  <img src="https://natyabandh.me/logo.png" width="100" height="100" style="border-radius: 50%; object-fit: cover; border: 2px solid #d4af37; padding: 5px; background: rgba(212, 175, 55, 0.1); filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4));" alt="Logo" />
                </div>
                  <h1 style="margin: 0; font-size: 52px; letter-spacing: 12px; color: #d4af37; text-transform: uppercase; font-weight: normal; text-shadow: 0 2px 4px rgba(0,0,0,0.6); font-family: 'Times New Roman', Times, serif;">नाट्यबंध</h1>
                  <div style="margin: 15px auto; width: 150px; height: 1px; background: linear-gradient(90deg, transparent, #d4af37, transparent);"></div>
                  <p style="margin: 0; color: #f9e29c; letter-spacing: 6px; font-size: 14px; text-transform: uppercase; font-weight: 300;">PROUDLY PRESENTS</p>
                </div>

                <!-- Main Feature -->
                <div style="padding: 0 40px 40px; position: relative; z-index: 1;">
                  <h2 style="margin: 0; font-size: 32px; color: #fff; font-weight: bold; font-style: italic; letter-spacing: 1px; line-height: 1.4;">उमज <span style="color: #d4af37; font-style: normal; font-size: 20px; vertical-align: middle; margin: 0 10px;">आणि</span> रंगों से परे</h2>
                </div>

                <!-- Perforation Line -->
                <div style="position: relative; height: 20px; margin: 0 -10px; overflow: hidden;">
                  <div style="position: absolute; top: 10px; left: 0; right: 0; border-top: 2px dashed rgba(212, 175, 55, 0.4);"></div>
                  <div style="position: absolute; left: -15px; top: 0; width: 30px; height: 30px; background: #1a020d; border-radius: 50%; border: 3px solid #c5a059;"></div>
                  <div style="position: absolute; right: -15px; top: 0; width: 30px; height: 30px; background: #1a020d; border-radius: 50%; border: 3px solid #c5a059;"></div>
                </div>

                <!-- Ticket Details -->
                <div style="padding: 40px; position: relative; z-index: 1;">
                  <div style="border: 1px solid rgba(212, 175, 55, 0.4); padding: 30px; background: rgba(0,0,0,0.3); border-radius: 2px;">
                    <div style="margin-bottom: 30px;">
                      <span style="color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; display: block; margin-bottom: 8px;">GUEST OF HONOR</span>
                      <span style="font-size: 24px; color: #fff; font-weight: bold; letter-spacing: 1px;">${customerName}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(212, 175, 55, 0.2); padding: 20px 0;">
                      <div style="text-align: left;">
                        <span style="color: #d4af37; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">DATE</span>
                        <span style="font-size: 16px; color: #fff; font-weight: bold;">१२ मे, २०२६</span>
                      </div>
                      <div style="text-align: right;">
                        <span style="color: #d4af37; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">TIME</span>
                        <span style="font-size: 16px; color: #fff; font-weight: bold;">सायं. ५:३०</span>
                      </div>
                    </div>

                    <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 20px;">
                      <span style="color: #d4af37; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">VENUE</span>
                      <span style="font-size: 16px; color: #fff; font-weight: bold;">रामकृष्ण मोरे नाट्यगृह, पिंपरी चिंचवड</span>
                      <div style="margin-top: 12px;">
                        <a href="https://www.google.com/maps/search/Ramkrishna+More+Natyagruha+Chinchwad" style="color: #d4af37; font-size: 11px; text-decoration: none; border-bottom: 1px solid #d4af37; padding-bottom: 2px;">Open in Google Maps</a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer / Security Section -->
                <div style="background-color: #ffffff; padding: 40px; position: relative;">
                  <div style="margin-bottom: 25px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${payment.id}&color=3d081d" width="160" height="160" style="display: block; margin: 0 auto; padding: 10px; border: 1px solid #eee;" alt="QR Ticket" />
                  </div>
                  
                  <div style="display: inline-block; padding: 8px 20px; border: 1px solid #3d081d; color: #3d081d; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border-radius: 2px;">
                    OFFICIAL ENTRY PASS: ${payment.id}
                  </div>
                  
                  <p style="color: #666; margin: 15px 0 0; font-size: 10px; font-style: italic;">This ticket is non-transferable and must be presented at the gate.</p>
                </div>

                <!-- Side Ornaments -->
                <div style="position: absolute; top: 20px; left: 20px; width: 40px; height: 40px; border-top: 2px solid #d4af37; border-left: 2px solid #d4af37;"></div>
                <div style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-top: 2px solid #d4af37; border-right: 2px solid #d4af37;"></div>
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
