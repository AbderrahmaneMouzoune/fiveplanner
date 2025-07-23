import type { Pitch } from "@/types"

export const DEFAULT_PITCHES: Pitch[] = [
  {
    id: "1",
    name: "LE FIVE Paris 18ᵉ (Moussorgski)",
    address: "32 rue Moussorgski, Paris 18ᵉ",
    surfaceType: "indoor",
    isFilmed: true,
    priceRange: "€€€",
    description: "Le plus grand centre intramuros avec club-house",
  },
  {
    id: "2",
    name: "LE FIVE Paris 17ᵉ",
    address: "Porte Pouchet, Paris 17ᵉ",
    surfaceType: "indoor",
    isFilmed: true,
    priceRange: "€€€",
    description: "Centre sous porche, moderne",
  },
  {
    id: "3",
    name: "LE FIVE La Villette / Aubervilliers",
    address: "25 rue Sadi Carnot, Aubervilliers",
    surfaceType: "indoor",
    isFilmed: true,
    priceRange: "€€€",
    description: "Centre de zone nord",
  },
  {
    id: "4",
    name: "LE FIVE Créteil",
    address: "1 rue Le Corbusier, Créteil",
    surfaceType: "indoor",
    isFilmed: false,
    priceRange: "€€",
    description: "Centre éducatif Five Académie",
  },
  {
    id: "5",
    name: "LE FIVE Marville & Morangis",
    address: "Périphérie parisienne",
    surfaceType: "indoor",
    isFilmed: false,
    priceRange: "€€",
    description: "Nouveaux complexes multi-sports",
  },
]

export const getSurfaceTypeLabel = (surfaceType: Pitch["surfaceType"]) => {
  switch (surfaceType) {
    case "synthetic":
      return "Synthétique"
    case "grass":
      return "Herbe naturelle"
    case "indoor":
      return "Indoor"
    case "concrete":
      return "Béton"
    default:
      return surfaceType
  }
}

export const getSurfaceTypeColor = (surfaceType: Pitch["surfaceType"]) => {
  switch (surfaceType) {
    case "synthetic":
      return "bg-primary/10 text-primary border-primary/20"
    case "grass":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20"
    case "indoor":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20"
    case "concrete":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}
