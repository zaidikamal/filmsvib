import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMovieById, searchMovies } from "./tmdb";

const apiKey = process.env.GEMINI_API_KEY?.trim() || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function getAIRecommendations(userPreferences: {
    favoriteMovies: string[],
    recentRatings: { title: string, rating: number }[],
    genres: string[]
}) {
    if (!apiKey) return [];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are a high-end cinema expert. Based on the user's tastes below, suggest 5 movies they would LOVE.
        
        User Tastes:
        - Favorite Movies: ${userPreferences.favoriteMovies.join(", ")}
        - Recent Ratings: ${userPreferences.recentRatings.map(r => `${r.title} (${r.rating}/10)`).join(", ")}
        - Preferred Genres: ${userPreferences.genres.join(", ")}

        Return only a JSON array of objects with "title" and "reason" (short, catchy reason in Arabic).
        Example: [{"title": "Inception", "reason": "لأنك تحب الغموض والتعقيد الدرامي"}]
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the text to get valid JSON
        const jsonMatch = text.match(/\[.*\]/s);
        if (!jsonMatch) return [];
        
        const recommendations = JSON.parse(jsonMatch[0]);
        
        // Now, we need to find the TMDB data for these titles to display them
        const enrichedRecs = await Promise.all(
            recommendations.map(async (rec: any) => {
                const search = await searchMovies(rec.title);
                const movie = search?.results?.[0];
                if (movie) {
                    return { ...movie, ai_reason: rec.reason };
                }
                return null;
            })
        );

        return enrichedRecs.filter(Boolean);
    } catch (error) {
        console.error("AI Recommendations Error:", error);
        return [];
    }
}
