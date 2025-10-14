import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, eventType, message } = await request.json();

        // Validate required fields
        if (!name || !email || !phone || !eventType || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Setup transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content/options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'tarangevents25@gmail.com', // Destination admin email
            subject: `New Contact Form Submission - ${eventType} Event`,
            html: `
        <div style="font-family: Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#3B82F6;color:white;padding:16px 20px;border-radius:9px 9px 0 0;">
            <h2 style="margin:0;">New Contact Form Submission</h2>
            <p style="margin:6px 0 0;">Taraang Events</p>
          </div>
          <table style="width:100%;background:#f9f9f9;border-collapse:collapse;">
            <tr><td style="padding:12px;font-weight:bold;width:30%;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding:12px;font-weight:bold;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding:12px;font-weight:bold;">Phone:</td><td>${phone}</td></tr>
            <tr><td style="padding:12px;font-weight:bold;">Event Type:</td><td>${eventType}</td></tr>
            <tr><td style="padding:12px;font-weight:bold;">Message:</td><td>${message}</td></tr>
          </table>
          <div style="background:#e3f2fd;padding:12px;border-radius:0 0 9px 9px;text-align:center;">
            <p style="margin:0;color:#1565c0;font-size:14px;">
              This email was sent from the contact form on your website.
            </p>
          </div>
        </div>
      `,
            replyTo: email,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        // Log real error for debugging
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}

// Optionally handle GET for testing
export async function GET() {
    return NextResponse.json({ status: "route works" });
}
