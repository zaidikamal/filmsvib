import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { createClient } from "@/utils/supabase/server"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    console.log("Receiving AI Request for:", prompt)

    if (!prompt) {
      return NextResponse.json({ error: "الرجاء كتابة مزاجك أو طلبك" }, { status: 400 })
    }

    // Connect to Supabase to fetch user context & enforce Rate Limiting
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لاستخدام الذكاء الاصطناعي." }, { status: 401 })
    }

    // Rate Limiting Check (Max 10 requests per day)
    const { data: usageLog, error: logError } = await supabase
      .from('ai_usage_logs')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    if (usageLog && usageLog.length >= 10) {
      return NextResponse.json({ error: "لقد تجاوزت الحد المسموح لك اليوم من التوصيات (10 توصيات يوميا). يرجى المحاولة غدا!" }, { status: 429 })
    }
    
    // Log the prompt usage
    await supabase.from('ai_usage_logs').insert([{ user_id: user.id, prompt_text: prompt.substring(0, 500) }])

    let userContextStr = ""
    // Get user watchlists to influence recommendations
    const { data: watchlists } = await supabase
      .from('watchlists')
      .select('movie_title')
      .eq('user_id', user.id)
      .limit(10)
    
    if (watchlists && watchlists.length > 0) {
      userContextStr = `For context, the user already likes these movies: ${watchlists.map((w: any) => w.movie_title).join(", ")}. Use this to recommend similar vibe movies, but do NOT recommend these exact movies again.`
    }

    const systemPrompt = `
      You are an elite movie recommendation expert providing a premium cinematic experience (like a high-end IMDb / The Vault curator).
      The user will describe their mood or give a request.
      ${userContextStr}

      Process the request and return ONLY a JSON array containing EXACTLY 3 movie recommendations. Do not use Markdown formatting for the JSON, just plain JSON string.
      
      Format:
      [
        {
          "title": "Movie Original Title (in English for DB search)",
          "arabic_title": "الاسم بالعربي",
          "year": "Release Year",
          "reason": "Explain like a luxury Netflix advisor why this specific movie matches their mood. Use an engaging, cinematic, descriptive Arabic tone (e.g. 'اخترت لك هذا الفيلم لأنك تبحث عن الإثارة ولأن الحبكة تشبه كثيرا الفيلم الذي أحببته...')."
        }
      ]
    `

    // Call Gemini!
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Request: " + prompt }] }
        ],
    });

    const aiText = response.text || "[]"
    console.log("AI Raw Output:", aiText)

    // Parse JSON
    let aiMovies = []
    try {
      const cleanedJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim()
      aiMovies = JSON.parse(cleanedJson)
    } catch (e) {
      console.error("Failed to parse AI JSON:", e)
      return NextResponse.json({ error: "فشل في معالجة بيانات الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى." }, { status: 500 })
    }

    // Enrich with TMDB Data
    const enrichedMovies = await Promise.all(
      aiMovies.map(async (movie: any) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&language=ar-SA`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                accept: 'application/json'
              },
            }
          )
          const data = await res.json()
          const tmdbMatch = data.results && data.results.length > 0 ? data.results[0] : null
          
          return {
            ...movie,
            tmdb_id: tmdbMatch?.id,
            poster_path: tmdbMatch?.poster_path,
            vote_average: tmdbMatch?.vote_average,
            overview: tmdbMatch?.overview,
            release_date: tmdbMatch?.release_date
          }
        } catch (error) {
           console.error("TMDB error for", movie.title, error)
           return movie
        }
      })
    )

    // Filter out movies that didn't match TMDB
    const finalMovies = enrichedMovies.filter(m => m.tmdb_id)

    return NextResponse.json({ movies: finalMovies })

  } catch (error: any) {
    console.error("AI Route Error:", error)
    return NextResponse.json({ error: "حدث خطأ داخلي في الخادم" }, { status: 500 })
  }
}
