import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { name, mobile, email, interested, message } = await req.json();

        if (!name || !mobile || !email) {
            return NextResponse.json({ error: "Name, mobile and email are required." }, { status: 400 });
        }

        const interestedLabel: Record<string, string> = {
            "batch-timing": "Batch Timings & Demo",
            "college-plan": "College Batch Plan",
            "individual": "Individual Enrollment",
            "other": "Other Enquiry",
        };

        const { error } = await resend.emails.send({
            from: "RK Skills Portal <onboarding@resend.dev>",   // free Resend sender (no domain needed)
            to: ["rkskillsandsolutions@gmail.com"],
            subject: `📩 New Enquiry from ${name}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                    <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:28px 32px;">
                        <h1 style="color:white;margin:0;font-size:22px;">New Enquiry – RK Skills Portal</h1>
                    </div>
                    <div style="padding:32px;background:#ffffff;">
                        <table style="width:100%;border-collapse:collapse;">
                            <tr>
                                <td style="padding:10px 0;color:#6b7280;font-size:14px;width:140px;">Full Name</td>
                                <td style="padding:10px 0;color:#111827;font-weight:600;">${name}</td>
                            </tr>
                            <tr style="border-top:1px solid #f3f4f6;">
                                <td style="padding:10px 0;color:#6b7280;font-size:14px;">Mobile</td>
                                <td style="padding:10px 0;color:#111827;font-weight:600;">${mobile}</td>
                            </tr>
                            <tr style="border-top:1px solid #f3f4f6;">
                                <td style="padding:10px 0;color:#6b7280;font-size:14px;">Email</td>
                                <td style="padding:10px 0;color:#111827;font-weight:600;"><a href="mailto:${email}" style="color:#4f46e5;">${email}</a></td>
                            </tr>
                            <tr style="border-top:1px solid #f3f4f6;">
                                <td style="padding:10px 0;color:#6b7280;font-size:14px;">Interested In</td>
                                <td style="padding:10px 0;color:#111827;font-weight:600;">${interestedLabel[interested] || interested || "Not specified"}</td>
                            </tr>
                            ${message ? `
                            <tr style="border-top:1px solid #f3f4f6;">
                                <td style="padding:10px 0;color:#6b7280;font-size:14px;vertical-align:top;">Message</td>
                                <td style="padding:10px 0;color:#374151;">${message.replace(/\n/g, "<br/>")}</td>
                            </tr>` : ""}
                        </table>

                        <div style="margin-top:28px;padding:16px;background:#fff7ed;border-radius:8px;border-left:4px solid #f97316;">
                            <p style="margin:0;color:#92400e;font-size:13px;">
                                📞 Call back: <strong>${mobile}</strong><br/>
                                ✉️ Reply to: <strong>${email}</strong>
                            </p>
                        </div>
                    </div>
                    <div style="padding:16px 32px;background:#f9fafb;text-align:center;color:#9ca3af;font-size:12px;">
                        Sent from RK Skills Portal enquiry form • +91 9550465533
                    </div>
                </div>
            `,
            text: `New Enquiry\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nInterested In: ${interestedLabel[interested] || interested || "Not specified"}\nMessage: ${message || "—"}`,
        });

        if (error) {
            console.error("[enquiry] Resend error:", error);
            return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("[enquiry] Error:", err);
        return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }
}
