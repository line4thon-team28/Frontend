import BackButton from '../BackButton/BackButton'
import layout from '../../layouts/PetPageLayout.module.css'

export default function PageBackHeader({ title, fallbackPath, className = '' }) {
  return (
    <header className={`${layout.centeredHeader} ${className}`}>
      <BackButton fallbackPath={fallbackPath} />
      <h1>{title}</h1>
    </header>
  )
}
