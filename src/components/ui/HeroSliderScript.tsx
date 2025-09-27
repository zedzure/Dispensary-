
'use client';

import { useEffect, useState } from 'react';

export function HeroSliderScript() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const sliderItems = [
      {
        name: ['Blue', 'Dream'],
        color: '#4A90E2',
        image: 'https://images.pexels.com/photos/7773109/pexels-photo-7773109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        data: ['24%', 'Sativa', 'Berry', 'Uplifting', '0.2%'],
      },
      {
        name: ['OG', 'Kush'],
        color: '#50E3C2',
        image: 'https://images.pexels.com/photos/3676962/pexels-photo-3676962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        data: ['22%', 'Hybrid', 'Earthy', 'Relaxing', '0.5%'],
      },
      {
        name: ['Sour', 'Diesel'],
        color: '#F5A623',
        image: 'https://images.pexels.com/photos/8139676/pexels-photo-8139676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        data: ['26%', 'Sativa', 'Diesel', 'Energetic', '0.1%'],
      },
      {
        name: ['Joint', 'Pack'],
        color: '#8E44AD',
        image: 'https://images.pexels.com/photos/8139067/pexels-photo-8139067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        data: ['20%', 'Indica', 'Grape', 'Sleepy', '0.3%'],
      },
    ];

    let currentIndex = 0;
    let isAnimating = false;

    const container = document.querySelector('.slider-container') as HTMLElement | null;
    const overlay = document.querySelector('.color-overlay') as HTMLElement | null;
    const firstWord = document.querySelector('.first-word') as HTMLElement | null;
    const secondWord = document.querySelector('.second-word') as HTMLElement | null;
    const imageElement = document.querySelector('.product-image') as HTMLImageElement | null;
    const dataValues = document.querySelectorAll('.data-value');
    const dots = document.querySelectorAll('.control-dot');

    if (!container || !overlay || !firstWord || !secondWord || !imageElement || dataValues.length === 0 || dots.length === 0) {
      return;
    }

    function initSlider() {
      const currentItem = sliderItems[currentIndex];
      if (container) container.style.background = currentItem.color;
      if (firstWord) firstWord.textContent = currentItem.name[0];
      if (secondWord) secondWord.textContent = currentItem.name[1];
      if (imageElement) imageElement.src = currentItem.image;
    }

    function morphWords(fromWords: (string | undefined)[], toWords: (string | undefined)[], onComplete?: () => void) {
        if (!firstWord || !secondWord) return;

        const fromFirst = String(fromWords[0] || '');
        const fromSecond = String(fromWords[1] || '');
        const toFirst = String(toWords[0] || '');
        const toSecond = String(toWords[1] || '');

        firstWord.style.transform = "translateX(0)";
        secondWord.style.transform = "translateX(0)";

        const maxMoveDistance = 20;
        let step = 0;
        const totalSteps = 40;

        function nextFrame() {
            if (step < totalSteps) {
            const progress = step / (totalSteps - 1);
            const easeProgress = progress * progress * progress;

            const moveDistance = maxMoveDistance * easeProgress;
            firstWord!.style.transform = `translateX(${'${moveDistance}'}px)`;
            secondWord!.style.transform = `translateX(-${'${moveDistance}'}px)`;

            const firstCharsToShow = Math.max(0,Math.ceil(fromFirst.length * (1 - easeProgress)));
            const secondCharsToShow = Math.max(0, Math.ceil(fromSecond.length * (1 - easeProgress)));
            const currentFirst = fromFirst.substring(0, firstCharsToShow);
            const currentSecond = fromSecond.substring(fromSecond.length - secondCharsToShow);

            if (currentFirst !== firstWord!.textContent) firstWord!.textContent = currentFirst;
            if (currentSecond !== secondWord!.textContent) secondWord!.textContent = currentSecond;
            
            step++;
            requestAnimationFrame(nextFrame);
            } else {
                setTimeout(() => {
                    let expandStep = 0;
                    const expandSteps = 40;
                    function expandFrame() {
                        const expandProgress = expandStep / (expandSteps - 1);
                        const easeExpandProgress = expandProgress * expandProgress * (3 - 2 * expandProgress);
                        const returnDistance = maxMoveDistance * (1 - easeExpandProgress);
                        firstWord!.style.transform = `translateX(${'${returnDistance}'}px)`;
                        secondWord!.style.transform = `translateX(-${'${returnDistance}'}px)`;
                        
                        const firstCharsToShow = Math.ceil(toFirst.length * easeExpandProgress);
                        const secondCharsToShow = Math.ceil(toSecond.length * easeExpandProgress);
                        const currentFirst = toFirst.substring(0, firstCharsToShow);
                        const currentSecond = toSecond.substring(toSecond.length - secondCharsToShow);
                        
                        if (currentFirst !== firstWord!.textContent) firstWord!.textContent = currentFirst;
                        if (currentSecond !== secondWord!.textContent) secondWord!.textContent = currentSecond;
                        
                        if (expandStep < expandSteps) {
                            expandStep++;
                            requestAnimationFrame(expandFrame);
                        } else {
                            firstWord!.style.transform = "translateX(0)";
                            secondWord!.style.transform = "translateX(0)";
                            firstWord!.textContent = toFirst;
                            secondWord!.textContent = toSecond;
                            if (onComplete) onComplete();
                        }
                    }
                    expandFrame();
                }, 100);
            }
        }
        nextFrame();
    }

    function animateDataValues(newValues: string[]) {
      dataValues.forEach((value, index) => {
        const v = value as HTMLElement;
        setTimeout(() => {
          v.style.opacity = '0';
          setTimeout(() => {
            v.textContent = newValues[index];
            v.style.opacity = '1';
          }, 150);
        }, index * 80);
      });
    }

    function changeSlide(newIndex: number) {
      if (newIndex === currentIndex || isAnimating || !container || !overlay || !imageElement) return;

      isAnimating = true;
      const currentItem = sliderItems[currentIndex];
      const newItem = sliderItems[newIndex];

      overlay.style.background = newItem.color;
      overlay.classList.add('slide-down');

      setTimeout(() => {
        morphWords(currentItem.name, newItem.name);
        animateDataValues(newItem.data);

        setTimeout(() => {
          imageElement.src = newItem.image;
          imageElement.style.opacity = '0';

          setTimeout(() => {
            container.style.background = newItem.color;
            overlay.classList.remove('slide-down');
            overlay.style.transform = 'translateY(-100%)';

            setTimeout(() => {
              imageElement.style.opacity = '1';
              overlay.style.transform = '';
              isAnimating = false;
            }, 300);
          }, 100);
        }, 400);
      }, 0);

      dots[currentIndex]?.classList.remove('active');
      dots[newIndex]?.classList.add('active');
      currentIndex = newIndex;
    }

    function autoSlide() {
      if (!isAnimating) {
        const nextIndex = (currentIndex + 1) % sliderItems.length;
        changeSlide(nextIndex);
      }
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => changeSlide(index));
    });

    initSlider();
    const slideInterval = setInterval(autoSlide, 4000);

    return () => {
      clearInterval(slideInterval);
      dots.forEach((dot, index) => {
        dot.removeEventListener('click', () => changeSlide(index));
      });
    };
  }, [isMounted]);

  return null;
}
