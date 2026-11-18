import { formatPetDescription } from '../../utils/formatPetInfo'
import layout from '../../layouts/PetPageLayout.module.css'
import { SHELTER_PREVIEWS } from '../../hooks/useCandidateDetailPage'
import styles from './CandidateDetail.module.css'

function DeadlineCard({ candidate, closed }) {
  const { deadlineDays, deadlineDate } = candidate
  const urgent = !closed && deadlineDays <= 2
  const tone = closed ? styles.closedDeadline : urgent ? styles.urgentDeadline : styles.openDeadline
  const title = closed
    ? '공고 종료'
    : deadlineDays === 0 ? '보호 기간이 오늘 마감돼요' : `보호 기간 마감까지 ${deadlineDays}일`
  const description = closed
    ? '보호 기간이 끝난 공고예요.'
    : urgent ? '긴급 · 오늘 안에 방문해 주세요' : `공고 종료 ${deadlineDate} · 지금 연락하면 확인 가능`

  return (
    <div className={`${styles.deadline} ${tone}`}>
      <span className={styles.deadlineBadge}>{closed ? '종료' : deadlineDays === 0 ? 'D-DAY' : `D-${deadlineDays}`}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function ShelterDetails({ candidate, closed, mapUrl, phone, scenario, onPreview }) {
  const facts = [
    ['색', candidate.coat],
    ['나이', candidate.age],
    ['체중', candidate.weight],
  ]
  const foundAt = candidate.reportedAt?.includes('발견') ? candidate.reportedAt : `${candidate.reportedAt} 발견`

  return (
    <>
      <section className={styles.content} aria-label="보호소 공고 상세">
        <DeadlineCard candidate={candidate} closed={closed} />
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{formatPetDescription(candidate)}</h1>
          <div className={styles.previewButtons} role="group" aria-label="공고 화면 미리보기">
            {Object.entries(SHELTER_PREVIEWS).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={scenario === value} onClick={() => onPreview(value)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.meta}>
          {[
            candidate.announcementId && `공고번호 ${candidate.announcementId}`,
            candidate.reportedAt && foundAt,
          ].filter(Boolean).join(' · ')}
        </p>

        <dl className={styles.facts}>
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '정보 없음'}</dd>
            </div>
          ))}
        </dl>

        <section className={styles.description}>
          <h2>특징 · 발견 장소</h2>
          <p>{candidate.description}</p>
        </section>

        <section className={styles.facility} aria-label="보호소 정보">
          <span className={styles.facilityIcon} aria-hidden="true" />
          <div>
            <h2>{candidate.facility}</h2>
            <p>{[candidate.address, phone || '전화번호 없음'].filter(Boolean).join(' · ')}</p>
          </div>
          {!closed && mapUrl && (
            <a className={styles.mapLink} href={mapUrl} target="_blank" rel="noreferrer">지도</a>
          )}
        </section>

        {!closed && phone && candidate.supplies && (
          <section className={styles.supplies}>
            <h2>확인하러 갈 때 챙길 것</h2>
            <p>{Array.isArray(candidate.supplies) ? candidate.supplies.join(' · ') : candidate.supplies}</p>
          </section>
        )}
      </section>

      {phone && (
        <footer className={`${layout.stickyFooter} ${styles.actions}`}>
          <a className={styles.callLink} href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
            <strong>보호소에 전화하기</strong>
            <span>{phone}</span>
          </a>
        </footer>
      )}
      {!phone && mapUrl && (
        <footer className={`${layout.stickyFooter} ${styles.actions}`}>
          <a className={styles.mapAction} href={mapUrl} target="_blank" rel="noreferrer">
            <div>
              <span>보호소 주소</span>
              <strong>{candidate.address}</strong>
            </div>
            <span className={styles.mapLink}>지도 앱 열기</span>
          </a>
        </footer>
      )}
    </>
  )
}
