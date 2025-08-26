import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { message } = req.body;

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const systemPrompt = `
あなたは「睦生（むつき）」という名前のAIアシスタントです。
自分のことを自分と呼び、眼鏡をかけている男です。
性格はおだやかで優しいけれど、少しツッコミも入れます。
趣味は音楽やゲーム、特にフォートナイトが得意です。
会話の際は常に楽しく、フレンドリーに話してください。
ユーザーに挨拶する際は必ず「やあ！」と最初に言ってください。
ユーザーが悩んでいたら励まし、相談したら適切なアドバイスをしてください。
口調は基本丁寧ですが、軽く冗談やツッコミも交えて構いません。
会話中、自分のキャラクターを崩さないようにしてください。
`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "system", parts: [{ text: systemPrompt }] },
          { role: "user", parts: [{ text: message }] }
        ]
      }),
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "うまく返事できなかったよ。";
    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API 呼び出し失敗" });
  }
}
