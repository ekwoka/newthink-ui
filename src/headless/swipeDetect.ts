import type { ElementWithXAttributes, PluginCallback } from 'alpinejs';

type TouchPosition = {
  x: number;
  y: number;
};

type SwipableData = {
  start?: TouchPosition;

  dispatch: (dir: SwipeDirection) => void;
};
enum SwipeDirection {
  None = 0,
  Left = 1 << 0,
  Right = 1 << 1,
  Up = 1 << 2,
  Down = 1 << 3,
}

const swipableMap = new WeakMap<ElementWithXAttributes, SwipableData>();
const hasSwipe = swipableMap.has.bind(swipableMap);
export const swipeDetect: PluginCallback = (Alpine) =>
  Alpine.directive('swipe', (el, _, { cleanup }) => {
    const swipeData: SwipableData = {
      dispatch: (dir) => {
        const direction = Object.entries(SwipeDirection)
          .filter(([, v]) => typeof v === 'number' && v && (dir & v) === v)
          .map(([k]) => k.toLowerCase());
        el.dispatchEvent(
          new CustomEvent('swipe', {
            detail: direction.join('-'),
          }),
        );
        el.dispatchEvent(
          new CustomEvent(`swipe${direction.join('')}`, {
            detail: direction.join('-'),
          }),
        );
      },
    };
    swipableMap.set(el, swipeData);
    el.addEventListener('touchstart', touchDown);
    cleanup(() => el.removeEventListener('touchstart', touchDown));
  });

const touchDown = (ev: TouchEvent) => {
  const swipeData = swipableMap.get(ev.currentTarget as ElementWithXAttributes);
  if (!swipeData) return;
  const touch = ev.touches[0];
  const { clientX, clientY } = touch;
  swipeData.start ??= { x: clientX, y: clientY };
  document.addEventListener('touchend', touchUp, { once: true });
};

const touchUp = (ev: TouchEvent) => {
  const target = ev.target as ElementWithXAttributes;
  if (!target) return;
  const swipeData = swipableMap.get(
    findNearest(target, hasSwipe) as ElementWithXAttributes,
  );
  if (!swipeData?.start) return;
  const touch = ev.changedTouches[0];
  const { clientX, clientY } = touch;
  const direction = getDirection(swipeData.start, { x: clientX, y: clientY });
  if (direction === SwipeDirection.None) return;
  swipeData.dispatch(direction);
  delete swipeData.start;
};

const findNearest = <T extends HTMLElement>(
  el: T,
  predicate: (el: T) => boolean,
): HTMLElement | null => {
  if (predicate(el)) return el;
  if (!el.parentElement) return null;
  return findNearest(el.parentElement as T, predicate);
};

const getDirection = (start: TouchPosition, end: TouchPosition) => {
  const vector = [end.x - start.x, end.y - start.y];
  if (vector.every((v) => Math.abs(v) < 50)) return SwipeDirection.None;
  // normalize vector
  const magnitude = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  const [x, y] = vector.map((v) => v / magnitude);

  const direction = getDirectionSign(x) | (getDirectionSign(y) << 2);
  return direction;
};

const getDirectionSign = (offset: number) => {
  if (offset > 0.5) return 2;
  if (offset < -0.5) return 1;
  return 0;
};
