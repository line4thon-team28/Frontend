import { useId } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import useModalDialog from '../../hooks/useModalDialog'
import dialogStyles from '../../layouts/DialogLayout.module.css'
import styles from './PhotoViewer.module.css'

export default function PhotoViewer({ photo, label, className, imageClassName }) {
  const { dialogRef, isOpen, open, close, handleClose } = useModalDialog()
  const titleId = useId()

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={`${label} 원본 보기`}
        aria-haspopup="dialog"
        onClick={open}
      >
        <img className={imageClassName} src={photo} alt="" />
      </button>
      <dialog
        ref={dialogRef}
        className={`${dialogStyles.dialog} ${styles.photoViewer}`}
        aria-labelledby={titleId}
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        <div className={styles.viewerCard}>
          <div className={styles.viewerHeader}>
            <h2 id={titleId}>{label}</h2>
            <button type="button" aria-label="사진 닫기" onClick={close}>×</button>
          </div>
          {isOpen && (
            <TransformWrapper minScale={1} maxScale={4} disablePadding wheel={{ step: 0.0025 }} doubleClick={{ mode: 'toggle' }}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent
                    wrapperClass={styles.photoViewport}
                    wrapperStyle={{ width: '100%', height: 'min(52dvh, 440px)' }}
                    contentStyle={{ width: '100%', height: '100%' }}
                  >
                    <img src={photo} alt={label} draggable={false} />
                  </TransformComponent>
                  <div className={styles.viewerFooter}>
                    <p>마우스 휠로 확대·축소</p>
                    <div className={styles.zoomControls} role="group" aria-label="사진 확대 및 축소">
                      <button type="button" aria-label="사진 축소" onClick={() => zoomOut()}>−</button>
                      <button type="button" aria-label="사진 배율 초기화" onClick={() => resetTransform()}>초기화</button>
                      <button type="button" aria-label="사진 확대" onClick={() => zoomIn()}>+</button>
                    </div>
                  </div>
                </>
              )}
            </TransformWrapper>
          )}
        </div>
      </dialog>
    </>
  )
}
