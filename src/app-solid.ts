import { createSignal, effect } from './solid';

//
// create a reactive state (using a signal)
//

const [count, setCount] = createSignal(0);
// const plusOne = () => count() + 1;

// attach button click handler
const button = document.getElementById('inc') as HTMLButtonElement;
button.addEventListener('click', () => {
  // increment the count
  setCount(count() + 1);
});

// response to changes
effect(() => {
  const countEl = document.getElementById('count') as HTMLInputElement;
  countEl.textContent = `count is ${count()}`;
});
