<template>
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
          <label class="block text-sm font-medium text-gray-700" for="currency"
            >Валюта
          </label>
          <select v-model="currency" name="currency" id="currency">
            <option value="USD" selected>USD</option>
            <option value="RUB">RUB</option>
            <option value="KZT">KZT</option>
          </select>
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
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
      data-te-target="#exampleModal"
      type="button"
      class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      <!-- Heroicon name: solid/mail -->
      <add-icon />
      Добавить
    </button>
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
    "add-tiker": (value) => value.length > 0,
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
      this.$emit("click", this.tiker, this.currency, this.is_valid);
      this.$emit("keydown.enter", this.tiker, this.currency, this.is_valid);
      this.tiker = "";
    },
    async loadCoinList() {
      this.coins = await getCoins();
    },
  },
};
</script>
