import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';

export interface PretgeTokenData {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  token_contract?: string;
  network_id: string;
  status: string;
  price: number;
  website_url: string;
  twitter_url: string;
  telegram_url: string;
  banner_url: string;
  networks: {
    id: string;
    logo: string;
    name: string;
    rpc_url: string;
    chain_id: string;
    chain_type: string;
    explorer_url: string;
  };
}

export interface PretgeProjectData {
  projectId: string;
  projectSymbol: string;
  data: {
    web3Project: {
      name: string;
      symbol: string;
      description: string;
      website: string;
      category: string;
      chain: string;
      launchStatus: string;
    };
    socials: {
      twitter: string;
      discord?: string;
      telegram?: string;
      medium?: string;
      github?: string;
    };
    fundraising: {
      totalRaised: number;
      notableInvestors: string[];
      fundingRounds: Array<{
        roundName: string;
        date: string;
        amount: number;
        investors: string[];
        tokenPrice?: number;
      }>;
    };
    tokenomic: {
      tokenName: string;
      tokenSymbol: string;
      tokenType: string;
      totalSupply: number;
      circulatingSupply: number;
      tokenContract?: string;
    };
    exchanges: Array<{
      exchangeName: string;
      exchangeSlug: string;
      tradingPairName: string;
      tradingPairUrl: string;
      price: number;
      vol24h: number;
      logoUrl: string;
    }>;
    priceData: {
      price: number;
      change_1h: number;
      change_24h: number;
      volume_24h: number;
      market_cap: number;
      recorded_at: string;
    };
    communityMetrics: {
      twitterFollowers: number;
      discordMembers?: number;
      telegramMembers?: number;
      githubStars?: number;
    };
    investors: Array<{
      name: string;
      type: string;
      tier: string;
      star: string;
      logoUrl: string;
    }>;
  };
}

@Injectable()
export class PretgeApiService {
  private readonly logger = new Logger(PretgeApiService.name);
  private readonly pretgeBaseUrl = 'https://app.pretgemarket.xyz/api/v1';
  private readonly crawlerBaseUrl = 'https://web3-radar-crawler-v1-production.up.railway.app/api';

  constructor(private readonly configService: ConfigService) {}

