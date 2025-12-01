import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function GET() {

  const prompt = `
  # 命令
  作業の合間にできる簡単なリフレッシュを提案してください。
  
  # 制約
  - 1行で提案してください。
  - 提案は作業の合間にできる簡単なリフレッシュを提案してください。
  
  # 出力例
  - 大きく背伸びしよう🙆
  - 室内で少し歩こう

  # 出力
  - 1行で提案してください。
  `
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt}],
      },
    ],
  });

  return NextResponse.json({suggestion: response.text}, {status: 200});
}
