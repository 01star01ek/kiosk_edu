'use client'

import styles from '@/styles/HelpButton.module.scss'

interface HelpButtonProps {
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  helpText: string
}

export default function HelpButton({ showHelp, setShowHelp, helpText }: HelpButtonProps) {
  return (
    <>
      <button
        onClick={() => setShowHelp(!showHelp)}
        className={styles.helpButton}
      >
        <span className={styles.helpIcon}>❓</span>
        도움말
      </button>

      {showHelp && (
        <div className={styles.helpOverlay} onClick={() => setShowHelp(false)}>
          <div className={styles.helpModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.helpHeader}>
              <h3>도움말</h3>
              <button 
                onClick={() => setShowHelp(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            <p className={styles.helpText}>{helpText}</p>
          </div>
        </div>
      )}
    </>
  )
}