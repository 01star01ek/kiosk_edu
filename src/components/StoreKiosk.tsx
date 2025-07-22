'use client'

import { useState } from 'react'
import styles from '@/styles/StoreKiosk.module.scss'
import HelpButton from './HelpButton'

interface StoreKioskProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  switchScreen: (screen: string) => void
}

export default function StoreKiosk({ 
  currentStep, setCurrentStep, showHelp, setShowHelp, switchScreen 
}: StoreKioskProps) {
  // 스캔된 상품 목록 (예시 데이터)
  const [scannedItems, setScannedItems] = useState([
    { name: '삼각김밥(참치)', price: 1200 },
    { name: '생수 500ml', price: 800 },
    { name: '새우깡', price: 1500 },
  ]);
  const initialCalculatedPrice = scannedItems.reduce((acc, item) => acc + item.price, 0);
  
  // 현재 화면에 표시될 총 결제 금액 (할인/쿠폰 적용될 수 있음)
  const [currentDisplayPrice, setCurrentDisplayPrice] = useState(initialCalculatedPrice);

  // 할인/쿠폰 관련 상태
  const [discountAppliedAmount, setDiscountAppliedAmount] = useState(0); // 적용된 할인 금액
  const [couponAppliedAmount, setCouponAppliedAmount] = useState(0); // 적용된 쿠폰 금액
  const [membershipNumber, setMembershipNumber] = useState(''); // 회원 번호 입력 상태
  const [couponCode, setCouponCode] = useState(''); // 쿠폰 코드 입력 상태

  // 선택된 최종 결제 수단
  const [selectedFinalPaymentMethod, setSelectedFinalPaymentMethod] = useState<'card' | 'pay' | 'cash' | 'voucher' | 'gs_pay' | 'membership' | 'other' | null>(null);


  const getHelpText = () => {
    const helpTexts: Record<number, string> = {
      0: "간편 계산하기 버튼을 눌러 상품 스캔을 시작하세요.",
      1: "할인/적립, 쿠폰 사용 또는 바로 결제를 선택하세요.", 
      2: "멤버십 번호를 입력하거나 바코드를 스캔하여 할인/적립을 진행하세요.", // 할인적립 화면
      3: "쿠폰 번호를 입력하거나 쿠폰을 스캔하여 적용하세요.", // 쿠폰사용 화면
      4: "원하는 결제 수단을 선택해주세요.", // 결제 수단 선택
      5: "선택하신 결제 수단으로 결제를 진행해주세요.", // 결제 진행 화면
      6: "결제가 완료되었습니다. 영수증을 확인해주세요." // 결제 완료
    }
    return helpTexts[currentStep] || "화면을 터치해주세요"
  }

  // 회원 번호 입력 처리 함수 (숫자 패드처럼)
  const handleNumberPadInput = (value: string | number, target: 'membership' | 'coupon') => {
    if (value === '⬅') {
      if (target === 'membership') setMembershipNumber(prev => prev.slice(0, -1));
      else if (target === 'coupon') setCouponCode(prev => prev.slice(0, -1));
    } else if (typeof value === 'number') {
      if (target === 'membership' && membershipNumber.length < 15) { // 예시: 회원 번호 최대 15자리
        setMembershipNumber(prev => prev + value);
      } else if (target === 'coupon' && couponCode.length < 20) { // 예시: 쿠폰 코드 최대 20자리
        setCouponCode(prev => prev + value);
      }
    }
  };

  // 할인/적립 적용 (시뮬레이션)
  const applyDiscount = () => {
    const simulatedDiscount = 500; // 예시로 500원 할인
    setDiscountAppliedAmount(simulatedDiscount);
    setCurrentDisplayPrice(prev => Math.max(0, prev - simulatedDiscount));
    setCurrentStep(4); // 결제 수단 선택 화면으로
  };

  // 쿠폰 적용 (시뮬레이션)
  const applyCoupon = () => {
    const simulatedCoupon = 1000; // 예시로 1000원 쿠폰
    setCouponAppliedAmount(simulatedCoupon);
    setCurrentDisplayPrice(prev => Math.max(0, prev - simulatedCoupon));
    setCurrentStep(4); // 결제 수단 선택 화면으로
  };

  // 모든 상태 초기화 함수
  const resetKiosk = () => {
    setScannedItems([
      { name: '삼각김밥(참치)', price: 1200 },
      { name: '생수 500ml', price: 800 },
      { name: '새우깡', price: 1500 },
    ]);
    setCurrentDisplayPrice(initialCalculatedPrice); // 초기화 시 초기 금액으로 재설정
    setDiscountAppliedAmount(0);
    setCouponAppliedAmount(0);
    setMembershipNumber('');
    setCouponCode('');
    setSelectedFinalPaymentMethod(null);
  };


  return (
    <div className={styles.storeKiosk}>
      {/* GS25 헤더 */}
      <div className={styles.header}>
        <button
          onClick={() => switchScreen('main')}
          className={styles.backButton}
        >
          ← 메인으로
        </button>
        <div className={styles.titleSection}>
          <div className={styles.gs25Logo}>GS25</div>
          <h1 className={styles.title}>셀프 계산대</h1>
        </div>
        <HelpButton 
          showHelp={showHelp} 
          setShowHelp={setShowHelp} 
          helpText={getHelpText()} 
        />
      </div>

      {/* Step 0: 시작 화면 (간편 계산하기 선택) */}
      {currentStep === 0 && (
        <div className={styles.startScreen}>
          <div className={styles.kioskFrame}>
            <div className={styles.topBar}>
              <div className={styles.gs25Badge}>GS25</div>
              <span className={styles.screenTitle}>상품 스캔 / 결제 안내</span> 
            </div>
            
            <div className={styles.mainArea}>
              <div className={styles.welcomeSection}>
                <h2 className={styles.welcomeTitle}>간편 계산하기</h2>
                <p className={styles.instruction}>
                  상품 바코드를 스캔한 후<br/>
                  <strong className={styles.highlightText}>간편 계산하기</strong> 버튼을 눌러주세요
                </p>
              </div>
              
              <div className={styles.scannedItems}>
                <h3>스캔된 상품</h3>
                <div className={styles.itemList}>
                  {scannedItems.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <span>{item.name}</span>
                      <span>{item.price.toLocaleString()}원</span>
                    </div>
                  ))}
                  <div className={styles.totalLine}>
                    <span>합계</span>
                    <span className={styles.totalAmount}>{initialCalculatedPrice.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentStep(1)}
                className={styles.checkoutButton}
              >
                간편 계산하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: 할인/적립 또는 결제 선택 */}
      {currentStep === 1 && (
        <div className={styles.selectionScreen}>
          <div className={styles.kioskFrame}>
            <div className={styles.topBar}>
              <div className={styles.gs25Badge}>GS25</div>
              <span className={styles.screenTitle}>할인/적립 또는 결제</span>
            </div>
            
            <div className={styles.mainArea}>
              <div className={styles.amountDisplay}>
                <p className={styles.guideText}>포인트 할인/적립을 선택하거나 바로 결제하세요.</p> 
                <div className={styles.totalBox}>
                  <span className={styles.totalLabel}>총 결제금액</span>
                  <span className={styles.totalPrice}>{currentDisplayPrice.toLocaleString()}원</span>
                </div>
              </div>
              
              <div className={styles.optionButtons}>
                <button 
                  onClick={() => setCurrentStep(2)} // 할인/적립 화면으로 이동
                  className={styles.optionBtn}>
                  <span className={styles.optionIcon}>🎁</span>
                  <span>할인/적립</span>
                </button>
                <button 
                  onClick={() => setCurrentStep(3)} // 쿠폰사용 화면으로 이동
                  className={styles.optionBtn}>
                  <span className={styles.optionIcon}>🎫</span>
                  <span>쿠폰사용</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)} // 결제 수단 선택 화면으로 바로 이동
                  className={`${styles.optionBtn} ${styles.primaryBtn}`}
                >
                  <span className={styles.optionIcon}>💳</span>
                  <span>바로 결제</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 할인/적립 화면 (신규) */}
      {currentStep === 2 && (
        <div className={styles.discountScreen}>
          <div className={styles.kioskFrame}>
            <div className={styles.topBar}>
              <div className={styles.gs25Badge}>GS25</div>
              <span className={styles.screenTitle}>할인 / 적립</span>
            </div>
            <div className={styles.mainArea}>
              <div className={styles.discountInputSection}>
                <p className={styles.inputGuide}>
                  <span className={styles.inputLabel}>회원 번호 입력 또는 바코드를 스캔해주세요.</span>
                </p>
                <div className={styles.numberDisplay}>{membershipNumber || '회원 번호'}</div>
                {/* 숫자 패드 */}
                <div className={styles.numberPad}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '초기화', 0, '⬅'].map((num, idx) => (
                    <button 
                      key={idx} 
                      className={num === '초기화' ? styles.resetBtn : (num === '⬅' ? styles.backspaceBtn : styles.numBtn)}
                      onClick={() => {
                        if (num === '초기화') setMembershipNumber('');
                        else handleNumberPadInput(num, 'membership');
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button 
                  onClick={applyDiscount} // 할인 적용
                  className={styles.applyBtn}
                >
                  적용하기
                </button>
                <button 
                  onClick={() => setCurrentStep(4)} // 건너뛰기 -> 결제 수단 선택으로
                  className={styles.skipBtn}
                >
                  건너뛰기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 쿠폰 사용 화면 (신규) */}
      {currentStep === 3 && (
        <div className={styles.couponScreen}>
          <div className={styles.kioskFrame}>
            <div className={styles.topBar}>
              <div className={styles.gs25Badge}>GS25</div>
              <span className={styles.screenTitle}>쿠폰 사용</span>
            </div>
            <div className={styles.mainArea}>
              <div className={styles.couponInputSection}>
                <p className={styles.inputGuide}>
                  <span className={styles.inputLabel}>쿠폰 번호 입력 또는 바코드를 스캔해주세요.</span>
                </p>
                <div className={styles.numberDisplay}>{couponCode || '쿠폰 번호'}</div>
                {/* 숫자 패드 */}
                <div className={styles.numberPad}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '초기화', 0, '⬅'].map((num, idx) => (
                    <button 
                      key={idx} 
                      className={num === '초기화' ? styles.resetBtn : (num === '⬅' ? styles.backspaceBtn : styles.numBtn)}
                      onClick={() => {
                        if (num === '초기화') setCouponCode('');
                        else handleNumberPadInput(num, 'coupon');
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.actionButtons}>
                <button 
                  onClick={applyCoupon} // 쿠폰 적용
                  className={styles.applyBtn}
                >
                  적용하기
                </button>
                <button 
                  onClick={() => setCurrentStep(4)} // 건너뛰기 -> 결제 수단 선택으로
                  className={styles.skipBtn}
                >
                  건너뛰기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 결제 수단 선택 (이전의 Step 2) */}
      {currentStep === 4 && (
        <div className={styles.paymentScreen}>
          <div className={styles.kioskFrame}>
            <div className={styles.topBar}>
              <div className={styles.gs25Badge}>GS25</div>
              <span className={styles.screenTitle}>결제 수단 선택</span>
            </div>
            
            <div className={styles.mainArea}>
              <div className={styles.paymentAmount}>
                <div className={styles.amountBox}>
                  <span className={styles.finalAmount}>{currentDisplayPrice.toLocaleString()}원</span>
                  <p className={styles.paymentInstruction}>결제 수단을 선택해주세요</p>
                  {discountAppliedAmount > 0 && <p className={styles.appliedInfo}>할인 적용: -{discountAppliedAmount.toLocaleString()}원</p>}
                  {couponAppliedAmount > 0 && <p className={styles.appliedInfo}>쿠폰 적용: -{couponAppliedAmount.toLocaleString()}원</p>}
                </div>
              </div>
              
              <div className={styles.paymentGrid}>
                <button
                  onClick={() => { setSelectedFinalPaymentMethod('card'); setCurrentStep(5); }}
                  className={styles.paymentMethod}
                >
                  <div className={styles.methodIcon}>💳</div>
                  <span className={styles.methodLabel}>카드결제</span>
                </button>
                <button
                  onClick={() => { setSelectedFinalPaymentMethod('pay'); setCurrentStep(5); }}
                  className={styles.paymentMethod}
                >
                  <div className={styles.methodIcon}>📱</div>
                  <span className={styles.methodLabel}>페이결제</span>
                </button>
                <button
                  onClick={() => { setSelectedFinalPaymentMethod('cash'); setCurrentStep(5); }}
                  className={styles.paymentMethod}
                >
                  <div className={styles.methodIcon}>💰</div>
                  <span className={styles.methodLabel}>현금결제</span>
                </button>
                <button
                  onClick={() => { setSelectedFinalPaymentMethod('voucher'); setCurrentStep(5); }}
                  className={styles.paymentMethod}
                >
                  <div className={styles.methodIcon}>🎁</div>
                  <span className={styles.methodLabel}>상품권</span>
                </button>
                <button
                  onClick={() => { setSelectedFinalPaymentMethod('gs_pay'); setCurrentStep(5); }}
                  className={styles.paymentMethod}
                >
                  <div className={styles.methodIcon}><span className={styles.gsLogoText}>GS</span></div>
                  <span className={styles.methodLabel}>GS Pay</span>
                </button>
                <button
                  onClick={() => { setSelectedFinalPaymentMethod('membership'); setCurrentStep(5); }}
                  className={styles.paymentMethod}
                >
                  <div className={styles.methodIcon}>⭐</div>
                  <span className={styles.methodLabel}>멤버십 포인트</span>
                </button>
                <button
                  onClick={() => { setSelectedFinalPaymentMethod('other'); setCurrentStep(5); }}
                  className={styles.paymentMethod}
                >
                  <div className={styles.methodIcon}>...</div>
                  <span className={styles.methodLabel}>기타결제</span>
                </button>
                <button
                  onClick={() => setCurrentStep(1)} // 이전 화면으로 돌아가기 (선택 화면으로)
                  className={`${styles.paymentMethod} ${styles.cancelMethod}`}
                >
                  <div className={styles.methodIcon}>✖</div>
                  <span className={styles.methodLabel}>취소</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: 결제 진행 화면 (이전의 Step 3) - 선택된 결제 수단에 따라 동적 내용 */}
      {currentStep === 5 && (
        <div className={styles.paymentProcessingScreen}>
          <div className={styles.kioskFrame}>
            <div className={styles.topBar}>
              <div className={styles.gs25Badge}>GS25</div>
              <span className={styles.screenTitle}>
                {selectedFinalPaymentMethod === 'card' && '카드 결제 진행'}
                {selectedFinalPaymentMethod === 'pay' && '페이 결제 진행'}
                {selectedFinalPaymentMethod === 'cash' && '현금 결제 진행'}
                {selectedFinalPaymentMethod === 'voucher' && '상품권 결제 진행'}
                {selectedFinalPaymentMethod === 'gs_pay' && 'GS Pay 결제 진행'}
                {selectedFinalPaymentMethod === 'membership' && '멤버십 결제 진행'}
                {selectedFinalPaymentMethod === 'other' && '기타 결제 진행'}
                {!selectedFinalPaymentMethod && '결제 진행'}
              </span>
            </div>
            
            <div className={styles.mainArea}>
              <div className={styles.paymentDetails}>
                <div className={styles.paymentIcon}>
                  {selectedFinalPaymentMethod === 'card' && '💳'}
                  {selectedFinalPaymentMethod === 'pay' && '📱'}
                  {selectedFinalPaymentMethod === 'cash' && '💰'}
                  {selectedFinalPaymentMethod === 'voucher' && '🎁'}
                  {selectedFinalPaymentMethod === 'gs_pay' && <span className={styles.gsLogoText}>GS</span>} 
                  {selectedFinalPaymentMethod === 'membership' && '⭐'}
                  {selectedFinalPaymentMethod === 'other' && '...'}
                  {!selectedFinalPaymentMethod && '💸'} 
                </div>
                <h2 className={styles.paymentMethodTitle}>
                  {selectedFinalPaymentMethod === 'card' && '카드를 단말기에 올려주세요'}
                  {selectedFinalPaymentMethod === 'pay' && '앱을 실행하여 결제해주세요'}
                  {selectedFinalPaymentMethod === 'cash' && '현금을 투입구에 넣어주세요'}
                  {selectedFinalPaymentMethod === 'voucher' && '상품권의 바코드를 스캔하거나 번호를 입력해주세요'}
                  {selectedFinalPaymentMethod === 'gs_pay' && 'GS Pay 앱을 실행하여 화면을 스캔해주세요.'}
                  {selectedFinalPaymentMethod === 'membership' && '멤버십 카드 또는 바코드를 리더기에 스캔해주세요.'}
                  {selectedFinalPaymentMethod === 'other' && '자세한 내용은 직원에게 문의해주세요.'}
                  {!selectedFinalPaymentMethod && '잠시만 기다려주세요.'}
                </h2>
                <p className={styles.instructionText}>
                  {selectedFinalPaymentMethod === 'card' && 'IC칩 방향에 맞춰 끝까지 넣어주세요.'}
                  {selectedFinalPaymentMethod === 'pay' && '화면에 표시된 QR코드를 스캔해주세요.'}
                  {selectedFinalPaymentMethod === 'cash' && '잔돈은 자동으로 반환됩니다.'}
                  {selectedFinalPaymentMethod === 'voucher' && '상품권의 바코드를 스캔하거나 번호를 입력해주세요.'}
                  {selectedFinalPaymentMethod === 'gs_pay' && 'GS Pay 앱을 실행하여 화면을 스캔해주세요.'}
                  {selectedFinalPaymentMethod === 'membership' && '멤버십 카드 또는 바코드를 리더기에 스캔해주세요.'}
                  {selectedFinalPaymentMethod === 'other' && '자세한 내용은 직원에게 문의해주세요.'}
                  {!selectedFinalPaymentMethod && '잠시만 기다려주세요.'}
                </p>
                <div className={styles.progressBar}>
                  <div className={styles.progress}></div>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentStep(6)}
                className={styles.completeBtn}
              >
                결제 완료 (시뮬레이션)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: 결제 완료 (이전의 Step 4) */}
      {currentStep === 6 && (
        <div className={styles.completeScreen}>
          <div className={styles.kioskFrame}>
            <div className={styles.topBar}>
              <div className={styles.gs25Badge}>GS25</div>
              <span className={styles.screenTitle}>결제 완료</span>
            </div>
            
            <div className={styles.mainArea}>
              <div className={styles.completeMessage}>
                <div className={styles.completeIcon}>✅</div>
                <h2 className={styles.completeTitle}>결제 완료</h2>
                <div className={styles.completeInfo}>
                  <p className={styles.amount}>결제금액: {initialCalculatedPrice.toLocaleString()}원</p>
                  {discountAppliedAmount > 0 && <p className={styles.appliedInfo}>할인 적용: -{discountAppliedAmount.toLocaleString()}원</p>}
                  {couponAppliedAmount > 0 && <p className={styles.appliedInfo}>쿠폰 적용: -{couponAppliedAmount.toLocaleString()}원</p>}
                  <p className={styles.message}>영수증을 출력해드리겠습니다</p>
                  <p className={styles.thanks}>감사합니다!</p>
                </div>
                <div className={styles.completeButtons}>
                  <button
                    onClick={() => { 
                      setCurrentStep(0);
                      resetKiosk(); // 모든 상태 초기화
                    }}
                    className={styles.newButton}
                  >
                    새 계산하기
                  </button>
                  <button
                    onClick={() => switchScreen('main')}
                    className={styles.backButton}
                  >
                    메인으로 돌아가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}