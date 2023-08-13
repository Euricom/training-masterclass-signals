import { reactive, createApp } from './vue/extended-runtime';

const appComponent = {
  template: `
    <h2 class="text-xl font-bold">Mini Vue</h2>
    <div :class="state.count % 2 ? 'text-red-400' : 'text-green-600'">
      count is: {{ state.count }}
    </div>
    <button @click="increment()" class="btn btn-primary">Inc</button>
  `,
  setup() {
    const state = reactive({
      count: 0,
    });
    return {
      state,
      increment() {
        console.log('increment', state.count);
        state.count++;
      },
    };
  },
};

const app = createApp(appComponent);
app.mount('#app');
