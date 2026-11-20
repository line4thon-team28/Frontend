import { useNavigate } from 'react-router-dom'
import errorIcon from '../../assets/icons/error.svg'
import Button from '../../components/Button/Button'
import StatusView from '../../components/StatusView/StatusView'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <StatusView
        icon={errorIcon}
        tone="error"
        title="페이지를 찾을 수 없어요"
        description={'주소가 바뀌었거나 삭제된 페이지예요.\n처음 화면으로 돌아가 주세요.'}
        action={
          <Button variant="dark" size="medium" onClick={() => navigate('/', { replace: true })}>
            처음으로
          </Button>
        }
      />
    </main>
  )
}
