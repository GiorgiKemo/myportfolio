export type RoomKind = "living" | "bedroom" | "bathroom" | "office" | "twin" | "wellness" | "lobby" | "cafe" | "cowork" | "gym" | "pool" | "terrace" | "garden";
export type ResidenceRoom = {
  id: string; name: string; kind: RoomKind; zone: string;
  x: number; z: number; width: number; depth: number;
  description: string; amenities: string[];
};
export type ResidenceFloor = { id: number; code: string; name: string; subtitle: string; description: string; rooms: ResidenceRoom[] };

const homes = (variant: "office" | "twin" | "wellness" = "office"): ResidenceRoom[] => [
  { id: "west-living", name: "Living & dining", kind: "living", zone: "West residence", x: -4.9, z: 2.55, width: 7.45, depth: 4.8, description: "An open living space with a kitchen island and a generous dining area, opening onto the south-facing balcony.", amenities: ["Kitchen island", "Integrated appliances", "Dining for four", "Private balcony"] },
  { id: "west-bedroom", name: "Primary suite", kind: "bedroom", zone: "West residence", x: -6.4, z: -2.8, width: 4.45, depth: 4.75, description: "A quiet bedroom with built-in storage, warm oak finishes and a full-height window.", amenities: ["Queen-size bed", "Built-in wardrobe", "Reading lights", "Full-height glazing"] },
  { id: "west-bath", name: "Stone bathroom", kind: "bathroom", zone: "West residence", x: -2.65, z: -2.8, width: 2.55, depth: 4.75, description: "A compact spa-like bathroom with a walk-in shower and a floating vanity.", amenities: ["Walk-in rain shower", "Floating vanity", "Stone tile", "Heated towel rail"] },
  { id: "east-living", name: "Kitchen & lounge", kind: "living", zone: "East residence", x: 4.9, z: 2.55, width: 7.45, depth: 4.8, description: "A connected kitchen, lounge and dining space with its own planted balcony.", amenities: ["Open kitchen", "Breakfast island", "Lounge seating", "Planted balcony"] },
  { id: "east-bedroom", name: variant === "twin" ? "Children’s bedroom" : "Bedroom", kind: variant === "twin" ? "twin" : "bedroom", zone: "East residence", x: 6.4, z: -2.8, width: 4.45, depth: 4.75, description: "Soft materials and a calm palette make this bedroom a comfortable retreat.", amenities: [variant === "twin" ? "Twin beds" : "Queen-size bed", "Oak wardrobe", "Soft floor rug", "Full-height glazing"] },
  { id: "east-flex", name: variant === "wellness" ? "Wellness studio" : "Home office", kind: variant === "wellness" ? "wellness" : "office", zone: "East residence", x: 2.65, z: -1.48, width: 2.55, depth: 2.1, description: variant === "wellness" ? "A private space for stretching, mindful movement and an unhurried start to the day." : "A dedicated workspace with a proper desk and built-in shelving.", amenities: variant === "wellness" ? ["Yoga mats", "Wall mirror", "Equipment storage", "Oak finishes"] : ["Work desk", "Task chair", "Library shelves", "Dedicated workspace"] },
  { id: "east-bath", name: "Shower room", kind: "bathroom", zone: "East residence", x: 2.65, z: -3.9, width: 2.55, depth: 2.3, description: "A neatly arranged bathroom with a glazed shower enclosure and stone finishes.", amenities: ["Glass shower", "Stone vanity", "Rain shower head", "Water-saving fittings"] },
];

export const residenceFloors: ResidenceFloor[] = [
  { id: 0, code: "G", name: "The arrival", subtitle: "Lobby & shared spaces", description: "A welcoming ground floor that makes room for work, conversation and everyday rituals.", rooms: [
    { id: "lobby", name: "Reception lounge", kind: "lobby", zone: "Arrival", x: -4.9, z: 2.55, width: 7.45, depth: 4.8, description: "A generous arrival space, anchored by a stone reception desk and comfortable lounge seating.", amenities: ["Reception desk", "Resident lounge", "Step-free access", "Lift access"] },
    { id: "cafe", name: "Residents’ café", kind: "cafe", zone: "Social", x: 4.9, z: 2.55, width: 7.45, depth: 4.8, description: "A neighbourhood-style coffee bar with shared tables and a terrace-facing outlook.", amenities: ["Coffee bar", "Communal seating", "Terrace access", "Water station"] },
    { id: "cowork", name: "Co-working library", kind: "cowork", zone: "Work", x: -4.9, z: -2.8, width: 7.45, depth: 4.75, description: "A light-filled shared workspace with individual workstations, a meeting table and a small library.", amenities: ["Workstations", "Meeting table", "Library wall", "Power at every desk"] },
    { id: "gym", name: "Fitness studio", kind: "gym", zone: "Wellbeing", x: 4.9, z: -2.8, width: 7.45, depth: 4.75, description: "A residents’ fitness room arranged for cardio, strength training and stretching.", amenities: ["Treadmills", "Free weights", "Stretching zone", "Equipment storage"] },
  ] },
  { id: 1, code: "01", name: "Garden residences", subtitle: "Two homes · planted balconies", description: "Open living spaces, warm materials and planted balconies bring the outside closer.", rooms: homes() },
  { id: 2, code: "02", name: "Atelier residences", subtitle: "Two homes · space to create", description: "A residential floor designed around the balance between home life and creative work.", rooms: homes() },
  { id: 3, code: "03", name: "Family residences", subtitle: "Two homes · room to grow", description: "A flexible arrangement with shared living areas and a dedicated children’s room.", rooms: homes("twin") },
  { id: 4, code: "04", name: "Wellness residences", subtitle: "Two homes · a calmer rhythm", description: "Comfortable homes with room for movement, quiet and daily wellbeing.", rooms: homes("wellness") },
  { id: 5, code: "05", name: "The penthouse", subtitle: "Private home · wraparound terrace", description: "A setback top-floor home with generous living spaces and a sheltered terrace.", rooms: homes("wellness").map(room => ({ ...room, x: room.x * .84, z: room.z * .84, width: room.width * .84, depth: room.depth * .84, zone: "Penthouse", name: room.id === "east-living" ? "Dining salon" : room.name })) },
  { id: 6, code: "R", name: "The sky terrace", subtitle: "Pool · lounge · rooftop garden", description: "An outdoor destination above the city: water, shade and room to slow down.", rooms: [
    { id: "pool", name: "Pool deck", kind: "pool", zone: "Rooftop", x: -4.7, z: .2, width: 7.2, depth: 8.5, description: "An elevated swimming pool surrounded by a stone deck and a row of sun loungers.", amenities: ["Rooftop pool", "Sun loungers", "Outdoor shower", "Non-slip deck"] },
    { id: "terrace", name: "Pergola lounge", kind: "terrace", zone: "Rooftop", x: 3.6, z: 2.5, width: 7.7, depth: 4.6, description: "A shaded outdoor lounge with generous seating under a timber pergola.", amenities: ["Timber pergola", "Outdoor sofas", "Low tables", "Evening lighting"] },
    { id: "garden", name: "Roof garden", kind: "garden", zone: "Rooftop", x: 3.6, z: -2.8, width: 7.7, depth: 4.4, description: "A planted retreat with sculptural trees, benches and an intimate outdoor dining area.", amenities: ["Raised planters", "Specimen trees", "Dining terrace", "Garden benches"] },
  ] },
];

export const getResidenceFloor = (id: number) => residenceFloors.find(floor => floor.id === id)!;
