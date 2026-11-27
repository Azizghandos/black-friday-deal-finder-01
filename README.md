# Black Friday Deal Board

[![make.fun bounty](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Azizghandos/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Azizghandos/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A Black Friday deal finder for shoppers: **30 real deals, each price read at its store on 27 November 2026**, Black Friday itself, with the sale price, the usual price, the discount, an honest verdict on whether it is really a deal, and a link to the product at that store.

## What it does

- **30 verified deals** across Audio, Computing, TVs, Gaming, Home, Kitchen, Toys, Fashion and Beauty — from Amazon, Walmart, Best Buy, Target, Newegg and B&H Photo.
- **Search and filters that work**: free-text search, plus filters by category, store and minimum discount, and sorting by best deal, biggest discount, biggest saving, or price.
- **A "really a deal?" verdict on every deal** — *True low*, *Strong price* or *Routine sale* — with the evidence behind it, so an inflated was-price cannot hide.
- **A full check record on every deal page**: when the price was read, where it was read, and the same product at another store when a source showed it there.
- **How we check**: a methodology page (`#/how-we-check`) explains the verdicts and what the site refuses to list.
- **Works offline from static files**: no network requests, no framework, system fonts only. Opens in desktop Chrome and on a phone.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

## Sources

Every deal names its source on its own page. Prices were read on 27 November 2026 from TradingView / Benzinga's Black Friday tech deals report, DealNews' verified Walmart deals, Dan's Deals' Walmart Black Friday coverage, Target's Black Friday listing and announcement, Best Buy's Black Friday announcement, and the Daily Fox News Amazon Black Friday roundup — each naming the store that sells the product.
