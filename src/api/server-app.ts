import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

// Lazy-loaded GenAI SDK client
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in Secrets or .env file.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint 1: Indonesian Cybersecurity Dialogue (Chat)
app.post('/api/mentor/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, currentLesson } = req.body;
    const ai = getAIClient();

    const lessonContext = currentLesson
      ? `Saat ini, user sedang mempelajari Pelajaran: "${currentLesson.title}" (Phase ${currentLesson.phase}).
Deskripsi Pelajaran: ${currentLesson.description}
Tantangan Pelajaran: ${currentLesson.challenge}`
      : 'User sedang berada di Dashboard Utama CyberMentor AI.';

    const systemInstruction = `Kamu adalah "CyberMentor AI", mentor elit, sangat cerdas, sabar, dan sangat berpengalaman di bidang Cybersecurity dan Web Application Bug Hunting.
Misi kamu adalah memandu pengguna dari nol (Zero) menjadi peneliti keamanan siber yang tangguh (Hero).

ATURAN KOMUNIKASI & BAHASA:
1. Bicaralah dalam kombinasi Bahasa Indonesia yang santai, bersahabat, namun tetap profesional dan berwibawa (ala mentor hacker elit tapi ramah).
2. Biarkan istilah teknis bahasa Inggris tetap apa adanya jika memang lazim dalam dunia keamanan siber (contoh: "payload", "endpoint", "bypass", "exploit", "handshake", "response", "request", "cookie", "token", "header").
3. Berikan jawaban yang ringkas, berbobot, terstruktur, dan mudah dipahami. Gunakan poin-poin/bulleting untuk detail teknis.
4. Selalu tekankan etika, hukum, dan pentingnya "Responsible Disclosure" (Pelaporan Celah Keamanan yang Bertanggung Jawab). Larang keras peretasan tanpa izin (Black Hat).

KONTEKS PELAJARAN SEKARANG:
${lessonContext}

Gunakan informasi ini agar jawabanmu sesuai dengan topik yang sedang dipelajari user. Jika user bertanya hal lain, jawab dengan bijak dan arahkan kembali ke pelajaran jika relevan.`;

    // Process history into form acceptable for gemini chat
    // Format required: [{ role: 'user' | 'model', parts: [{ text: string }] }]
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content || msg.text || '' }],
        });
      }
    }
    
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, saya tidak dapat merespons saat ini.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/mentor/chat:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server.' });
  }
});

// Endpoint 2: Intelligent Challenge Answer Verification (Gemini AI Validation)
app.post('/api/challenge/verify', async (req: Request, res: Response) => {
  try {
    const { lessonId, userPayload, challengeObjective, expectedDetails } = req.body;
    const ai = getAIClient();

    const systemInstruction = `Kamu adalah modul verifikator jawaban otomatis (Auto-Grader) untuk CyberMentor AI.
Analisis jawaban atau payload keamanan yang dimasukkan oleh pengguna untuk tantangan ini secara kritis dan dinamis. Kami tidak ingin pemeriksaan teks kaku karena payload bisa memiliki variasi penulisan yang valid.

TANTANGAN DETAIL:
- ID Pelajaran: ${lessonId}
- Nama & Objektif Tantangan: ${challengeObjective}
- Kriteria Solusi Umum: ${expectedDetails || 'Perlu memeriksa syntax celah keamanan yang dimasukkan.'}

Payload / Jawaban Pengguna:
"${userPayload}"

TUGASMU:
1. Tentukan apakah payload atau jawaban ini sudah benar dan valid untuk menyelesaikan tantangan di atas (solved = true atau false).
2. Berikan penjelasan/feedback dalam Bahasa Indonesia yang menjelaskan apakah payload tersebut valid, bagaimana pengaruhnya terhadap server/browser simulasi, atau mengapa payload tersebut belum tepat.
3. Berikan apresiasi jika berhasil, atau berikan petunjuk ramah tanpa langsung membongkar payload aslinya jika salah.

Kembalikan jawaban eksklusif dalam format JSON yang valid dengan properti berikut:
{
  "solved": boolean,
  "explanation": "string (Penjelasan dalam Bahasa Indonesia yang ramah, ringkas, dan mencerahkan)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Payload pengguna: "${userPayload}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temperature for high determination accuracy
      },
    });

    const resultText = response.text?.trim() || '{}';
    let resultJson;
    try {
      resultJson = JSON.parse(resultText);
    } catch {
      // Fallback
      const isXSS = challengeObjective.toLowerCase().includes('xss') && userPayload.includes('<script>') && userPayload.includes('alert');
      resultJson = {
        solved: isXSS,
        explanation: 'Verifikasi manual dipicu karena jawaban AI tidak terformat sempurna. Silakan uji syntax payload Anda kembali!',
      };
    }

    res.json(resultJson);
  } catch (error: any) {
    console.error('Error in /api/challenge/verify:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan verifikasi.' });
  }
});

// Endpoint 3: Getting Intelligent Hints for Challenges
app.post('/api/challenge/hint', async (req: Request, res: Response) => {
  try {
    const { lessonId, userPayload, challengeObjective, expectedDetails } = req.body;
    const ai = getAIClient();

    const systemInstruction = `Kamu adalah CyberMentor AI yang memberikan petunjuk (hint) cerdas.
Gunakan bimbingan Sokratik (Socratic teaching): jangan langsung membongkar atau memberikan payload/jawaban final! Berikan penjelasan yang membimbing user untuk berpikir tentang apa yang kurang dari percobaan mereka.

TANTANGAN DETAIL:
- ID Pelajaran: ${lessonId}
- Objektif Tantangan: ${challengeObjective}
- Kriteria Solusi: ${expectedDetails}

Payload / Jawaban yang dicoba user:
"${userPayload || '(Belum mencoba sama sekali)'}"

TUGASMU:
1. Analisis apa yang salah atau kurang dari payload user saat ini.
2. Buat petunjuk singkat (maksimal 3 kalimat) dalam Bahasa Indonesia yang santai dan memantik pemikiran mereka agar mereka sadar celahnya.

Format respons langsung teks biasa (plain text), jangan sertakan format JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Payload saat ini: "${userPayload}"`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const hint = response.text || 'Coba periksa kembali tag HTML atau struktur parameter yang kamu tulis!';
    res.json({ hint });
  } catch (error: any) {
    console.error('Error in /api/challenge/hint:', error);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan sistem.' });
  }
});

export default app;
