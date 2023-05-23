import { RootHandler, headless } from './headless';

type PanelState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const handleRoot: RootHandler<PanelState> = (el, directive, { Alpine }) => {
  const panelState = Alpine.reactive({
    isOpen: false,
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  });

  Alpine.bind(el, {
    ':open': () => panelState.isOpen,
    'x-id': () => ['x-panel'],
  });

  return panelState;
};

export const panel = headless('panel', handleRoot, {
  summary: (panelState, el, directive, { Alpine }) => {
    Alpine.bind(el, {
      ':aria-expanded': () => panelState.isOpen,
      ':aria-controls': '$id("x-panel")',
    });
  },
  details: (panelState, el, directive, { Alpine }) => {
    Alpine.bind(el, {
      'x-show': () => panelState.isOpen,
      'x-transition:enter': 'transition-transform',
      'x-transition:enter-start': 'translate-x-full',
      'x-transition:leave': 'transition-transform',
      'x-transition:leave-end': 'translate-x-full',
    });
  },
});
