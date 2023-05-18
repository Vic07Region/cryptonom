<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="tiker"
                @keydown.enter="add"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
              />
              <label
                class="block text-sm font-medium text-gray-700"
                for="currency"
                >Валюта
              </label>
              <select v-model="currency" name="currency" id="currency">
                <option value="USD" selected>USD</option>
                <option value="RUB">RUB</option>
                <option value="KZT">KZT</option>
              </select>
            </div>
            <div
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                v-for="inline in coinFilter"
                :key="inline.Symbol"
                @click="tiker = inline.Symbol"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                {{ inline.Symbol }}
              </span>
            </div>
            <div v-if="is_valid" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </div>
          </div>
        </div>
        <button
          @click="add"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>
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
              'bg-white': t.price != '-',
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
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <section v-if="sel" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ sel.name }} - {{ sel.currency }}
        </h3>
        <div
          class="flex items-end border-gray-600 border-b border-l h-64"
          ref="graph"
        >
          <div
            v-for="(bar, idx) in normalizedGraph"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click="sel = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { getCoins, subscribeToTicker, unsubscribeFromTicker } from "@/API";

export default {
  name: "App",
  data() {
    return {
      tiker: "",
      tikers: [],
      sel: null,
      graph: [],
      currency: "USD",
      coins: [],
      page: 1,
      filter: "",
      maxGraphLength: 1,
    };
  },
  mounted() {
    this.loadCoinList();
    window.addEventListener("resize", () => {
      this.calculateMaxGraphLength();
    });
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphLength);
  },
  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    const VALID_KEYS = ["filter", "page"];
    Object.assign(this, _.pick(windowData, VALID_KEYS));
    //
    //допустимо
    // VALID_KEYS.forEach((key) => {
    //   if (windowData[key]) {
    //     this[key] = windowData[key];
    //   }
    // });
    //допустимо но не эстетично
    // if (windowData.filter) {
    //   this.filter = windowData.filter;
    // }
    // if (windowData.page) {
    //   this.page = Number(windowData.page);
    //   console.log(windowData.page);
    // }
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
  computed: {
    is_valid() {
      const valid =
        this.tikers.filter(
          (t) =>
            t.name === this.tiker.toUpperCase() && t.currency === this.currency
        ).length !== 0;
      return valid;
    },
    coinFilter() {
      return this.coins
        .filter((t) =>
          Object.keys(t).some((key) =>
            t[key].toUpperCase().includes(this.tiker.toUpperCase())
          )
        )
        .slice(0, 4);
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
    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      }
      const minLengh =
        this.graph.length < Number(this.maxGraphLength)
          ? 0
          : this.graph.length - Number(this.maxGraphLength);
      const maxLengh = this.graph.length + Number(this.maxGraphLength);

      return this.graph
        .map(
          (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue) + 0
        )
        .slice(minLengh, maxLengh);
    },
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  methods: {
    calculateMaxGraphLength() {
      if (!this.$refs.graph) {
        return;
      }
      this.maxGraphLength = this.$refs.graph.clientWidth / 39;
    },
    updateTicker(tickerName, price, currency) {
      const filtered = this.tikers.filter(
        (t) => t.currency === currency && t.name === tickerName
      );
      filtered.forEach((t) => {
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
    // async updateTikers() {
    //   if (!this.tikers.length) {
    //     return;
    //   }
    //
    //   const exchangeData = await loadTikers(this.tikers.map((t) => t.name));
    //   this.tikers.forEach((tiker) => {
    //     const price =
    //       exchangeData[tiker.name.toUpperCase()][tiker.currency.toUpperCase()];
    //     tiker.price = price ?? "-";
    //   });
    //   if (this.sel) {
    //     this.graph.push(this.sel.price);
    //   }
    // },
    add() {
      const currTiker = {
        name: this.tiker.toUpperCase(),
        price: "-",
        currency: this.currency,
      };
      if (!this.is_valid && this.tiker !== "") {
        this.tikers = [...this.tikers, currTiker];
        subscribeToTicker(
          currTiker.name,
          (newPrice, currency) =>
            this.updateTicker(currTiker.name, newPrice, currency),
          currTiker.currency
        );

        this.tiker = "";
      } else {
        alert("Ошибка заполнения");
      }
    },
    tdelete(tik) {
      this.tikers = this.tikers.filter((t) => t != tik);
      unsubscribeFromTicker(tik, tik.currency);
      if (this.sel === tik) {
        this.sel = null;
        //test
      }
    },
    select(tiker) {
      this.sel = tiker;
    },

    async loadCoinList() {
      this.coins = await getCoins();
    },
  },
  watch: {
    tikers() {
      localStorage.setItem("crypto-list", JSON.stringify(this.tikers));
    },
    sel() {
      this.graph = [];
      setTimeout(() => {
        this.calculateMaxGraphLength();
      }, 0);
    },
    paginatedTiker() {
      if (this.paginatedTiker.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    filter() {
      this.page = 1;
      if (this.filter == "") {
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
