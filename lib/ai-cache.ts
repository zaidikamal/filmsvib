import { createClient } from "@/utils/supabase/server";

export async function getCachedAIResponse(key: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("ai_cache")
        .select("response_json")
        .eq("cache_key", key)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();
    
    return data?.response_json;
}

export async function setCachedAIResponse(key: string, response: any, ttlSeconds: number = 86400) {
    const supabase = await createClient();
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    
    await supabase.from("ai_cache").upsert({
        provider: "gemini",
        cache_key: key,
        response_json: response,
        expires_at: expiresAt
    }, { onConflict: "cache_key" });
}
