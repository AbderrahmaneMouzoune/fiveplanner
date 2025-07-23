// Système de couleurs d'avatar avec distribution équilibrée
const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-sky-500",
  "bg-fuchsia-500",
  "bg-slate-500",
]

// Cache pour stocker les couleurs assignées
const colorAssignments = new Map<string, string>()

export function getUniqueAvatarColor(name: string, existingPlayers: string[] = []): string {
  // Si la couleur est déjà assignée, la retourner
  if (colorAssignments.has(name)) {
    return colorAssignments.get(name)!
  }

  // Obtenir les couleurs déjà utilisées par les autres joueurs
  const usedColors = new Set<string>()
  existingPlayers.forEach((playerName) => {
    if (colorAssignments.has(playerName)) {
      usedColors.add(colorAssignments.get(playerName)!)
    }
  })

  // Trouver une couleur disponible
  let availableColors = AVATAR_COLORS.filter((color) => !usedColors.has(color))

  // Si toutes les couleurs sont utilisées, utiliser toutes les couleurs
  if (availableColors.length === 0) {
    availableColors = [...AVATAR_COLORS]
  }

  // Utiliser un hash simple du nom pour avoir une distribution cohérente
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff
  }

  // Sélectionner une couleur basée sur le hash mais parmi les couleurs disponibles
  const colorIndex = Math.abs(hash) % availableColors.length
  const selectedColor = availableColors[colorIndex]

  // Sauvegarder l'assignation
  colorAssignments.set(name, selectedColor)

  return selectedColor
}

// Fonction pour réinitialiser les assignations (utile pour les tests ou le reset)
export function resetColorAssignments() {
  colorAssignments.clear()
}

// Fonction pour obtenir toutes les assignations actuelles
export function getColorAssignments(): Map<string, string> {
  return new Map(colorAssignments)
}

// Fonction pour préassigner des couleurs à une liste de joueurs
export function preassignColors(playerNames: string[]) {
  // Réinitialiser les assignations
  resetColorAssignments()

  // Assigner des couleurs de manière équilibrée
  playerNames.forEach((name, index) => {
    const colorIndex = index % AVATAR_COLORS.length
    colorAssignments.set(name, AVATAR_COLORS[colorIndex])
  })
}
