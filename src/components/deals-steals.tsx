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
              <li key={index} className="flex-shrink-0 w-32 text-center">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-border mb-2 shadow-md cursor-pointer group">
                  <Image
                    src={`https://placehold.co/112x112.png`}
                    data-ai-hint={deal.hint}
                    alt={deal.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-foreground truncate">{deal.name}</p>
              </li>
            ))}
          </ul>
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll hover:pause-animation" aria-hidden="true">
            {deals.map((deal, index) => (
              <li key={index} className="flex-shrink-0 w-32 text-center">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-border mb-2 shadow-md cursor-pointer group">
                  <Image
                    src={`https://placehold.co/112x112.png`}
                    data-ai-hint={deal.hint}
                    alt={deal.name}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-foreground truncate">{deal.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
