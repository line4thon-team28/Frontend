import petPhoto from '../../assets/images/pet-a.webp'

const myLostPets = [
  {
    lostPetId: 1,
    name: '나비',
    species: 'CAT',
    status: 'SEARCHING',
    photos: [petPhoto],
    thumbnail: petPhoto,
    matchCount: 4,
  },
]

export function getMockMyLostPets() {
  return myLostPets.map((pet) => ({ ...pet, photos: [...pet.photos] }))
}
