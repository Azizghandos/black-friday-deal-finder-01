// The deal finder itself: hash routes, the live list, and the toolbar wiring.
//
//   #/                 the deal list, with search and filters
//   #/deal/<id>        one deal, with its full check record
//   #/how-we-check     how every price was verified
//
// The list re-renders as the shopper types or changes a filter, without
// reloading anything: the deals are already in the browser, in deals.js.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, DEALS, STORES } from "./deals.js";
import { applyFilters, applySort, blankFilters } from "./filters.js";
import { dealList, dealPage, methodPage, notFound, toolbar } from "./render.js";

const app = document.getElementById("app");
const filters = blankFilters();

function renderList() {
  const shown = applySort(applyFilters(DEALS, filters), filters.sort);
  app.innerHTML = toolbar(CATEGORIES, STORES, filters, shown.length) + dealList(shown);

  const search = document.getElementById("search");
  const category = document.getElementById("category");
  const store = document.getElementById("store");
  const discount = document.getElementById("discount");
  const sort = document.getElementById("sort");
  const results = app.querySelector(".grid, .empty");

  const refresh = () => {
    const next = applySort(applyFilters(DEALS, filters), filters.sort);
    const count = document.getElementById("count");
    if (count) count.textContent = `${next.length} deal${next.length === 1 ? "" : "s"} shown`;
    const holder = app.querySelector(".grid, .empty");
    if (holder) holder.outerHTML = dealList(next);
  };

  search.addEventListener("input", () => {
    filters.query = search.value;
    refresh();
  });
  category.addEventListener("change", () => {
    filters.category = category.value;
    refresh();
  });
  store.addEventListener("change", () => {
    filters.store = store.value;
    refresh();
  });
  discount.addEventListener("change", () => {
    filters.minDiscount = Number(discount.value);
    refresh();
  });
  sort.addEventListener("change", () => {
    filters.sort = sort.value;
    refresh();
  });
  return results;
}

function render() {
  window.__shotReady = false;
  const hash = location.hash;
  if (hash === "#/how-we-check") {
    document.title = "How we check a deal | Black Friday Deal Board";
    app.innerHTML = methodPage();
  } else {
    const match = hash.match(/^#\/deal\/([^/?]+)/);
    if (match) {
      const found = DEALS.find((deal) => deal.id === decodeURIComponent(match[1]));
      document.title = `${found ? found.name : "Deal not found"} | Black Friday Deal Board`;
      app.innerHTML = found ? dealPage(found) : notFound();
    } else {
      document.title = "Black Friday Deal Board — real deals, checked today";
      renderList();
    }
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
