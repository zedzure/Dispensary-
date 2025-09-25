
'use client';

import { useEffect } from 'react';

export function CraftUiScript() {
  useEffect(() => {
    const list = document.querySelector('.craft-ui-list');
    if (!list) return;

    const items = list.querySelectorAll('li');
    if (items.length === 0) return;

    const setIndex = (event: Event) => {
      const target = event.target as HTMLElement;
      const closest = target.closest('li');
      if (closest) {
        const index = [...items].indexOf(closest);
        const cols = Array.from({ length: list.children.length }, (_, i) => {
          const item = items[i] as HTMLElement;
          item.dataset.active = (index === i).toString();
          return index === i ? '10fr' : '1fr';
        }).join(' ');
        (list as HTMLElement).style.setProperty('grid-template-columns', cols);
      }
    };
    
    list.addEventListener('focusin', setIndex);
    list.addEventListener('click', setIndex);
    list.addEventListener('pointermove', setIndex);

    const resync = () => {
      const w = Math.max(
        ...[...items].map((i) => {
          return (i as HTMLElement).offsetWidth;
        })
      );
      (list as HTMLElement).style.setProperty('--article-width', `${w}`);
    };

    window.addEventListener('resize', resync);
    resync();
    
    // Set initial state
    const initialActive = list.querySelector('[data-active="true"]');
    if (initialActive) {
      setIndex({ target: initialActive } as unknown as Event);
    }

    return () => {
      list.removeEventListener('focusin', setIndex);
      list.removeEventListener('click', setIndex);
      list.removeEventListener('pointermove', setIndex);
      window.removeEventListener('resize', resync);
    };
  }, []);

  return null;
}
