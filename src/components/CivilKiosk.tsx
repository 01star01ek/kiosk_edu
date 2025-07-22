// src/components/CivilKiosk.tsx (민원 키오스크)
'use client'

import { useState } from 'react'
import styles from '@/styles/CivilKiosk.module.scss'
import HelpButton from './HelpButton'

interface CivilKioskProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  quantity: number
  setQuantity: (qty: number) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  switchScreen: (screen: string) => void
}

export default function CivilKiosk({ 
  currentStep, setCurrentStep, quantity, setQuantity, showHelp, setShowHelp, switchScreen 
}: CivilKioskProps) {
  const [selectedMenu, setSelectedMenu] = useState('')

  const civilMenus = [
    { id: 1, name: '가족관계등록' },
    { id: 2, name: '건축물대장' },
    { id: 3, name: '지적민원' },
    { id: 4, name: '새주소' },
    { id: 5, name: '사업자등록' },
    { id: 6, name: '인감신고' },
    { id: 7, name: '자동차민원' },
    { id: 8, name: '출입국' },
    { id: 9, name: '병무' },
    { id: 10, name: '국가보훈' },
    { id: 11, name: '세금' },
    { id: 12, name: '국정감사' }
  ]

  const getHelpText = () => {
    const helpTexts: Record<number, string> = {
      0: "원하는 민원 서비스를 선택해주세요",
      1: "원하는 것이 맞는지 확인하고 개수를 선택하세요",
      2: "인쇄가 진행중입니다. 잠시만 기다려주세요"
    }
    return helpTexts[currentStep] || "화면을 터치해주세요"
  }

  return (
    <div className={styles.civilKiosk}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button
          onClick={() => switchScreen('main')}
          className={styles.backButton}
        >
          ← 메인으로
        </button>
        <h1 className={styles.title}>🏛️ 스마트 민원 서식 발급기</h1>
        <HelpButton 
          showHelp={showHelp} 
          setShowHelp={setShowHelp} 
          helpText={getHelpText()} 
        />
      </div>

      {/* 메뉴 선택 화면 - 이미지 7번 스타일 */}
      {currentStep === 0 && (
        <div className={styles.menuScreen}>
          <div className={styles.header}>
            <h2 className={styles.menuTitle}>민원서식을 발급받으세요</h2>
            <p className={styles.menuSubtitle}>원하시는 민원의 번호를 누르세요</p>
          </div>

          <div className={styles.menuGrid}>
            {civilMenus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => {
                  setSelectedMenu(menu.name)
                  setCurrentStep(1)
                }}
                className={styles.menuItem}
              >
                <div className={styles.menuIcon}>📄</div>
                <div className={styles.menuNumber}>{menu.id}</div>
                <div className={styles.menuName}>{menu.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 서류 확인 및 개수 입력 - 이미지 8번 스타일 */}
      {currentStep === 1 && (
        <div className={styles.confirmScreen}>
          <div className={styles.container}>
            <h2 className={styles.confirmTitle}>원하는 것이 맞는지 확인</h2>
            
            <div className={styles.selectedService}>
              <div className={styles.serviceIcon}>📋</div>
              <h3 className={styles.serviceName}>{selectedMenu}</h3>
              <p className={styles.serviceQuestion}>인쇄 하시겠습니까?</p>
            </div>

            <div className={styles.quantitySection}>
              <h3 className={styles.quantityTitle}>매수:</h3>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.quantityButton}
                >
                  −
                </button>
                <span className={styles.quantityDisplay}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={styles.quantityButton}
                >
                  +
                </button>
              </div>
              
              <div className={styles.confirmButtons}>
                <button
                  onClick={() => setCurrentStep(0)}
                  className={styles.cancelButton}
                >
                  아니요
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className={styles.confirmButton}
                >
                  인쇄하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 인쇄 진행 화면 */}
      {currentStep === 2 && (
        <div className={styles.printingScreen}>
          <div className={styles.container}>
            <h2 className={styles.printingTitle}>인쇄중입니다</h2>
            <div className={styles.printingContent}>
              <div className={styles.printerIcon}>🖨️</div>
              <div className={styles.printingInfo}>
                <p className={styles.printingService}>{selectedMenu}</p>
                <p className={styles.printingQuantity}>{quantity}매 인쇄중</p>
              </div>
              <p className={styles.waitMessage}>잠시만 기다려주세요...</p>
              <button
                onClick={() => setCurrentStep(3)}
                className={styles.printCompleteButton}
              >
                인쇄 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 화면 */}
      {currentStep === 3 && (
        <div className={styles.completeScreen}>
          <div className={styles.container}>
            <div className={styles.completeIcon}>✅</div>
            <h2 className={styles.completeTitle}>인쇄 완료</h2>
            <div className={styles.completeInfo}>
              <p className={styles.completeService}>{selectedMenu}</p>
              <p className={styles.completeQuantity}>{quantity}매가 출력되었습니다</p>
              <p className={styles.completeInstructions}>아래쪽에서 서류를 가져가세요</p>
            </div>
            <div className={styles.completeButtons}>
              <button
                onClick={() => {
                  setCurrentStep(0)
                  setSelectedMenu('')
                  setQuantity(1)
                }}
                className={styles.newServiceButton}
              >
                새로 발급받기
              </button>
              <button
                onClick={() => switchScreen('main')}
                className={styles.backToMainButton}
              >
                메인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}