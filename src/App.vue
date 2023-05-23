<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <Add-Ticker @add-tiker="add" :tickerslist="gettikersList" />
      <template v-if="tikers.length">
        <label class="block text-sm font-medium text-gray-700" for="filters">
          фильтр
        </label>
        <input
          id="filters"
          type="text"
          v-model="filter"
          placeholder="Например DOGE"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        />
        <section class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <button
            @click="page = page - 1"
            :disabled="page < 2"
            :class="
              page < 2
                ? 'inline-block rounded border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-800 transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-800 focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 dark:border-neutral-900 dark:text-neutral-900 dark:hover:border-neutral-900 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10 dark:hover:text-neutral-900 dark:focus:border-neutral-900 dark:focus:text-neutral-900 dark:active:border-neutral-900 dark:active:text-neutral-900'
                : 'inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_#332d2d] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#171717] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(27,27,27,0.3),0_4px_18px_0_rgba(27,27,27,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(27,27,27,0.3),0_4px_18px_0_rgba(27,27,27,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(27,27,27,0.3),0_4px_18px_0_rgba(27,27,27,0.2)]'
            "
            class=""
          >
            <i v-if="page > 1"> &lt;&lt; </i> Назад
          </button>
          <span
            class="inline-flex justify-center items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            страница {{ page }}
          </span>
          <button
            @click="page = page + 1"
            :disabled="!hasNpage"
            :class="
              !hasNpage
                ? 'inline-block rounded border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-800 transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-800 focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 dark:border-neutral-900 dark:text-neutral-900 dark:hover:border-neutral-900 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10 dark:hover:text-neutral-900 dark:focus:border-neutral-900 dark:focus:text-neutral-900 dark:active:border-neutral-900 dark:active:text-neutral-900'
                : 'inline-block rounded bg-neutral-800 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_#332d2d] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.3),0_4px_18px_0_rgba(51,45,45,0.2)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#171717] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(27,27,27,0.3),0_4px_18px_0_rgba(27,27,27,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(27,27,27,0.3),0_4px_18px_0_rgba(27,27,27,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(27,27,27,0.3),0_4px_18px_0_rgba(27,27,27,0.2)]'
            "
          >
            Вперед
            <i v-if="hasNpage">>></i>
          </button>
        </section>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTiker"
            :key="t.name"
            @click="select(t)"
            :class="{
              'border-4': sel === t,
              'bg-red-100': t.price === '-',
              'bg-white': t.price !== '-',
            }"
            class="overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - {{ t.currency }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="tdelete(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <trash-icon />
              Удалить.
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <Ticker-Graphic
        v-if="sel"
        :coinData="getCoinData"
        :graphCoin="getGraphData"
        @closeGraphic="sel = null"
      />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { subscribeToTicker, unsubscribeFromTicker } from "@/API";
import TrashIcon from "@/components/icons/trashIcon";
import AddTicker from "@/components/AddTicker";
import TickerGraphic from "@/components/TickerGraphic";

export default {
  name: "App",
  components: { TickerGraphic, TrashIcon, AddTicker },

  data() {
    return {
      tikers: [],
      sel: null,
      graph: [],
      page: 1,
      filter: "",
    };
  },
  mounted() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    const VALID_KEYS = ["filter", "page"];
    Object.assign(this, _.pick(windowData, VALID_KEYS));
    const tickersData = localStorage.getItem("crypto-list");
    if (tickersData) {
      this.tikers = JSON.parse(tickersData);
      this.tikers.forEach((ticker) => {
        subscribeToTicker(
          ticker.name,
          (newPrice, currency) =>
            this.updateTicker(ticker.name, newPrice, currency),
          ticker.currency
        );
      });
    }
  },
  // created() {
  //   //
  //   //допустимо
  //   // VALID_KEYS.forEach((key) => {
  //   //   if (windowData[key]) {
  //   //     this[key] = windowData[key];
  //   //   }
  //   // });
  //   //допустимо но не эстетично
  //   // if (windowData.filter) {
  //   //   this.filter = windowData.filter;
  //   // }
  //   // if (windowData.page) {
  //   //   this.page = Number(windowData.page);
  //   //   console.log(windowData.page);
  //   // }
  // },
  computed: {
    gettikersList() {
      return this.tikers;
    },
    getCoinData() {
      if (this.sel) {
        return { nameCoin: this.sel.name, currencyCoin: this.sel.currency };
      }
      return { nameCoin: "", currencyCoin: "" };
    },
    getGraphData() {
      return this.graph;
    },
    startIndex() {
      return (this.page - 1) * 6;
    },
    endIndex() {
      return this.page * 6;
    },
    filtredTikers() {
      return this.tikers.filter((tiker) =>
        tiker.name.includes(this.filter.toUpperCase())
      );
    },
    paginatedTiker() {
      return this.filtredTikers.slice(this.startIndex, this.endIndex);
    },
    hasNpage() {
      return this.filtredTikers.length > this.endIndex;
    },
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  methods: {
    updateTicker(tickerName, price, currency) {
      this.tikers
        .filter((t) => t.currency === currency && t.name === tickerName)
        .forEach((t) => {
          t.price = price;
          if (t === this.sel && !this.graph.find((el) => el === price)) {
            this.graph.push(price);
          }
        });
    },
    formatPrice(price) {
      if (price === "-") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },
    add(ticker, currencys, is_valid) {
      const currTiker = {
        name: ticker.toUpperCase(),
        price: "-",
        currency: currencys,
      };
      if (!is_valid && ticker !== "") {
        this.tikers = [...this.tikers, currTiker];
        subscribeToTicker(
          currTiker.name,
          (newPrice, currency) =>
            this.updateTicker(currTiker.name, newPrice, currency),
          currTiker.currency
        );
      } else {
        alert("Ошибка заполнения!");
      }
    },
    tdelete(tik) {
      this.tikers = this.tikers.filter((t) => t !== tik);
      unsubscribeFromTicker(tik, tik.currency);
      if (this.sel === tik) {
        this.sel = null;
      }
    },
    select(tiker) {
      this.sel = tiker;
    },
  },
  watch: {
    tikers() {
      localStorage.setItem("crypto-list", JSON.stringify(this.tikers));
    },
    sel() {
      this.graph = [];
    },
    paginatedTiker() {
      if (this.paginatedTiker.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    filter() {
      this.page = 1;
      if (this.filter === "") {
        window.history.pushState(
          null,
          document.title,
          `${window.location.pathname}`
        );
      }
    },
    pageStateOptions(val) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${val.filter}&page=${val.page}`
      );
    },
  },
};
</script>
