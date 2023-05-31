<template>
  <!-- Modal -->
  <div
    v-if="isOpen"
    data-te-modal-init
    @click="close"
    class="fixed left-0 top-0 z-[1055] h-full w-full bg-[#252525AA] overflow-y-auto overflow-x-hidden outline-none"
    id="exampleModal"
    tabindex="-1"
    stye="display:block;"
  >
    <div
      @click.stop
      data-te-modal-dialog-ref
      class="pointer-events-none top-10 relative w-auto translate-y-[-50px] z-[1055] opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-12 min-[576px]:max-w-[500px]"
    >
      <div
        class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] z-[1060] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none"
      >
        <div
          class="flex flex-shrink-0 items-center z-[1060] justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"
        >
          <h5
            class="text-xl font-medium leading-normal text-neutral-800"
            id="exampleModalLabel"
          >
            <slot name="title">{{ title }}</slot>
          </h5>
          <button
            type="button"
            @click="close"
            class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
            data-te-modal-dismiss=""
            aria-label="Close"
          >
            <close-icon-wb />
          </button>
        </div>
        <div class="relative flex-auto p-4" data-te-modal-body-ref="">
          <slot name="body">{{ body }}</slot>
        </div>
        <div
          class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"
        >
          <button
            type="button"
            @click="close"
            class="inline-flex items-center rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
            data-te-modal-dismiss=""
            data-te-ripple-init=""
            data-te-ripple-color="light"
            style=""
          >
            Close &nbsp;
            <close-icon-wb />
          </button>
          <button
            v-if="confirmation"
            @click="confirm"
            type="button"
            class="ml-1 inline-flex items-center rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            Удалить &nbsp;
            <trash-icon />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIconWb from "@/components/icons/close-icon-wb";
import trashIcon from "@/components/icons/trashIcon.vue";

export default {
  name: "infoModal",
  components: { CloseIconWb, trashIcon },
  props: {
    message: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  modalController: null,
  data() {
    return {
      title: "",
      body: "",
      confirmation: false,
      isOpen: false,
    };
  },
  methods: {
    close() {
      this.$options.modalController.resolve(false);
      this.isOpen = false;
    },
    open(title, body, confired = false) {
      this.title = title;
      this.body = body;
      this.confirmation = confired;
      let resolve;
      let reject;
      const modalPromise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
      });
      this.$options.modalController = { resolve, reject };
      this.isOpen = true;
      return modalPromise;
    },
    confirm() {
      this.$options.modalController.resolve(true);
      this.isOpen = false;
    },
  },
};
</script>

<style scoped>
.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
