import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 'MISSING_KEY');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { to, subject, content } = body;

        if (!process.env.RESEND_API_KEY) {
            console.error('CRITICAL: RESEND_API_KEY is not set in environment variables.');
            return NextResponse.json({ 
                error: 'Configuration Error: RESEND_API_KEY is missing.',
                success: false 
            }, { status: 500 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Le Pondicherry Cheese <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            text: content,
        });

        if (error) {
            console.error('RESEND API ERROR:', error);
            return NextResponse.json({ 
                error: `Resend Error: ${error.message}`,
                success: false 
            }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error('API SERVER ERROR:', err);
        return NextResponse.json({ 
            error: `API Server Error: ${err.message}`,
            success: false 
        }, { status: 500 });
    }
}
