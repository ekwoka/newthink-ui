import type { Alpine, PluginCallback } from 'alpinejs';
import type {
  DirectiveData,
  DirectiveUtilities,
  ElementWithXAttributes,
} from 'alpinejs';

export const headless = <T extends Record<string, unknown>>(
  name: string,
  rootHandler: RootHandler<T>,
  handlers?: HeadlessHandlers<T>,
): PluginCallback => {
  const headlessMap = new WeakMap<ElementWithXAttributes, T>();
  return (Alpine: Alpine) => {
    const getHeadlessComponentState = (
      el: ElementWithXAttributes,
    ): T | void => {
      const root = Alpine.findClosest(el, headlessMap.has.bind(headlessMap));
      if (!root)
        return console.error(`Could not find root for ${name} component`, el);
      if (root instanceof HTMLElement) return headlessMap.get(root);
    };

    Alpine.magic(name, (el) => getHeadlessComponentState(el));

    Alpine.directive(name, (el, directive, utils) => {
      if (!directive.value)
        return headlessMap.set(el, rootHandler(el, directive, utils));
      const headlessState = getHeadlessComponentState(el);
      if (!headlessState) return missingState(name, el);
      (handlers?.[directive.value] || failback(name))(
        headlessState,
        el,
        directive,
        utils,
      );
    });
  };
};

const failback =
  (name: string) =>
  (_: unknown, el: ElementWithXAttributes, directive: DirectiveData) => {
    console.error(
      `Alpine ${name}: Invalid directive value`,
      el,
      directive.original,
    );
  };

const missingState = (name: string, el: ElementWithXAttributes) =>
  console.error(`Could not find root for ${name} component`, el);

type HeadlessHandlers<T extends Record<string, unknown>> = Record<
  string,
  HeadlessHandler<T>
>;

export type RootHandler<T> = (
  el: ElementWithXAttributes,
  directive: DirectiveData,
  utilities: DirectiveUtilities,
) => T;

export type HeadlessHandler<T> = (
  state: T,
  el: ElementWithXAttributes,
  directive: DirectiveData,
  utilities: DirectiveUtilities,
) => void;
