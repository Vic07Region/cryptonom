<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <div
          class="mt-1 relative rounded-md shadow-md inline-flex items-center"
        >
          <div class="flex bg-white p-1 rounded-md shadow-md flex-wrap">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <input
              v-model="tiker"
              @keydown.enter="addKeydown"
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
            />
            <div class="flex bg-white p-1 rounded-md flex-block">
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
            <div
              class="w-[100%] bg-white p-1 rounded-md inline-flex items-center justify-between"
            >
              <div class="inline-flex items-center">
                <label
                  class="block text-sm font-medium text-gray-700"
                  for="currency"
                  >Валюта &nbsp;
                </label>
                <select v-model="currency" name="currency" id="currency">
                  <option value="USD">USD</option>
                  <option value="RUB" selected="selected">RUB</option>
                  <option value="KZT">KZT</option>
                </select>
              </div>
              <button
                @click="add"
                data-te-target="#exampleModal"
                type="button"
                class="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <!-- Heroicon name: solid/mail -->
                <add-icon />
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getCoins } from "@/API";
import AddIcon from "@/components/icons/addIcon";

export default {
  name: "addTiker",
  components: { AddIcon },
  props: {
    tickerslist: {
      type: Array,
      default: () => [],
    },
  },
  emits: {
    "add-click": null,
    "keydown.enter": null,
  },
  data() {
    return {
      tiker: "",
      currency: "USD",
      coins: [],
    };
  },
  mounted() {
    this.loadCoinList();
  },
  computed: {
    is_valid() {
      return (
        JSON.parse(JSON.stringify(this.tickerslist)).filter(
          (t) =>
            t.name === this.tiker.toUpperCase() && t.currency === this.currency
        ).length !== 0
      );
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
  },
  methods: {
    add() {
      this.$emit("add-click", this.tiker, this.currency, this.is_valid);
      this.tiker = "";
    },
    addKeydown() {
      this.$emit("keydown.enter", this.tiker, this.currency, this.is_valid);
      this.tiker = "";
    },
    async loadCoinList() {
      this.coins = await getCoins();
    },
  },
};
</script>
