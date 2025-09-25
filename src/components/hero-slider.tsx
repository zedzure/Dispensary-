
'use client';

import { HeroSliderScript } from './ui/HeroSliderScript';

export function HeroSlider() {
  return (
    <div className="slider-container">
      <div className="content">
        <div className="color-overlay"></div>
        <div className="product-name">
          <span className="word-part first-word">Blue</span>
          <span className="word-part second-word">Dream</span>
        </div>
        <img
          className="product-image"
          src="https://images.pexels.com/photos/7773109/pexels-photo-7773109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Cannabis Product"
          data-ai-hint="cannabis flower"
        />
        <div className="data-panel">
          <div className="data-item">
            <div className="data-value">24%</div>
            <div className="data-label">THC</div>
          </div>
          <div className="data-item">
            <div className="data-value">Sativa</div>
            <div className="data-label">Type</div>
          </div>
          <div className="data-item">
            <div className="data-value">Berry</div>
            <div className="data-label">Aroma</div>
          </div>
          <div className="data-item">
            <div className="data-value">Uplifting</div>
            <div className="data-label">Effect</div>
          </div>
          <div className="data-item">
            <div className="data-value">0.2%</div>
            <div className="data-label">CBD</div>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="control-dot active" data-index="0"></div>
        <div className="control-dot" data-index="1"></div>
        <div className="control-dot" data-index="2"></div>
        <div className="control-dot" data-index="3"></div>
      </div>
      <HeroSliderScript />
    </div>
  );
}
