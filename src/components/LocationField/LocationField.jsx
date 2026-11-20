import ManualRegionPicker from './ManualRegionPicker'
import styles from './LocationField.module.css'

const NOTICE_TITLES = {
  denied: '위치 권한이 꺼져 있어요',
  failed: '현재 위치를 확인하지 못했어요',
}

export default function LocationField({ currentRegion, isEditing, onEdit, onUseCurrent, manualValue, onManualChange }) {
  const { status, region } = currentRegion
  const isAuto = status === 'found' && !isEditing
  const isManual = status === 'denied' || status === 'failed' || isEditing

  const renderAction = () => {
    if (isAuto) {
      return (
        <button type="button" className={styles.action} onClick={onEdit}>
          현재 위치 자동 · 수정
        </button>
      )
    }
    if (isEditing && status === 'found') {
      return (
        <button type="button" className={styles.action} onClick={onUseCurrent}>
          현재 위치 사용
        </button>
      )
    }
    return null
  }

  return (
    <section className={styles.field} aria-labelledby="sighting-location-label">
      <div className={styles.header}>
        <h2 id="sighting-location-label" className={styles.label}>
          목격 위치 <span className={styles.required}>*</span>
        </h2>
        {renderAction()}
      </div>

      {!isManual && (
        <div className={styles.current} aria-live="polite">
          <span className={`${styles.dot} ${isAuto ? '' : styles.dotWaiting}`} aria-hidden="true" />
          <span className={`${styles.currentText} ${isAuto ? '' : styles.currentWaiting}`}>
            {isAuto
              ? [region.sido, region.sigungu, region.dong].filter(Boolean).join(' ')
              : '현재 위치를 확인하고 있어요'}
          </span>
          <span className={styles.scope}>시군구 단위 저장</span>
        </div>
      )}

      {isManual && (
        <>
          {!isEditing && (
            <div className={styles.notice} role="status">
              <span className={styles.noticeIcon} aria-hidden="true">
                !
              </span>
              <div>
                <p className={styles.noticeTitle}>{NOTICE_TITLES[status]}</p>
                <p className={styles.noticeText}>아래에서 시도·시군구를 직접 골라 주세요.</p>
              </div>
            </div>
          )}
          <ManualRegionPicker value={manualValue} onChange={onManualChange} />
        </>
      )}
    </section>
  )
}
