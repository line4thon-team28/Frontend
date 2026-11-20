import { Link, useNavigate } from 'react-router-dom'
import kakaoIcon from '../../assets/icons/kakao.svg'
import pawWhiteIcon from '../../assets/icons/paw-white.svg'
import mainPetPhoto from '../../assets/images/pet-a.webp'
import leftPetPhoto from '../../assets/images/pet-e.webp'
import rightPetPhoto from '../../assets/images/pet-g.webp'
import Button from '../../components/Button/Button'
import PetPhotoCircle from '../../components/PetPhotoCircle/PetPhotoCircle'
import { startKakaoLogin } from '../../utils/kakaoAuth'
import styles from './StartPage.module.css'

export default function StartPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logoMark}>
          <img src={pawWhiteIcon} alt="" />
        </span>
        <span className={styles.logoText}>포포즈</span>
      </header>

      <div className={styles.illustration} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobBottom}`} />
        <span className={`${styles.blob} ${styles.blobTop}`} />
        <div className={styles.stage}>
          <PetPhotoCircle src={mainPetPhoto} className={styles.mainPhoto} />
          <PetPhotoCircle src={leftPetPhoto} className={styles.leftPhoto} />
          <PetPhotoCircle src={rightPetPhoto} className={styles.rightPhoto} />
          <span className={`${styles.dot} ${styles.dotLarge}`} />
          <span className={`${styles.dot} ${styles.dotSmall}`} />
        </div>
      </div>

      <section className={styles.intro}>
        <h1 className={styles.title}>
          잃어버린 아이,
          <br />
          포포즈가 찾아올게요
        </h1>
        <p className={styles.description}>한 번만 등록하면 보호소 공고와 목격 제보를 매일 대신 확인해 드려요.</p>
      </section>

      <div className={styles.actions}>
        <Button variant="kakao" icon={kakaoIcon} onClick={() => startKakaoLogin()}>
          카카오로 3초 만에 시작하기
        </Button>
        <Button variant="outline" className={styles.emailButton} onClick={() => navigate('/signup')}>
          이메일로 가입하기
        </Button>
      </div>

      <footer className={styles.footer}>
        <p>
          계정이 있나요?{' '}
          <Link to="/login" className={styles.loginLink}>
            로그인
          </Link>
        </p>
        <Link to="/sightings/new">로그인 없이 제보 ›</Link>
      </footer>
    </main>
  )
}
