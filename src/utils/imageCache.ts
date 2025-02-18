const IMAGE_CACHE_KEY = 'box-images-cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 saat

export const cacheImage = async (url: string): Promise<string> => {
  try {
    const cache = localStorage.getItem(IMAGE_CACHE_KEY);
    const cacheData = cache ? JSON.parse(cache) : {};

    // Cache'de varsa ve süresi geçmediyse
    if (cacheData[url] && Date.now() - cacheData[url].timestamp < CACHE_EXPIRY) {
      return cacheData[url].data;
    }

    // Yeni resmi al ve cache'le
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        cacheData[url] = {
          data: base64data,
          timestamp: Date.now()
        };
        localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cacheData));
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Image caching failed:', error);
    return url; // Hata durumunda orijinal URL'i döndür
  }
};

export const getCachedImage = (url: string): string | null => {
  try {
    const cache = localStorage.getItem(IMAGE_CACHE_KEY);
    if (!cache) return null;

    const cacheData = JSON.parse(cache);
    if (cacheData[url] && Date.now() - cacheData[url].timestamp < CACHE_EXPIRY) {
      return cacheData[url].data;
    }
    return null;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
}; 