  async getTokenData(tokenSlug: string): Promise<PretgeTokenData | null> {
    this.logger.log(`[🔍] [PretgeApiService] [getTokenData] [tokenSlug]:`, tokenSlug);

    try {
      const response = await axios.get(`${this.pretgeBaseUrl}/tokens/${tokenSlug}`, {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        },
        timeout: 10000,
      });

      if (response.data.success && response.data.data) {
        this.logger.log(`[✅] [PretgeApiService] [getTokenData] [result]:`, {
          name: response.data.data.name,
          symbol: response.data.data.symbol,
          price: response.data.data.price,
        });
        return response.data.data;
      }

      return null;
    } catch (error) {
      this.logger.error(`[🔴] [PretgeApiService] [getTokenData] [error]:`, error);
      
      if (error instanceof AxiosError) {
        this.logger.error(`[🔴] [PretgeApiService] [getTokenData] [axios_error]:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      
      return null;
    }
  }

  async getProjectData(tokenSymbol: string): Promise<PretgeProjectData | null> {
    this.logger.log(`[🔍] [PretgeApiService] [getProjectData] [tokenSymbol]:`, tokenSymbol);

    try {
      const response = await axios.post(
        `${this.crawlerBaseUrl}/projects/get-by-symbol`,
        { symbol: tokenSymbol },
        {
          headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.7',
            'content-type': 'application/json',
            'origin': 'https://app.pretgemarket.xyz',
            'referer': 'https://app.pretgemarket.xyz/',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          },
          timeout: 15000,
        }
      );

      if (response.data.success && response.data.data) {
        this.logger.log(`[✅] [PretgeApiService] [getProjectData] [result]:`, {
          projectId: response.data.data.projectId,
          projectSymbol: response.data.data.projectSymbol,
          totalRaised: response.data.data.data.fundraising.totalRaised,
          price: response.data.data.data.priceData.price,
        });
        return response.data.data;
      }

      return null;
    } catch (error) {
      this.logger.error(`[🔴] [PretgeApiService] [getProjectData] [error]:`, error);
      
      if (error instanceof AxiosError) {
        this.logger.error(`[🔴] [PretgeApiService] [getProjectData] [axios_error]:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      
      return null;
    }
  }

  async getTokenInfo(tokenSlug: string): Promise<{
    tokenData: PretgeTokenData | null;
    projectData: PretgeProjectData | null;
  }> {
    this.logger.log(`[🔍] [PretgeApiService] [getTokenInfo] [tokenSlug]:`, tokenSlug);

    try {
      // Call both APIs in parallel
      const [tokenData, projectData] = await Promise.all([
        this.getTokenData(tokenSlug),
        this.getProjectData(tokenSlug.toUpperCase()),
      ]);

      this.logger.log(`[✅] [PretgeApiService] [getTokenInfo] [result]:`, {
        hasTokenData: !!tokenData,
        hasProjectData: !!projectData,
      });

      return { tokenData, projectData };
    } catch (error) {
      this.logger.error(`[🔴] [PretgeApiService] [getTokenInfo] [error]:`, error);
      return { tokenData: null, projectData: null };
    }
  }

  formatTokenInfoForPrompt(tokenData: PretgeTokenData | null, projectData: PretgeProjectData | null): string {
    if (!tokenData && !projectData) {
      return 'No specific token information available.';
    }

    let info = '';

    if (tokenData) {
      info += `**Token Information:**\n`;
      info += `- Name: ${tokenData.name} (${tokenData.symbol})\n`;
      info += `- Current Price: $${tokenData.price}\n`;
      info += `- Network: ${tokenData.networks.name}\n`;
      info += `- Status: ${tokenData.status}\n`;
      if (tokenData.website_url) info += `- Website: ${tokenData.website_url}\n`;
      if (tokenData.twitter_url) info += `- Twitter: ${tokenData.twitter_url}\n`;
    }

    if (projectData) {
      const data = projectData.data;
      
      if (data.web3Project) {
        info += `\n**Project Details:**\n`;
        info += `- Description: ${data.web3Project.description}\n`;
        info += `- Category: ${data.web3Project.category}\n`;
        info += `- Launch Status: ${data.web3Project.launchStatus}\n`;
        info += `- Chain: ${data.web3Project.chain}\n`;
      }

      if (data.fundraising) {
        info += `\n**Funding Information:**\n`;
        info += `- Total Raised: $${data.fundraising.totalRaised.toLocaleString()}\n`;
        info += `- Notable Investors: ${data.fundraising.notableInvestors.slice(0, 5).join(', ')}\n`;
      }

      if (data.tokenomic) {
        info += `\n**Tokenomics:**\n`;
        info += `- Total Supply: ${data.tokenomic.totalSupply.toLocaleString()}\n`;
        info += `- Circulating Supply: ${data.tokenomic.circulatingSupply.toLocaleString()}\n`;
        info += `- Token Type: ${data.tokenomic.tokenType}\n`;
      }

      if (data.priceData) {
        info += `\n**Price Data:**\n`;
        info += `- Current Price: $${data.priceData.price}\n`;
        info += `- 24h Change: ${data.priceData.change_24h.toFixed(2)}%\n`;
        info += `- 24h Volume: $${data.priceData.volume_24h.toLocaleString()}\n`;
        info += `- Market Cap: $${data.priceData.market_cap.toLocaleString()}\n`;
      }

      if (data.communityMetrics) {
        info += `\n**Community Metrics:**\n`;
        if (data.communityMetrics.twitterFollowers) {
          info += `- Twitter Followers: ${data.communityMetrics.twitterFollowers.toLocaleString()}\n`;
        }
        if (data.communityMetrics.discordMembers) {
          info += `- Discord Members: ${data.communityMetrics.discordMembers.toLocaleString()}\n`;
        }
      }

      if (data.exchanges && data.exchanges.length > 0) {
        info += `\n**Available Exchanges:**\n`;
        data.exchanges.slice(0, 3).forEach(exchange => {
          info += `- ${exchange.exchangeName}: $${exchange.price} (24h Vol: $${exchange.vol24h.toLocaleString()})\n`;
        });
      }
    }

    return info;
  }
}
