declare namespace JSX {
  interface IntrinsicElements {
    'adsgram-task': {
      'data-block-id': string;
      'data-debug'?: string | boolean;
      className?: string;
      ref?: React.RefObject<HTMLElement>;
      children?: React.ReactNode;
    }
  }
}

interface CustomEventMap {
  'reward': CustomEvent<string>;
  'onBannerNotFound': CustomEvent<void>;
}

interface AdsgramTaskElement extends HTMLElement {
  addEventListener<K extends keyof CustomEventMap>(
    type: K,
    listener: (this: AdsgramTaskElement, ev: CustomEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof CustomEventMap>(
    type: K,
    listener: (this: AdsgramTaskElement, ev: CustomEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
} 