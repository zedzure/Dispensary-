import Image from 'next/image';

const categories = [
  { name: 'Pre-rolls', hint: 'cannabis joint' },
  { name: 'Flower', hint: 'cannabis bud' },
  { name: 'Vapes', hint: 'vape pen' },
  { name: 'Edibles', hint: 'gummy candy' },
  { name: 'Concentrates', hint: 'cannabis oil' },
  { name: 'Tinctures', hint: 'dropper bottle' },
  { name: 'Topicals', hint: 'cream jar' },
  { name: 'Seeds', hint: 'cannabis seed' },
  { name: 'Gear', hint: 'grinder accessory' },
  { name: 'Deals', hint: 'sale tag' },
];

export function CategoryCircles() {
  return (
    <div className="flex -mx-4 px-4 space-x-4 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col items-center space-y-2 flex-shrink-0 w-20">
            <div className="relative w-16 h-16 cursor-pointer group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-spin-slow group-hover:animate-spin"></div>
              <div className="absolute inset-0.5 bg-card rounded-full"></div>
              <div className="absolute inset-1 rounded-full overflow-hidden">
                <Image
                    src={`https://placehold.co/56x56.png`}
                    data-ai-hint={category.hint}
                    alt={category.name}
                    width={56}
                    height={56}
                    className="object-cover"
                />
              </div>
            </div>
            <p className="text-xs font-medium text-foreground">{category.name}</p>
          </div>
        ))}
    </div>
  );
}
