'use client'

import styles from '@/styles/MainScreen.module.scss'

interface MainScreenProps {
  switchScreen: (screen: string) => void
}

export default function MainScreen({ switchScreen }: MainScreenProps) {
  const kioskTypes = [
    { id: 'coffee', name: '커피가게 키오스크', icon: '☕', color: 'coffee', desc: '메가커피 주문 연습' }, // 설명 간결화
    { id: 'store', name: '편의점 키오스크', icon: '🏪', color: 'store', desc: 'GS25 셀프계산 체험' },
    { id: 'civil', name: '민원 키오스크', icon: '🏛️', color: 'civil', desc: '주민센터 서류 발급' },
    { id: 'train', name: 'ITX 키오스크', icon: '🚇', color: 'train', desc: 'ITX 승차권 예매' }, // 설명 변경
    { id: 'bus', name: '버스표 키오스크', icon: '🚌', color: 'bus', desc: '고속/시외버스 예매' }
  ]

  return (
    <div className={styles.mainScreen}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>원하는 키오스크를 <br className={styles.mobileBr} />선택하세요</h1> {/* 제목 간결화 및 모바일 줄바꿈 */}
          <p className={styles.subtitle}>다양한 키오스크 사용법을 연습해 볼 수 있습니다.</p> {/* 부제목 변경 */}
        </div>
        
        <div className={styles.kioskGrid}>
          {kioskTypes.map((kiosk) => (
            <div
              key={kiosk.id}
              onClick={() => switchScreen(kiosk.id)}
              className={`${styles.kioskCard} ${styles[kiosk.color]}`}
            >
              <div className={styles.kioskIcon}>{kiosk.icon}</div>
              <h3 className={styles.kioskName}>{kiosk.name}</h3>
              <p className={styles.kioskDesc}>{kiosk.desc}</p>
              <div className={styles.actionButton}>
                체험하기 <span className={styles.arrow}>→</span> {/* 버튼 텍스트 강조 및 화살표 분리 */}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.footer}>
          <button
            onClick={() => switchScreen('intro')}
            className={styles.backButton}
          >
            ← 처음 화면으로
          </button>
        </div>
      </div>
    </div>
  )
}