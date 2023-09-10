import { effect } from '../reactivity';

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
          effect(() => {
            childNode.className = evaluateExpression(value, state);
          });
        }
      }
      // recursively render this element's children
      render(childNode, state);
    } else if (node.nodeType === 3 /* TEXT */) {
      const textNode = node as Node as CharacterData;
      const raw = textNode.data;
      const regex = /{{(.*?)}}/g;

      // replace {{...}} with the value of the expression
      if (regex.test(raw)) {
        regex.lastIndex = 0;
        const segments = [];
        let match;
        let index = 0;
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
        effect(() => {
          textNode.data = evaluateExpression(exp, state);
        });
      }
    }
  }
}
