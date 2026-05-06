import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing!")
}

const genAI = new GoogleGenerativeAI(apiKey || "")

export const geminiFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Generate a cinematic summary for an article
 */
export async function generateArticleSummary(content: string): Promise<string> {
  if (!apiKey || !content) return content.slice(0, 160)

  try {
    const prompt = `
      قم بتلخيص هذا المقال السينمائي بأسلوب مشوق واحترافي لجذب القراء. 
      اجعل الملخص في حدود 150 إلى 180 حرفاً كحد أقصى. 
      ركز على الجوهر السينمائي للمقال.
      المحتوى:
      "${content.slice(0, 2000)}"
    `
    const result = await geminiFlash.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    return text || content.slice(0, 160)
  } catch (error) {
    console.error("AI Summary generation failed:", error)
    return content.slice(0, 160)
  }
}

/**
 * Analyze a movie based on its title and context
 */
export async function analyzeMovie(movieTitle: string): Promise<string> {
   if (!apiKey) return "الخدمة غير متوفرة"

   try {
     const prompt = `
       أنت خبير سينمائي عالمي. قم بتحليل فيلم "${movieTitle}" بشكل عميق وموجز.
       اذكر:
       1. القيمة الفنية للفيلم.
       2. الرسالة الخفية وراء القصة.
       3. لماذا يجب على عشاق السينما مشاهدته؟
       اجعل الرد باللغة العربية وبأسلوب فخم جداً.
     `
     const result = await geminiFlash.generateContent(prompt)
     const response = await result.response
     return response.text().trim()
   } catch (error) {
     console.error("Movie analysis failed:", error)
     return "فشل تحليل الفيلم حالياً."
   }
}

/**
 * Deep character analysis for a movie
 */
export async function analyzeCharacters(movieTitle: string): Promise<string> {
    if (!apiKey) return "الخدمة غير متوفرة"
    try {
      const prompt = `أنت محلل شخصيات سينمائي. قم بتحليل أهم الشخصيات في فيلم "${movieTitle}" ودوافعهم النفسية وتأثيرهم على القصة. اجعل الأسلوب فخماً وباللغة العربية.`
      const result = await geminiFlash.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      return "فشل تحليل الشخصيات حالياً."
    }
}

/**
 * Recommend similar movies based on a movie title
 */
export async function getSimilarMovieRecs(movieTitle: string): Promise<string> {
    if (!apiKey) return "الخدمة غير متوفرة"
    try {
      const prompt = `بناءً على فيلم "${movieTitle}"، اقترح 3 أفلام مشابهة جداً في الروح أو القصة. اذكر اسم الفيلم ولماذا اخترته لهذا المستخدم بأسلوب مشوق وبالعربية.`
      const result = await geminiFlash.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      return "فشل جلب الاقتراحات حالياً."
    }
}

import { getCachedAIResponse, setCachedAIResponse } from "./ai-cache"

/**
 * Full AI Content Engine with Trust Metrics and Caching
 */
export async function generateFullMovieArticle(movieTitle: string): Promise<{
    title: string,
    excerpt: string,
    content: string,
    confidenceScore: number
}> {
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing")

    const cacheKey = `article_${movieTitle.toLowerCase().replace(/\s+/g, '_')}`
    const cached = await getCachedAIResponse(cacheKey)
    if (cached) return cached

    try {
        // Phase 1: Generation
        const prompt = `
            أنت رئيس نقد سينمائي في منصة "Filmsvib". اكتب مقالاً نقدياً فاخراً عن فيلم "${movieTitle}".
            المتطلبات: عنوان، ملخص قصير، ومحتوى Markdown مفصل (تحليل، نقد، توصية).
            الأسلوب: فلسفي، عميق، لغة عربية رصينة.
            Return as JSON: {"title": "...", "excerpt": "...", "content": "..."}
        `
        const result = await geminiFlash.generateContent(prompt)
        const rawResponse = await result.response
        const text = rawResponse.text().trim()
        const jsonMatch = text.match(/\{.*\}/s)
        if (!jsonMatch) throw new Error("Invalid AI output")
        const initialDraft = JSON.parse(jsonMatch[0])

        // Phase 2: Trust & Quality Check (Self-Correction)
        const verificationPrompt = `
            بصفتك مدقق حقائق سينمائي، راجع هذا المحتوى عن فيلم "${movieTitle}":
            "${initialDraft.content.substring(0, 500)}..."
            قيم مدى دقة المعلومات ومصداقيتها من 0 إلى 1.
            تأكد من عدم وجود هلوسة (معلومات خاطئة عن المخرج أو الأبطال).
            Return ONLY a number between 0 and 1.
        `
        const vResult = await geminiFlash.generateContent(verificationPrompt)
        const score = parseFloat((await vResult.response).text().trim()) || 0.85

        const finalData = {
            ...initialDraft,
            confidenceScore: score
        }

        await setCachedAIResponse(cacheKey, finalData)
        return finalData
    } catch (error) {
        console.error("AI Trust Pipeline failed:", error)
        return {
            title: `مراجعة فيلم ${movieTitle}`,
            excerpt: "تغطية نقدية في Filmsvib.",
            content: "فشل النظام الذكي في توليد المحتوى بدقة كافية.",
            confidenceScore: 0
        }
    }
}
