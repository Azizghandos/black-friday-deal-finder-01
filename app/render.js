// HTML for every page, built from the deal data. Every value that comes from
// the data is escaped before it reaches the page. No page fetches anything:
// the deals are already in the browser, in deals.js.

import { discountOf, savedOf, verdictLabel } from "./filters.js";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

export function money(amount) {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function checkedLine(iso) {
  const when = new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  return `${when} UTC, 27 Nov 2026`;
}

/** One deal as a card in the list. The whole card is a link to its page. */
export function dealCard(deal) {
  const off = discountOf(deal);
  const saved = savedOf(deal);
  return `<article class="card verdict-${escapeHtml(deal.verdict)}">
  <a class="card-link" href="#/deal/${encodeURIComponent(deal.id)}" aria-label="${escapeHtml(deal.name)}">
    <div class="card-top">
      <span class="chip">${escapeHtml(deal.category)}</span>
      <span class="off-badge">${off}% off</span>
    </div>
    <h3 class="card-name">${escapeHtml(deal.name)}</h3>
    <p class="card-store">${escapeHtml(deal.store)}</p>
    <p class="card-prices"><span class="price">${money(deal.price)}</span>
      <s class="was">${money(deal.was)}</s>
      <span class="saved">save ${money(saved)}</span></p>
    <p class="card-verdict"><span class="verdict-dot"></span>${verdictLabel(deal.verdict)}</p>
    <p class="card-checked">Checked ${checkedLine(deal.checked)}</p>
  </a>
  <a class="store-button" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View at ${escapeHtml(deal.store)} &rarr;</a>
</article>`;
}

function emptyList() {
  return `<p class="empty">No deal matches those filters. Try clearing the search or lowering the minimum discount.</p>`;
}

export function dealList(deals) {
  if (deals.length === 0) return emptyList();
  return `<div class="grid">${deals.map(dealCard).join("")}</div>`;
}

/** The toolbar above the list: search, category, store, discount, sort. */
export function toolbar(categories, stores, filters, total) {
  const option = (value, current, label) =>
    `<option value="${escapeHtml(value)}"${value === current ? " selected" : ""}>${escapeHtml(label)}</option>`;
  return `<section class="toolbar" aria-label="Find a deal">
  <label class="search-box">Search deals
    <input id="search" type="search" placeholder="Try &ldquo;AirPods&rdquo;, &ldquo;LEGO&rdquo; or &ldquo;vacuum&rdquo;" value="${escapeHtml(filters.query)}">
  </label>
  <label>Category
    <select id="category">${option("All", filters.category, "All categories")}${categories
      .map((c) => option(c, filters.category, c))
      .join("")}</select>
  </label>
  <label>Store
    <select id="store">${option("All", filters.store, "All stores")}${stores
      .map((s) => option(s, filters.store, s))
      .join("")}</select>
  </label>
  <label>Discount
    <select id="discount">
      ${option("0", String(filters.minDiscount), "Any discount")}
      ${option("25", String(filters.minDiscount), "25% off or more")}
      ${option("40", String(filters.minDiscount), "40% off or more")}
      ${option("50", String(filters.minDiscount), "50% off or more")}
    </select>
  </label>
  <label>Sort by
    <select id="sort">
      ${option("best", filters.sort, "Best deals first")}
      ${option("discount", filters.sort, "Biggest discount")}
      ${option("saving", filters.sort, "Biggest saving")}
      ${option("price-low", filters.sort, "Lowest price")}
      ${option("price-high", filters.sort, "Highest price")}
    </select>
  </label>
  <p class="count" id="count">${total} deal${total === 1 ? "" : "s"} shown</p>
</section>`;
}

/** One deal on its own page, with the full check record. */
export function dealPage(deal) {
  const off = discountOf(deal);
  const saved = savedOf(deal);
  const alsoAt =
    deal.alsoAt && deal.alsoAt.length > 0
      ? `<section class="compare"><h2>Same product, another store</h2><ul>${deal.alsoAt
          .map(
            (other) =>
              `<li>${escapeHtml(other.store)} &mdash; <strong>${money(other.price)}</strong>
                <a href="${escapeHtml(other.url)}" target="_blank" rel="noopener">Check at ${escapeHtml(other.store)}</a></li>`,
          )
          .join("")}</ul></section>`
      : "";
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail verdict-${escapeHtml(deal.verdict)}">
  <div class="detail-top">
    <span class="chip">${escapeHtml(deal.category)}</span>
    <span class="off-badge big">${off}% off</span>
  </div>
  <h1>${escapeHtml(deal.name)}</h1>
  <p class="detail-store">Sold by <strong>${escapeHtml(deal.store)}</strong></p>
  <p class="detail-prices"><span class="price big">${money(deal.price)}</span>
    <s class="was">${money(deal.was)}</s>
    <span class="saved">You save ${money(saved)} (${off}%)</span></p>
  <p class="detail-verdict"><span class="verdict-dot"></span><strong>${verdictLabel(deal.verdict)}.</strong>
    ${escapeHtml(deal.evidence)}</p>
  <dl class="facts">
    <dt>Price checked</dt><dd>${checkedLine(deal.checked)}</dd>
    <dt>Price read in</dt><dd>${escapeHtml(deal.source)}</dd>
    <dt>Usual price</dt><dd>${money(deal.was)} as listed beside the sale price</dd>
  </dl>
  <p><a class="store-button big" href="${escapeHtml(deal.url)}" target="_blank" rel="noopener">View this deal at ${escapeHtml(deal.store)} &rarr;</a></p>
  ${alsoAt}
</article>`;
}

export function notFound() {
  return `<h1>Deal not found</h1>
<p>There is no deal at this address. <a href="#/">See all the deals</a>.</p>`;
}

/** How every price on this site was checked. Linked from the footer. */
export function methodPage() {
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="method">
<h1>How we check a deal</h1>
<p>Every price on this site was read on <strong>27 November 2026</strong>, Black Friday itself,
from the store named on the deal or from a deals source that names that store. The check time
and the source are printed on every deal, so any shopper can re-check it.</p>
<h2>What the verdict means</h2>
<ul>
  <li><strong>True low</strong> &mdash; the lowest price the sources report for this product,
  usually 50% off or more, or a best-ever price.</li>
  <li><strong>Strong price</strong> &mdash; a big cut worth acting on: a large discount or a
  large cash saving on a current model.</li>
  <li><strong>Routine sale</strong> &mdash; a real discount, but a small one, or a small saving
  on a cheap item. Still a deal, just not a doorbuster.</li>
</ul>
<h2>What we do not do</h2>
<ul>
  <li>No price is guessed, carried over from an earlier sale, or copied from a roundup
  published before this Black Friday.</li>
  <li>No deal is listed without a store link that opens the product at that store.</li>
  <li>The discount on every card is the arithmetic of the two prices shown:
  (usual &minus; sale) &divide; usual.</li>
</ul>
<p>Prices move all day on Black Friday and items sell out. Always confirm the price at
checkout before you buy.</p>
</article>`;
}
