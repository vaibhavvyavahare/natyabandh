import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    const { record } = payload // 'record' contains the new row data from UserTable

    console.log("New message received from record:", record)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Natyabandh Website <system@natyabandh.me>',
        to: 'natyabandh.rangbhumi@gmail.com',
        subject: `New Website Message from ${record.Name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #752DE1;">New Contact Form Submission 🎭</h2>
            <p><strong>Name:</strong> ${record.Name}</p>
            <p><strong>Email:</strong> ${record.Email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
              ${record.Msg}
            </div>
            <hr style="margin-top: 20px; border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">This message was automatically forwarded from the Natyabandh website database.</p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 500 
    })
  }
})
