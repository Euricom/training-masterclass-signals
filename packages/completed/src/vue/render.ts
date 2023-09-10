/* eslint-disable @typescript-eslint/no-loop-func */

import { createEffect } from '../reactivity';

export type Component = {
  template: string;
  setup: () => Record<string, unknown>;
};

function evaluateExpression(exp: string, state: Record<string, unknown>) {
  const args = [...Object.keys(state), `return ${exp}`];
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(...args);
  return fn(...Object.values(state));
}

export function render(root: Element, state: Record<string, unknown>) {
  for (const node of root.childNodes) {
    const childNode = node as Element;
    if (childNode.nodeType === 1 /* ELEMENT */) {
      for (const { name, value } of childNode.attributes) {
        if (name === '@click') {
          node.addEventListener('click', () => {
            // run script for button click
            evaluateExpression(value, state);
          });
        } else if (name === ':class') {
          // register state changes
          createEffect(() => {
            childNode.className = evaluateExpression(value, state);
          });
        }
      }
      // recursively walk this element's children
      render(childNode, state);
    } else if (node.nodeType === 3 /* TEXT */) {
      const textNode = node as Node as CharacterData;
      const raw = textNode.data;
      const regex = /{{(.*?)}}/g;
      if (regex.test(raw)) {
        regex.lastIndex = 0;
        const segments = [];
        let match;
        let index = 0;
        // eslint-disable-next-line no-cond-assign
        while ((match = regex.exec(raw))) {
          if (match.index > index) {
            segments.push(`"${raw.slice(index, match.index)}"`);
          }
          segments.push(match[1]);
          index = match.index + match[0].length;
        }
        let exp = segments.join(' + ');
        exp = exp.replace(/(\r\n|\n|\r)/gm, ''); // remove new lines

        // register state changes
        createEffect(() => {
          textNode.data = evaluateExpression(exp, state);
        });
      }
    }
  }
}

export function createApp(appComponent: Component) {
  return {
    mount(selector: string) {
      // get state
      const state = appComponent.setup();

      // take the template string and set innerHTML
      const root = document.querySelector(selector);
      if (!root) {
        throw new Error(`No element found for selector: ${selector}`);
      }
      root.innerHTML = appComponent.template;

      // walk the resulting DOM tree and look
      // for directives or bindings like
      // `@click` and `{{ }}`
      render(root, state);
    },
  };
}
