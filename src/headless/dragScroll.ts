import Alpine, { PluginCallback } from 'alpinejs';

const resizeCenterer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const el = entry.target;
    if (!(el instanceof HTMLElement)) continue;
    center(el);
  }
});

const center = async (el: HTMLElement) => {
  await Alpine.nextTick();
  el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
};

const forEach = Array.prototype.forEach;

export const dragScroll: PluginCallback = (Alpine) =>
  Alpine.directive('dragscroll', (el, { modifiers }, { cleanup }) => {
    const autoCenter = modifiers.includes('center');
    cleanup(registerDragScroll(el));
    el.classList.add('overscroll-contain', 'cursor-grab');
    if (!autoCenter) return;
    forEach.call(el.children, (el: Element) => resizeCenterer.observe(el));
    cleanup(() =>
      forEach.call(el.children, (el: Element) => resizeCenterer.unobserve(el)),
    );
  });

const preventStop = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const cancelEvents = ['pointerup', 'mouseup', 'touchend'] as const;

const registerDragScroll = (el: HTMLElement) => {
  const moveHandler = (e: PointerEvent) => {
    preventStop(e);
    el.scrollLeft -= e.movementX;
    el.scrollTop -= e.movementY;
  };
  const upHandler = async (e: PointerEvent | MouseEvent | TouchEvent) => {
    preventStop(e);
    document.removeEventListener('pointermove', moveHandler, true);
    document.body.classList.remove(
      '!cursor-grabbing',
      '[&>*]:pointer-events-none',
    );
    el.classList.add('cursor-grab');
    await Alpine.nextTick();
    document.removeEventListener('click', preventStop, true);
    cancelEvents.forEach((event) =>
      document.removeEventListener(event, upHandler, {
        capture: true,
      }),
    );
  };
  const downHandler = (e: PointerEvent | MouseEvent | TouchEvent) => {
    if (isTouch(e)) return; // skip touch inputs (allow native scrolling)
    if (e.button === 2) return; // skip right-click
    preventStop(e);
    el.classList.remove('cursor-grab');
    document.body.classList.add(
      '!cursor-grabbing',
      '[&>*]:pointer-events-none',
    );
    document.addEventListener('pointermove', moveHandler, { capture: true });
    cancelEvents.forEach((event) =>
      document.addEventListener(event, upHandler, {
        capture: true,
      }),
    );
    document.addEventListener('click', preventStop, { capture: true });
  };
  el.addEventListener('pointerdown', downHandler);
  return () => el.removeEventListener('pointerdown', downHandler);
};

const isTouch = (e: PointerEvent | MouseEvent | TouchEvent): e is TouchEvent =>
  e instanceof TouchEvent ||
  (e instanceof PointerEvent && e.pointerType === 'touch');
