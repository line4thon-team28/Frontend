export const petPaths = {
  candidates: '/candidates',
  candidateDetail: '/candidates/:candidateId',
  newRegistration: '/lost-pets/new',
  registrations: '/my',
  editRegistration: '/my/:petId/edit',
}

function withPet(path, petId) {
  return petId ? `${path}?pet=${encodeURIComponent(petId)}` : path
}

export function candidatesPath(petId) {
  return withPet(petPaths.candidates, petId)
}

export function candidateDetailPath(candidateId, petId) {
  const path = petPaths.candidateDetail.replace(':candidateId', encodeURIComponent(candidateId))
  return withPet(path, petId)
}

export function editRegistrationPath(petId) {
  return petPaths.editRegistration.replace(':petId', encodeURIComponent(petId))
}
