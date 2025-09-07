const audioCache = new Map();

export const fetchAudio = async (text: string | undefined, apiUrl: string) => {
  if (!text) return null;

  // Create a unique cache key based on the text and apiUrl
  const cacheKey = `${apiUrl}_${text.substring(0, 9)}`;

  // Check if the response is in the cache
  if (audioCache.has(cacheKey)) {
    console.log("Cache hit");
    return audioCache.get(cacheKey);
  }
  console.log("Cache miss");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: text,
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const blob = await response.blob();
      audioCache.set(cacheKey, blob);
      return blob;
    }
  } catch (error) {
    return error;
  }
};
