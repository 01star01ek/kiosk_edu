'use client'

import styles from '@/styles/IntroScreen.module.scss'
import Image from 'next/image'

interface IntroScreenProps {
  switchScreen: (screen: string) => void
}

export default function IntroScreen({ switchScreen }: IntroScreenProps) {
  return (
    <div className={styles.introScreen}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.mainIcon}>
            {/* 로고 이미지를 중앙에 크게 배치하고 그림자 효과로 입체감 부여 */}
            <Image 
              src="/logo.png" 
              alt="앱 로고" 
              width={150} // 로고 크기 키움
              height={150} // 로고 크기 키움
              priority // 로딩 우선순위 높임
            />
          </div>
          <h1 className={styles.title}>가상 키오스크</h1> {/* 제목 단순화 */}
          <p className={styles.subtitle}>
             교육용 키오스크 체험 서비스입니다
          </p>
        </div>

        <div className={styles.benefitsSection}>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>💡</span> {/* 아이콘 변경 */}
            <span className={styles.benefitText}> 화면 상단에서 '도움말'을 눌르면 무엇을 해야할지 알 수 있어요</span>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>🙋‍♀️</span> {/* 아이콘 변경 */}
            <span className={styles.benefitText}>궁금한 점은 언제든 질문해주세요</span>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>👇</span> {/* 아이콘 변경 */}
            <span className={styles.benefitText}>아래 '시작하기'를 눌러 체험을 시작하세요</span>
          </div>
        </div>

        <button
          onClick={() => switchScreen('main')}
          className={styles.startButton}
        >
          <span className={styles.buttonIcon}>✨</span>
          시작하기
        </button>

        <div className={styles.footerText}>
          본 서비스는 실제 결제가 이루어지지 않는 <br className={styles.mobileBr} />연습용입니다.
        </div>
      </div>
    </div>
  )
}