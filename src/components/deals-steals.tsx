import Image from 'next/image';

const deals = [
  { name: 'Blue Dream', hint: 'cannabis flower', tag: 'New' },
  { name: 'Sour Diesel', hint: 'cannabis flower', tag: 'Popular' },
  { name: 'OG Kush', hint: 'cannabis flower', tag: '5% Off' },
  { name: 'Granddaddy Purple', hint: 'cannabis flower', tag: 'Just In' },
  { name: 'White Widow', hint: 'cannabis flower', tag: '10 Left' },
  { name: 'AK-47', hint: 'cannabis flower' },
  { name: 'Jack Herer', hint: 'cannabis flower', tag: '10% Off' },
  { name: 'Green Crack', hint: 'cannabis flower' },
  { name: 'Pineapple Express', hint: 'cannabis flower', tag: '5 Left' },
  { name: 'Girl Scout Cookies', hint: 'cannabis flower', tag: 'Popular' },
  { name: 'Northern Lights', hint: 'cannabis flower' },
  { name: 'Bubba Kush', hint: 'cannabis flower', tag: 'New' },
  { name: 'Durban Poison', hint: 'cannabis flower' },
  { name: 'Maui Wowie', hint: 'cannabis flower', tag: 'Just In' },
  { name: 'Trainwreck', hint: 'cannabis flower', tag: '5% Off' },
  { name: 'Chemdawg', hint: 'cannabis flower' },
  { name: 'Super Lemon Haze', hint: 'cannabis flower', tag: '10 Left' },
  { name: 'Strawberry Cough', hint: 'cannabis flower' },
  { name: 'Gorilla Glue #4', hint: 'cannabis flower', tag: 'Popular' },
  { name: 'Zkittlez', hint: 'cannabis flower', tag: '10% Off' },
];


export function DealsSteals() {
  return (
    <section id="deals" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
          Deals & Steals
        </h2>
        <div 
          className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
        >
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll hover:pause-animation">
            {deals.map((deal, index) => (
              <li key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 w-28">
                <div className="relative w-[98px] h-[98px] cursor-pointer group">
                  {deal.tag && (
                    <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      {deal.tag}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-spin-slow group-hover:animate-spin"></div>
                  <div className="absolute inset-0.5 bg-card rounded-full"></div>
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={`https://placehold.co/90x90.png`}
                      data-ai-hint={deal.hint}
                      alt={deal.name}
                      width={90}
                      height={90}
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="text-xs font-medium text-foreground truncate w-full text-center">{deal.name}</p>
              </li>
            ))}
          </ul>
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll hover:pause-animation" aria-hidden="true">
            {deals.map((deal, index) => (
              <li key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 w-28">
                <div className="relative w-[98px] h-[98px] cursor-pointer group">
                  {deal.tag && (
                    <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      {deal.tag}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-spin-slow group-hover:animate-spin"></div>
                  <div className="absolute inset-0.5 bg-card rounded-full"></div>
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={`https://placehold.co/90x90.png`}
                      data-ai-hint={deal.hint}
                      alt={deal.name}
                      width={90}
                      height={90}
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className="text-xs font-medium text-foreground truncate w-full text-center">{deal.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
