import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { createClient } from "@/utils/supabase/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing!");
      return NextResponse.json({ error: "الخدمة غير متوفرة حالياً (API Key missing)" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })
    console.log("Receiving AI Request for:", prompt)

    if (!prompt) {
      return NextResponse.json({ error: "الرجاء كتابة مزاجك أو طلبك" }, { status: 400 })
    }

    // Connect to Supabase
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول لاستخدام الذكاء الاصطناعي." }, { status: 401 })
    }

    // Rate Limiting Check
    const { data: usageLog } = await supabase
      .from('ai_usage_logs')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    if (usageLog && usageLog.length >= 10) {
      return NextResponse.json({ error: "لقد تجاوزت الحد المسموح لك اليوم من التوصيات (10 توصيات يوميا). يرجى المحاولة غدا!" }, { status: 429 })
    }
    
    // Log the prompt
    await supabase.from('ai_usage_logs').insert([{ user_id: user.id, prompt_text: prompt.substring(0, 500) }])

    let userContextStr = ""
    const { data: watchlists } = await supabase
      .from('watchlists')
      .select('movie_title')
      .eq('user_id', user.id)
      .limit(10)
    
    if (watchlists && watchlists.length > 0) {
      userContextStr = `For context, the user already likes these movies: ${watchlists.map((w: any) => w.movie_title).join(", ")}. Recommend similar movies but NOT these.`
    }

    const systemPrompt = `
      You are an elite movie recommendation expert. 
      The user mood: "${prompt}"
      ${userContextStr}

      Return ONLY a JSON array of 3 movies in this exact format:
      [
        {
          "title": "Movie Title",
          "arabic_title": "الاسم بالعربي",
          "year": "2024",
          "reason": "Cinematic explanation in Arabic"
        }
      ]
    `

    // Call Gemini using the library's specific structure
    const result = await (ai as any).models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
            { role: 'user', parts: [{ text: systemPrompt }] }
        ],
    });

    const response = await result;
    const aiText = response.text || "[]";
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
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&language=ar-SA&api_key=${process.env.TMDB_API_KEY}`
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
