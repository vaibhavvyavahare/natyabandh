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
            <div style="background-color: #1a020d; padding: 20px 10px; font-family: 'Georgia', serif; color: #ffffff; text-align: center;">
              <!-- Container with fluid width for mobile -->
              <div style="width: 100%; max-width: 500px; margin: 0 auto; background: #3d081d; border: 2px solid #c5a059; border-radius: 4px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); position: relative;">
                
                <!-- Watermark / Texture Effect -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.05; pointer-events: none; background-image: radial-gradient(#d4af37 1px, transparent 1px); background-size: 20px 20px;"></div>

                <!-- Header Section -->
                <div style="padding: 40px 15px 25px; position: relative; z-index: 1;">
                  <div style="margin-bottom: 20px;">
                    <img src="https://natyabandh.me/logo.png" width="90" height="90" style="border-radius: 50%; object-fit: cover; border: 2px solid #d4af37; padding: 4px; background: rgba(212, 175, 55, 0.1); filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4));" alt="Logo" />
                  </div>
                  <h1 style="margin: 0; font-size: 42px; letter-spacing: 4px; color: #d4af37; text-transform: uppercase; font-weight: normal; text-shadow: 0 2px 4px rgba(0,0,0,0.6); font-family: 'Times New Roman', Times, serif;">नाट्यबंध</h1>
                  <div style="margin: 10px auto; width: 100px; height: 1px; background: linear-gradient(90deg, transparent, #d4af37, transparent);"></div>
                  <p style="margin: 0; color: #f9e29c; letter-spacing: 3px; font-size: 12px; text-transform: uppercase; font-weight: 300;">PROUDLY PRESENTS</p>
                </div>

                <!-- Main Feature -->
                <div style="padding: 0 20px 30px; position: relative; z-index: 1;">
                  <h2 style="margin: 0; font-size: 24px; color: #fff; font-weight: bold; font-style: italic; letter-spacing: 0.5px; line-height: 1.4;">उमज <span style="color: #d4af37; font-style: normal; font-size: 0.7em; vertical-align: middle;">आणि</span> रंगों से परे</h2>
                </div>

                <!-- Perforation Line -->
                <div style="position: relative; height: 20px; margin: 0; overflow: hidden;">
                  <div style="position: absolute; top: 10px; left: 0; right: 0; border-top: 1px dashed rgba(212, 175, 55, 0.5);"></div>
                  <div style="position: absolute; left: -10px; top: 0; width: 20px; height: 20px; background: #1a020d; border-radius: 50%; border: 1px solid #c5a059;"></div>
                  <div style="position: absolute; right: -10px; top: 0; width: 20px; height: 20px; background: #1a020d; border-radius: 50%; border: 1px solid #c5a059;"></div>
                </div>

                <!-- Ticket Details -->
                <div style="padding: 25px 20px; position: relative; z-index: 1;">
                  <div style="border: 1px solid rgba(212, 175, 55, 0.3); padding: 20px; background: rgba(0,0,0,0.2); border-radius: 2px;">
                    <div style="margin-bottom: 20px;">
                      <span style="color: #d4af37; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 5px;">GUEST OF HONOR</span>
                      <span style="font-size: 20px; color: #fff; font-weight: bold; letter-spacing: 0.5px; word-wrap: break-word;">${customerName}</span>
                    </div>

                    <!-- Stable 2-Column layout for email -->
                    <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding: 15px 0;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="left" valign="top">
                            <span style="color: #d4af37; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 2px;">DATE</span>
                            <span style="font-size: 13px; color: #fff; font-weight: bold;">१२ मे, २०२६</span>
                          </td>
                          <td align="right" valign="top">
                            <span style="color: #d4af37; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 2px;">TIME</span>
                            <span style="font-size: 13px; color: #fff; font-weight: bold;">सायं. ५:३०</span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 15px;">
                      <span style="color: #d4af37; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 2px;">VENUE</span>
                      <span style="font-size: 13px; color: #fff; font-weight: bold; display: block; line-height: 1.4;">रामकृष्ण मोरे नाट्यगृह, पिंपरी चिंचवड</span>
                      <div style="margin-top: 10px;">
                        <a href="https://www.google.com/maps/search/Ramkrishna+More+Natyagruha+Chinchwad" style="color: #d4af37; font-size: 11px; text-decoration: none; border-bottom: 1px solid #d4af37; padding-bottom: 2px; font-weight: bold;">Google Map</a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer / Security Section -->
                <div style="background-color: #ffffff; padding: 30px 15px; position: relative;">
                  <div style="margin-bottom: 20px;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${payment.id}&color=3d081d" width="150" height="150" style="display: block; margin: 0 auto; max-width: 100%;" alt="QR Ticket" />
                  </div>
                  
                  <div style="display: inline-block; padding: 6px 12px; border: 1px solid #3d081d; color: #3d081d; font-size: 10px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; word-break: break-all;">
                    ID: ${payment.id}
                  </div>
                  
                  <p style="color: #666; margin: 10px 0 0; font-size: 9px; line-height: 1.4;">Scan at entrance for validation. Non-transferable.</p>
                </div>

                <!-- Side Ornaments -->
                <div style="position: absolute; top: 15px; left: 15px; width: 30px; height: 30px; border-top: 2px solid #d4af37; border-left: 2px solid #d4af37;"></div>
                <div style="position: absolute; top: 15px; right: 15px; width: 30px; height: 30px; border-top: 2px solid #d4af37; border-right: 2px solid #d4af37;"></div>
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
