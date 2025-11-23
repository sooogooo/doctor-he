/**
 * Privacy-friendly analytics utility
 * - No personal data collection
 * - Respects Do Not Track
 * - Local storage only by default
 * - Can be configured for external services
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: number;
}

interface AnalyticsConfig {
  enabled: boolean;
  respectDNT: boolean;
  storageKey: string;
  maxEvents: number;
  onEvent?: (event: AnalyticsEvent) => void;
}

const defaultConfig: AnalyticsConfig = {
  enabled: true,
  respectDNT: true,
  storageKey: 'aura_analytics',
  maxEvents: 100,
};

class Analytics {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.sessionId = this.generateSessionId();
    this.loadEvents();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch {
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      // Keep only the most recent events
      if (this.events.length > this.config.maxEvents) {
        this.events = this.events.slice(-this.config.maxEvents);
      }
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.events));
    } catch {
      // Storage full or unavailable
    }
  }

  private shouldTrack(): boolean {
    if (!this.config.enabled) return false;

    // Respect Do Not Track setting
    if (this.config.respectDNT && navigator.doNotTrack === '1') {
      return false;
    }

    return true;
  }

  /**
   * Track an event
   */
  track(name: string, properties?: Record<string, string | number | boolean>): void {
    if (!this.shouldTrack()) return;

    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        sessionId: this.sessionId,
      },
      timestamp: Date.now(),
    };

    this.events.push(event);
    this.saveEvents();

    // Call external handler if configured
    if (this.config.onEvent) {
      this.config.onEvent(event);
    }
  }

  /**
   * Track page view
   */
  pageView(pageName: string): void {
    this.track('page_view', { page: pageName });
  }

  /**
   * Track user action
   */
  action(actionName: string, details?: Record<string, string | number | boolean>): void {
    this.track('user_action', { action: actionName, ...details });
  }

  /**
   * Track error
   */
  error(errorType: string, message: string): void {
    this.track('error', { type: errorType, message });
  }

  /**
   * Track timing (e.g., API response time)
   */
  timing(name: string, durationMs: number): void {
    this.track('timing', { name, duration: durationMs });
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Get event count by name
   */
  getEventCount(name: string): number {
    return this.events.filter((e) => e.name === name).length;
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
    localStorage.removeItem(this.config.storageKey);
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Get summary statistics
   */
  getSummary(): Record<string, number> {
    const summary: Record<string, number> = {};
    for (const event of this.events) {
      summary[event.name] = (summary[event.name] || 0) + 1;
    }
    return summary;
  }
}

// Default analytics instance
export const analytics = new Analytics();

// Pre-defined event names
export const AnalyticsEvents = {
  // Page views
  PAGE_HOME: 'page_home',
  PAGE_CHAT: 'page_chat',
  PAGE_SETTINGS: 'page_settings',

  // User actions
  UPLOAD_IMAGE: 'upload_image',
  TAKE_PHOTO: 'take_photo',
  START_ANALYSIS: 'start_analysis',
  EXPORT_REPORT: 'export_report',
  SEND_MESSAGE: 'send_message',
  CHANGE_THEME: 'change_theme',
  CHANGE_FONT_SIZE: 'change_font_size',

  // Results
  ANALYSIS_COMPLETE: 'analysis_complete',
  ANALYSIS_ERROR: 'analysis_error',

  // Performance
  API_RESPONSE_TIME: 'api_response_time',
} as const;

export { Analytics, type AnalyticsEvent, type AnalyticsConfig };
