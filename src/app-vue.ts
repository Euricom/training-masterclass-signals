import { effect, computed, ref } from './vue';

//
// create a reactive state using a ref
//

const count = ref(0);

// attach button click handler
const button = document.getElementById('inc') as HTMLButtonElement;
button.addEventListener('click', () => {
  // increment the count
  count.value += 1;
});

// computed value
const plusOne = computed(() => count.value + 10);

// response to changes
effect(() => {
  const countEl = document.getElementById('count') as HTMLInputElement;
  countEl.textContent = `count is ${count.value} + 10 = ${plusOne()}`;
});
