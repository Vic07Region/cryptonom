<template>
  <section class="relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ coinData.nameCoin }} - {{ coinData.currencyCoin }}
    </h3>
    <div
      class="flex items-end border-gray-600 border-b border-l h-64"
      ref="graph"
    >
      <div
        v-for="(bar, idx) in normalizedGraph"
        :key="idx"
        :style="{ height: `${bar}%` }"
        class="bg-purple-800 border w-5"
        ref="bar"
      ></div>
    </div>
    <button @click="closeGraph" type="button" class="absolute top-0 right-0">
      <close-icon />
    </button>
  </section>
</template>

<script>
import CloseIcon from "@/components/icons/closeIcon";

export default {
  name: "TickerGraphic",
  components: { CloseIcon },
  props: {
    graphCoin: {
      type: Array,
      default: () => [],
    },
    coinData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      maxGraphLength: 1,
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.calculateMaxGraphLength();
    });
    this.$nextTick().then(this.calculateMaxGraphLength());
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphLength);
  },
  computed: {
    normalizedGraph() {
      const maxValue = Math.max(...this.$props.graphCoin);
      const minValue = Math.min(...this.$props.graphCoin);
      if (maxValue === minValue) {
        return this.$props.graphCoin.map(() => 50);
      }
      const minLengh =
        this.$props.graphCoin.length <= this.maxGraphLength
          ? 0
          : this.$props.graphCoin.length - this.maxGraphLength;
      const maxLengh = this.$props.graphCoin.length;
      return this.$props.graphCoin
        .map(
          (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue) + 0
        )
        .slice(minLengh, maxLengh);
    },
  },
  methods: {
    closeGraph() {
      this.$emit("closeGraphic");
    },
    calculateMaxGraphLength() {
      if (!this.$refs.graph) {
        return;
      }
      const barWidth =
        this.$props.graphCoin.length < 0
          ? this.$refs.bar[this.$refs.bar.length - 1].clientWidth
          : 18;
      this.maxGraphLength = Math.floor(this.$refs.graph.clientWidth / barWidth);
    },
  },
};
</script>
