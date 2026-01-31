import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const log = await request.json();

        // Create chat_logs directory if it doesn't exist
        const logsDir = path.join(process.cwd(), 'chat_logs');
        try {
            await fs.access(logsDir);
        } catch {
            await fs.mkdir(logsDir, { recursive: true });
        }

        // Log file path (one file per day)
        const today = new Date().toISOString().split('T')[0];
        const logFile = path.join(logsDir, `${today}.json`);

        // Read existing logs or create new array
        let logs = [];
        try {
            const content = await fs.readFile(logFile, 'utf-8');
            logs = JSON.parse(content);
        } catch {
            logs = [];
        }

        // Append new log
        logs.push({
            ...log,
            timestamp: new Date().toISOString()
        });

        // Write back to file
        await fs.writeFile(logFile, JSON.stringify(logs, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Chat logging error:', error);
        return NextResponse.json({ success: false, error: String(error) });
    }
}
