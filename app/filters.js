// Filtering and sorting for the deal list. Pure functions over the deal data:
// nothing here touches the page, so the list view can be tested on its own.

export function discountOf(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savedOf(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

export function verdictLabel(verdict) {
  if (verdict === "true-low") return "True low";
  if (verdict === "strong") return "Strong price";
  return "Routine sale";
}

export function verdictRank(verdict) {
  if (verdict === "true-low") return 0;
  if (verdict === "strong") return 1;
  return 2;
}

/** The blank filter state: everything shown, best deals first. */
export function blankFilters() {
  return { query: "", category: "All", store: "All", minDiscount: 0, sort: "best" };
}

/** Keep the deals that match every active filter. */
export function applyFilters(deals, filters) {
  const q = filters.query.trim().toLowerCase();
  return deals.filter((deal) => {
    if (filters.category !== "All" && deal.category !== filters.category) return false;
    if (filters.store !== "All" && deal.store !== filters.store) return false;
    if (discountOf(deal) < filters.minDiscount) return false;
    if (q !== "") {
      const haystack = `${deal.name} ${deal.store} ${deal.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Order the deals for display. "best" puts true lows first, then the
 *  biggest discounts, then the biggest cash savings. */
export function applySort(deals, sort) {
  const sorted = [...deals];
  if (sort === "discount") {
    sorted.sort((a, b) => discountOf(b) - discountOf(a) || savedOf(b) - savedOf(a));
  } else if (sort === "price-low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sort === "saving") {
    sorted.sort((a, b) => savedOf(b) - savedOf(a));
  } else {
    sorted.sort(
      (a, b) =>
        verdictRank(a.verdict) - verdictRank(b.verdict) ||
        discountOf(b) - discountOf(a) ||
        savedOf(b) - savedOf(a),
    );
  }
  return sorted;
}
