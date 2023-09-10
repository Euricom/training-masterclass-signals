import { ref, createApp, computed } from './vue';

const appComponent = {
  template: `
    <div :class="count.value % 2 ? 'text-red-400' : 'text-green-600'">
      count is: {{ count.value }}
    </div>
    <button @click="increment()" class="btn btn-primary">Inc</button>
  `,
  setup() {
    const count = ref(0);
    return {
      count,
      increment() {
        console.log('increment', count.value);
        count.value++;
      },
    };
  },
};

const app = createApp(appComponent);
app.mount('#app');
