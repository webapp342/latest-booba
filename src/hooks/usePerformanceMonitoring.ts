import { useEffect } from 'react';

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Performance Observer oluştur
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Transfer boyutunu ve süresini izle
        if (entry.entryType === 'resource') {
          console.log(`Resource: ${entry.name}`);
          console.log(`Transfer size: ${(entry as PerformanceResourceTiming).transferSize}`);
          console.log(`Duration: ${entry.duration}`);
          
          // Vercel Analytics'e gönder (isteğe bağlı)
          if ((window as any).va) {
            (window as any).va.track('resource_loaded', {
              name: entry.name,
              transferSize: (entry as PerformanceResourceTiming).transferSize,
              duration: entry.duration
            });
          }
        }
      });
    });

    // Performance metriklerini izle
    observer.observe({ 
      entryTypes: ['resource', 'navigation', 'largest-contentful-paint'] 
    });

    return () => observer.disconnect();
  }, []);
}; 