// In a separate file or at the top of FootballGameWidget.tsx
declare global {
  interface Window {
    APIWidget: any; // You can replace 'any' with a more specific type if available
  }
}

export {};
