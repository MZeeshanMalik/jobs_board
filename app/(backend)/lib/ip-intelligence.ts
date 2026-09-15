/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/ip-intelligence.ts
import axios from "axios";

export interface IPIntelligenceData {
  ip: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  cityName: string;
  zipCode: string | null;
  timeZone: string;
  latitude: number;
  longitude: number;
  isProxy: boolean;
  isVpn: boolean;
  isTor: boolean;
  isDataCenter: boolean;
}

export interface IPIntelligenceResult {
  success: boolean;
  data: IPIntelligenceData | null;
  riskScore: number;
  error?: string;
}

class IPIntelligenceService {
  private readonly baseUrl = "https://free.freeipapi.com/api/json";
  private readonly rateLimit: number = 60; // requests per minute
  private requestTimestamps: number[] = [];
  private cache: Map<string, { data: IPIntelligenceData; timestamp: number }> =
    new Map();
  private readonly cacheTTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Check if we're within rate limits
   */
  private canMakeRequest(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;

    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => timestamp > oneMinuteAgo,
    );

    return this.requestTimestamps.length < this.rateLimit;
  }

  /**
   * Get cached IP data if available and fresh
   */
  private getFromCache(ip: string): IPIntelligenceData | null {
    const cached = this.cache.get(ip);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTTL) {
      this.cache.delete(ip);
      return null;
    }

    return cached.data;
  }

  /**
   * Store IP data in cache
   */
  private storeInCache(ip: string, data: IPIntelligenceData): void {
    this.cache.set(ip, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Fetch IP intelligence data
   */
  public async getIPIntelligence(ip: string): Promise<IPIntelligenceResult> {
    // Validate IP
    if (!ip || ip === "unknown") {
      return {
        success: false,
        data: null,
        riskScore: 0,
        error: "Invalid IP address",
      };
    }

    // Check cache first
    const cachedData = this.getFromCache(ip);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
        riskScore: this.calculateRiskScore(cachedData),
      };
    }

    // Check rate limit
    if (!this.canMakeRequest()) {
      return {
        success: false,
        data: null,
        riskScore: 0,
        error: "Rate limit exceeded. Please try again later.",
      };
    }

    try {
      // Make the request
      this.requestTimestamps.push(Date.now());

      const response = await axios.get(`${this.baseUrl}/${ip}`, {
        timeout: 5000,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 200 && response.data) {
        const data = this.normalizeResponse(response.data);
        this.storeInCache(ip, data);

        return {
          success: true,
          data,
          riskScore: this.calculateRiskScore(data),
        };
      }

      return {
        success: false,
        data: null,
        riskScore: 0,
        error: `API returned status ${response.status}`,
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          return {
            success: false,
            data: null,
            riskScore: 0,
            error: "Rate limit exceeded. Please try again later.",
          };
        }
        if (error.code === "ECONNABORTED") {
          return {
            success: false,
            data: null,
            riskScore: 0,
            error: "Request timed out. Please try again.",
          };
        }
        return {
          success: false,
          data: null,
          riskScore: 0,
          error: `Network error: ${error.message}`,
        };
      }

      return {
        success: false,
        data: null,
        riskScore: 0,
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * Normalize API response to our interface
   */
  private normalizeResponse(raw: any): IPIntelligenceData {
    return {
      ip: raw.ip || "unknown",
      countryCode: raw.countryCode || "",
      countryName: raw.countryName || "",
      regionName: raw.regionName || "",
      cityName: raw.cityName || "",
      zipCode: raw.zipCode || null,
      timeZone: raw.timeZone || "",
      latitude: raw.latitude || 0,
      longitude: raw.longitude || 0,
      isProxy: raw.isProxy || false,
      isVpn: raw.isVpn || false,
      isTor: raw.isTor || false,
      isDataCenter: raw.isDataCenter || false,
    };
  }

  /**
   * Calculate risk score based on IP intelligence
   */
  private calculateRiskScore(data: IPIntelligenceData): number {
    let riskScore = 0;

    // VPN/Proxy detection (highest weight)
    if (data.isVpn) riskScore += 40;
    if (data.isProxy) riskScore += 30;
    if (data.isTor) riskScore += 50;
    if (data.isDataCenter) riskScore += 20;

    // Geography-based risk (adds up to 10%)
    const highRiskCountries = ["CN", "RU", "KP", "IR", "SY", "VE"];
    const mediumRiskCountries = ["IN", "PK", "BD", "NG", "VN"];

    if (highRiskCountries.includes(data.countryCode)) {
      riskScore += 10;
    } else if (mediumRiskCountries.includes(data.countryCode)) {
      riskScore += 5;
    }

    // Cap at 100
    return Math.min(riskScore, 100);
  }

  /**
   * Get risk level description
   */
  public getRiskLevel(score: number): {
    level: string;
    color: string;
    description: string;
  } {
    if (score >= 70) {
      return {
        level: "High",
        color: "red",
        description:
          "Multiple risk indicators detected. Recommend manual review.",
      };
    }
    if (score >= 40) {
      return {
        level: "Medium",
        color: "yellow",
        description:
          "Some risk indicators present. Consider additional verification.",
      };
    }
    if (score >= 20) {
      return {
        level: "Low",
        color: "green",
        description: "Minor risk indicators. Standard monitoring recommended.",
      };
    }
    return {
      level: "Minimal",
      color: "green",
      description: "No significant risk indicators detected.",
    };
  }

  /**
   * Clear cache (useful for testing)
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const ipIntelligence = new IPIntelligenceService();
