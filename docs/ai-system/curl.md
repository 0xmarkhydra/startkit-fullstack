curl 'https://app.pretgemarket.xyz/api/v1/tokens/xpl' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9,vi;q=0.8' \
  -b '_ga=GA1.1.1333888023.1754452778; _ga_XTX5GLNV1H=GS2.1.s1754464635$o2$g0$t1754464635$j60$l0$h0; _ga_3YMNX7KXRX=GS2.1.s1758457102$o1$g0$t1758457238$j60$l0$h0; _ga_0D3EX5J8SD=GS2.1.s1758537724$o5$g1$t1758537779$j5$l0$h0' \
  -H 'priority: u=1, i' \
  -H 'referer: https://app.pretgemarket.xyz/token/xpl' \
  -H 'sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'


  => {
    "data": {
        "id": "9f775e47-e0b1-42d0-a75a-8d675b5b3210",
        "name": "Plasma",
        "symbol": "XPL",
        "logo": "https://pbs.twimg.com/profile_images/1945482443886051328/-JVSkrV7_400x400.jpg",
        "token_contract": null,
        "network_id": "110e8400-e29b-41d4-a716-446655440001",
        "start_time": null,
        "end_time": null,
        "status": "active",
        "created_at": "2025-09-12T02:47:09.321281+00:00",
        "updated_at": "2025-09-17T11:34:53.256428+00:00",
        "price": 0.61,
        "website_url": "https://www.plasma.to/",
        "twitter_url": "https://x.com/PlasmaFDN",
        "telegram_url": "",
        "banner_url": "https://zipline-production-4111.up.railway.app/u/k8WiNb.jpg",
        "networks": {
            "id": "110e8400-e29b-41d4-a716-446655440001",
            "logo": "https://i.ibb.co/BPzpZDn/ethereum-logo-png-seeklogo-527153.png",
            "name": "Ethereum",
            "rpc_url": "https://neat-sly-pool.quiknode.pro/ef32395ed175b3af243014d8ac143b272b950c87/",
            "chain_id": "1",
            "chain_type": "evm",
            "created_at": "2025-07-17T18:55:24.009095+00:00",
            "address_url": "https://etherscan.io/address/address_string",
            "tx_hash_url": "https://etherscan.io/tx/tx_hash_string",
            "explorer_url": "https://etherscan.io"
        }
    },
    "success": true
}


curl 'https://web3-radar-crawler-v1-production.up.railway.app/api/projects/get-by-symbol' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.7' \
  -H 'content-type: application/json' \
  -H 'origin: https://app.pretgemarket.xyz' \
  -H 'priority: u=1, i' \
  -H 'referer: https://app.pretgemarket.xyz/' \
  -H 'sec-ch-ua: "Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' \
  --data-raw '{"symbol":"XPL"}'

