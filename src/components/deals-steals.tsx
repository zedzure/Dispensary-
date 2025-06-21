import Image from 'next/image';

const deals = Array.from({ length: 20 }).map((_, i) => ({
  name: `Amazing Deal ${i + 1}`,
  hint: 'discount price tag',
}));

export function DealsSteals() {
  return (
    <section id="deals" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
          Deals & Steals
        </h2>
        <div 
          className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
        >
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll hover:pause-animation">
            {deals.map((deal, index) => (
              <li key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 w-20">
                <div className="relative w-16 h-16 cursor-pointer group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-spin-slow group-hover:animate-spin"></div>
                  <div className="absolute inset-0.5 bg-card rounded-full"></div>
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={`https://placehold.co/56x56.png`}
                      data-ai-hint={deal.hint}
                      alt={deal.name}
                      width={56}
                      height={56}
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
              <li key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 w-20">
                <div className="relative w-16 h-16 cursor-pointer group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-spin-slow group-hover:animate-spin"></div>
                  <div className="absolute inset-0.5 bg-card rounded-full"></div>
                  <div className="absolute inset-1 rounded-full overflow-hidden">
                    <Image
                      src={`https://placehold.co/56x56.png`}
                      data-ai-hint={deal.hint}
                      alt={deal.name}
                      width={56}
                      height={56}
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
