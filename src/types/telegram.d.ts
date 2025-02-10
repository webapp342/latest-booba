interface TelegramWebApp {
  openLink: (url: string) => void;
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  showInvoice: (params: {
    title: string;
    description: string;
    payload: string;
    currency: string;
    prices: Array<{
      label: string;
      amount: number;
    }>;
  }) => Promise<{
    status: 'paid' | 'failed' | 'cancelled';
    payload?: string;
  }>;
  initDataUnsafe?: {
    user?: {
      language_code?: string;
      id?: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    start_param?: string;
  };
  switchInlineQuery: (query: string, targets?: Array<'users' | 'groups' | 'channels'>) => void;
  // Add other WebApp methods as needed
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export {}; 