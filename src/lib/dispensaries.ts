
import type { Dispensary, Review } from '@/types/pos';
import { states } from './states';

const generateReviews = (dispensaryIndex: number): Review[] => {
    // This function should fetch real reviews. Returning empty array for now.
    return [];
}

const allDispensaries: Dispensary[] = states.flatMap((state, stateIndex) => 
    Array.from({ length: 25 }, (_, i) => {
        const dispensaryNames = ["The Green Leaf", "Herbal Haven", "CannaCopia", "Elevate Dispensary", "Bloom Botanicals", "The Kind Center", "Verdant Virtue", "Coastal Cannabis", "Mountain High", "City Sativas", "The Higher Path", "Golden State Greens", "Rocky Mountain Remedies", "Sunshine State Smokes", "The Peoples Remedy", "Zen Garden", "The Bud Boutique", "Oasis Cannabis Co.", "The Healing Corner", "Green Dragon", "Native Roots", "Terrapin Care Station", "Lightshade", "The Giving Tree", "Harvest House"];
        const name = dispensaryNames[i];
        
        return {
            id: `${name.replace(/\s+/g, '-')}-${state.name}-${i}`,
            name: name,
            logo: `https://picsum.photos/seed/${name}${i}/400/400`,
            hint: 'dispensary building',
            rating: (4.5 + (i % 5) * 0.1).toFixed(1),
            deliveryTime: 20 + (i * 3) % 30,
            address: `${100 + i * 12} Main St, Cityville, ${state.abbreviation} 12345`,
            state: state.name,
            hours: '9am - 10pm',
            lat: 39.7392,
            lng: -104.9903,
            reviews: generateReviews(i),
        };
    })
);


export const dispensariesByState = states.map(state => ({
    stateName: state.name,
    dispensaries: allDispensaries.filter(d => d.state === state.name),
}));