=> {
    "success": true,
    "data": {
        "projectId": "cmfnu0tkt0007jj04xq8p8w2n",
        "projectSymbol": "XPL",
        "data": {
            "web3Project": {
                "name": "Plasma (Pre-Market)",
                "symbol": "XPL",
                "description": "Plasma is a high-throughput execution environment for Bitcoin that enables 1,000 transactions per second while inheriting Bitcoin's security. With Plasma, developers can build on Bitcoin without limits. ",
                "website": "https://www.plasma.to/?utm_source=dropstab",
                "category": "Layer1",
                "chain": "Other",
                "launchStatus": "Mainnet",
                "isPublished": true,
                "isDeleted": false,
                "createdById": "cmfnsqox40000cbz72rqf2d17",
                "updatedById": "system-user-dropstab-crawler"
            },
            "socials": {
                "twitter": "https://twitter.com/PlasmaFDN",
                "discord": "https://discord.com/invite/plasmafdn",
                "telegram": null,
                "medium": null,
                "github": null
            },
            "fundraising": {
                "totalRaised": 74000000,
                "notableInvestors": [
                    "Cobie",
                    "Framework Ventures",
                    "6MV (6th Man Ventures)",
                    "Founders Fund",
                    "Manifold Trading",
                    "Bitfinex",
                    "Paolo Ardoino",
                    "Zaheer",
                    "Bybit",
                    "DRW Venture Capital",
                    "Flow Traders",
                    "IMC Financial Markets",
                    "Laser Digital",
                    "Guy Young",
                    "Peter Thiel",
                    "Anthos Capital",
                    "Karatage",
                    "Christian Angermayer"
                ],
                "fundingRounds": [
                    {
                        "roundName": "Public Sale",
                        "date": "2025-07-17T12:00:00.000Z",
                        "amount": 50000000,
                        "investors": [],
                        "tokenPrice": 0.05
                    },
                    {
                        "roundName": "Funding Round",
                        "date": "2025-02-13T00:00:00.000Z",
                        "amount": 20500000,
                        "investors": [
                            "Zaheer",
                            "6MV (6th Man Ventures)",
                            "Bybit",
                            "Cobie",
                            "DRW Venture Capital",
                            "Flow Traders",
                            "IMC Financial Markets",
                            "Laser Digital",
                            "Guy Young",
                            "Framework Ventures",
                            "Peter Thiel",
                            "Bitfinex",
                            "Paolo Ardoino"
                        ],
                        "tokenPrice": null
                    },
                    {
                        "roundName": "Funding Round",
                        "date": "2024-10-18T00:00:00.000Z",
                        "amount": 3500000,
                        "investors": [
                            "Paolo Ardoino",
                            "Bitfinex",
                            "Anthos Capital",
                            "Karatage",
                            "Manifold Trading",
                            "Zaheer",
                            "Christian Angermayer"
                        ],
                        "tokenPrice": null
                    }
                ]
            },
            "tokenomic": {
                "tokenName": "Plasma (Pre-Market)",
                "tokenSymbol": "XPL",
                "tokenType": "Utility",
                "totalSupply": 10000000000,
                "circulatingSupply": 1800000000,
                "tokenContract": null,
                "allocations": []
            },
            "exchanges": [
                {
                    "exchangeName": "Binance Futures",
                    "exchangeSlug": "binance-futures",
                    "tradingPairName": "XPLUSDT",
                    "tradingPairUrl": "https://www.binance.com/en/futures/XPLUSDT",
                    "price": 0.7186,
                    "vol24h": 120125209.0972487,
                    "logoUrl": "https://static.images.dropstab.com/images/exchanges/binance_futures.svg"
                },
                {
                    "exchangeName": "OKX Futures",
                    "exchangeSlug": "okx-futures",
                    "tradingPairName": "XPL-USDT-SWAP",
                    "tradingPairUrl": "https://www.okx.com/trade-swap/XPL-USDT-SWAP",
                    "price": 0.7152,
                    "vol24h": 49774846.6125356,
                    "logoUrl": "https://static.images.dropstab.com/images/exchanges/okex_swap.svg"
                },
                {
                    "exchangeName": "Hyperliquid (Futures)",
                    "exchangeSlug": "hyperliquid-(futures)",
                    "tradingPairName": "XPL-USD",
                    "tradingPairUrl": "https://hyperliquid.xyz/",
                    "price": 0.74,
                    "vol24h": 42655432.77023999,
                    "logoUrl": "https://static.images.dropstab.com/images/exchanges/hyperliquid.png"
                },
                {
                    "exchangeName": "Bitunix Futures",
                    "exchangeSlug": "bitunix-futures",
                    "tradingPairName": "XPL_USDT",
                    "tradingPairUrl": "https://bitunix.com",
                    "price": 0.72,
                    "vol24h": 5169489.234829207,
                    "logoUrl": "https://static.images.dropstab.com/images/exchanges/bitunix_futures.png"
                },
                {
                    "exchangeName": "MEXC Futures",
                    "exchangeSlug": "mexc-futures",
                    "tradingPairName": "XPL_USDT",
                    "tradingPairUrl": "http://mexc.com/futures/XPL_USDT",
                    "price": 0.71,
                    "vol24h": 2938643.949249591,
                    "logoUrl": "https://static.images.dropstab.com/images/exchanges/mxc_futures.svg"
                },
                {
                    "exchangeName": "Gate.io Futures",
                    "exchangeSlug": "gate.io-futures",
                    "tradingPairName": "XPL_USDT",
                    "tradingPairUrl": "https://www.gate.com/futures/USDT/XPL_USDT",
                    "price": 0.75,
                    "vol24h": 2068232.872038621,
                    "logoUrl": "https://static.images.dropstab.com/images/exchanges/gate_futures.svg"
                }
            ],
            "activities": [
                {
                    "title": "Plasma (Pre-Market)",
                    "url": "https://app.galxe.com/quest/plasma?sort=Trending",
                    "description": "Plasma is committed to expanding the impact of stablecoins. In this quest, you’ll take an initial tour of the Collective, discover how to join and learn how to earn higher roles.",
                    "startDate": "2025-03-10T00:00:00.000Z",
                    "endDate": null,
                    "ecosystem": "Blockchain",
                    "totalFundsRaised": 74000000,
                    "metadata": {
                        "score": "0",
                        "status": "active",
                        "activityType": "launch",
                        "tags": []
                    }
                }
            ],
            "investors": [
                {
                    "name": "Cobie",
                    "type": "Angel Investor",
                    "tier": "Tier1",
                    "star": "Three",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/cobie_logo_1740107237.webp",
                    "links": []
                },
                {
                    "name": "Framework Ventures",
                    "type": "Ventures Capital",
                    "tier": "Tier1",
                    "star": "Three",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/framework-ventures_logo_1740107849.webp",
                    "links": []
                },
                {
                    "name": "6MV (6th Man Ventures)",
                    "type": "Ventures Capital",
                    "tier": "Tier2",
                    "star": "Two",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/6th-man-ventures_logo_1740107270.webp",
                    "links": []
                },
                {
                    "name": "Founders Fund",
                    "type": "Ventures Capital",
                    "tier": "Tier2",
                    "star": "Two",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/founders-fund_logo_1740107891.webp",
                    "links": []
                },
                {
                    "name": "Manifold Trading",
                    "type": "Ventures Capital",
                    "tier": "Tier2",
                    "star": "Two",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/manifold-trading_logo_1740107516.webp",
                    "links": []
                },
                {
                    "name": "Bitfinex",
                    "type": "Exchange",
                    "tier": "Tier3",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/bitfinex_logo_1740108059.webp",
                    "links": []
                },
                {
                    "name": "Paolo Ardoino",
                    "type": "Angel Investor",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/paolo-ardoino_logo_1740107328.webp",
                    "links": []
                },
                {
                    "name": "Zaheer",
                    "type": "Angel Investor",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/zaheer_logo_1740108667.webp",
                    "links": []
                },
                {
                    "name": "Bybit",
                    "type": "Unknown",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/bybit_logo_1740107013.webp",
                    "links": []
                },
                {
                    "name": "DRW Venture Capital",
                    "type": "Ventures Capital",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/drw-venture-capital_logo_1740107578.webp",
                    "links": []
                },
                {
                    "name": "Flow Traders",
                    "type": "Ventures Capital",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/flow-traders_logo_1740107896.webp",
                    "links": []
                },
                {
                    "name": "IMC Financial Markets",
                    "type": "Ventures Capital",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/imc-financial-markets_logo_1740109139.webp",
                    "links": []
                },
                {
                    "name": "Laser Digital",
                    "type": "Ventures Capital",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/laser-digital_logo_1740107811.webp",
                    "links": []
                },
                {
                    "name": "Guy Young",
                    "type": "Angel Investor",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/guy-young_logo_1740108756.webp",
                    "links": []
                },
                {
                    "name": "Peter Thiel",
                    "type": "Angel Investor",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/peter-thiel_logo_1740107631.webp",
                    "links": []
                },
                {
                    "name": "Anthos Capital",
                    "type": "Ventures Capital",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/anthos-capital_logo_1740107143.webp",
                    "links": []
                },
                {
                    "name": "Karatage",
                    "type": "Unknown",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/karatage_logo_1740108511.webp",
                    "links": []
                },
                {
                    "name": "Christian Angermayer",
                    "type": "Angel Investor",
                    "tier": "NotRated",
                    "star": "One",
                    "logoUrl": "https://dropsearn.fra1.cdn.digitaloceanspaces.com/media/vc/logos/christian-angermayer_logo_1740107236.webp",
                    "links": []
                }
            ],
            "performance": [
                {
                    "baseAsset": "USD",
                    "h1": -3.573347662547011,
                    "h24": -4.535177550206148,
                    "d7": 10.84002470660903,
                    "mo1": null,
                    "mo3": null,
                    "y1": null
                },
                {
                    "baseAsset": "BTC",
                    "h1": -3.221157582870959,
                    "h24": -1.666892880414417,
                    "d7": 13.50686112859811,
                    "mo1": null,
                    "mo3": null,
                    "y1": null
                },
                {
                    "baseAsset": "ETH",
                    "h1": -2.785690755577963,
                    "h24": 2.349927108090233,
                    "d7": 20.44212616904417,
                    "mo1": null,
                    "mo3": null,
                    "y1": null
                }
            ],
            "priceData": {
                "price": 0.7171,
                "change_1h": -3.573347662547011,
                "change_24h": -4.535177550206148,
                "volume_24h": 223964709.1437398,
                "market_cap": 1290780000,
                "recorded_at": "2025-09-22T10:00:05.036Z"
            },
            "communityMetrics": {
                "twitterFollowers": 16204,
                "discordMembers": null,
                "telegramMembers": null,
                "githubStars": null
            },
            "tgeInfo": {
                "tgeDate": "2025-09-25T00:00:00.000Z",
                "tgeExchange": null,
                "initialMarketcap": 1290780000
            },
            "preMarketPricing": [
                {
                    "platform": "DropsTab",
                    "lastPrice": 0.7171,
                    "totalVol": 223964709.1437398,
                    "vol24h": 223964709.1437398,
                    "change24h": -4.535177550206148
                }
            ]
        },
        "metadata": {
            "source": "database",
            "crawledAt": "2025-09-22T10:43:00.469Z",
            "originalUrl": "https://www.plasma.to/?utm_source=dropstab",
            "symbol": "XPL",
            "cached": true
        }
    }
}