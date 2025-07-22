'use client'

import { useState } from 'react'
import styles from '@/styles/BusKiosk.module.scss'
import HelpButton from './HelpButton'

interface BusKioskProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  switchScreen: (screen: string) => void
}

export default function BusKiosk({ 
  currentStep, setCurrentStep, showHelp, setShowHelp, switchScreen 
}: BusKioskProps) {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [passengerCount, setPassengerCount] = useState(1)
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null) // 선택된 좌석 번호
  const [ticketPrice, setTicketPrice] = useState(0); // 임시 티켓 가격

  const cities = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '수원',
    '창원', '성남', '고양', '용인', '부천', '안산', '안양', '남양주',
    '세종', '천안', '목포', '여수', '제주' // 더미 도시 추가
  ].sort((a,b) => a.localeCompare(b, 'ko-KR')); // 가나다순 정렬

  // 각 스텝별 도움말
  const getHelpText = () => {
    const helpTexts: Record<number, string> = {
      0: "현장 발권 또는 예매 발권을 선택해주세요.",
      1: "출발지와 도착지를 선택해주세요. 지역 탭을 이용할 수 있습니다.",
      2: "승객 수를 선택하고 '좌석 선택' 버튼을 눌러주세요.",
      3: "버스 좌석 배치도에서 원하는 좌석을 선택하고 '결제하기' 버튼을 눌러주세요.",
      4: "결제 방법을 선택하고 결제를 완료해주세요.",
      5: "발권이 완료되었습니다. 승차권을 가져가세요."
    }
    return helpTexts[currentStep] || "화면을 터치해주세요"
  }

  // 도시 선택 모드 (이미지에 없지만 기능 구현을 위해)
  const [citySelectionMode, setCitySelectionMode] = useState<'departure' | 'destination'>('departure');
  const [activeRegionTab, setActiveRegionTab] = useState<'all' | 'capital' | 'chungcheong' | 'gyeongsang' | 'jeolla'>('all'); // 지역 탭

  // 좌석 맵 데이터 (2+1 배열)
  const seatMap = [
    // 2+1 배치 예시: 1-2, 3-4, 5-6, 7-8-9, 10-11-12, ...
    // 'D'는 운전석/통로쪽 좌석, 'W'는 창가쪽 좌석
    {number: 1, type: 'D'}, {number: 2, type: 'W'}, {number: 3, type: 'D'},
    {number: 4, type: 'W'}, {number: 5, type: 'D'}, {number: 6, type: 'W'},
    {number: 7, type: 'D'}, {number: 8, type: 'W'}, {number: 9, type: 'D'},
    {number: 10, type: 'W'}, {number: 11, type: 'D'}, {number: 12, type: 'W'},
    {number: 13, type: 'D'}, {number: 14, type: 'W'}, {number: 15, type: 'D'},
    {number: 16, type: 'W'}, {number: 17, type: 'D'}, {number: 18, type: 'W'},
    {number: 19, type: 'D'}, {number: 20, type: 'W'}, {number: 21, type: 'D'},
    {number: 22, type: 'W'}, {number: 23, type: 'D'}, {number: 24, type: 'W'},
    {number: 25, type: 'D'}, {number: 26, type: 'W'}, {number: 27, type: 'D'},
    {number: 28, type: 'W'}
  ];

  // 임시 가격 계산 로직 (실제는 출발지/도착지/등급에 따라 달라짐)
  const calculateTicketPrice = (passengers: number = passengerCount) => {
    // 예시: 서울-부산 1인 15800원
    if (departure === '서울' && destination === '부산') {
        return 15800 * passengers;
    } else if (departure === '서울' && destination === '대전') {
        return 10000 * passengers;
    }
    return 12000 * passengers; // 기본 가격
  };

  // 노선 선택 후 좌석 선택 버튼 활성화 조건
  const isRouteSelected = departure && destination && departure !== destination;

  // 좌석 선택 후 결제하기 버튼 활성화 조건
  const isSeatSelected = selectedSeat !== null;

  return (
    <div className={styles.busKiosk}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button
          onClick={() => switchScreen('main')}
          className={styles.backButton}
        >
          ← 메인으로
        </button>
        <h1 className={styles.title}>고속버스 예매</h1>
        <HelpButton 
          showHelp={showHelp} 
          setShowHelp={setShowHelp} 
          helpText={getHelpText()} 
        />
      </div>

      {/* Step 0: 예매 방법 선택 - image_cff676.jpg (왼쪽) */}
      {currentStep === 0 && (
        <div className={styles.methodScreen}>
          <div className={styles.container}>
            <h2 className={styles.screenTitle}>승차권 자동 발매기</h2>
            <p className={styles.subtitleText}>원하시는 서비스를 선택해주세요</p>
            
            <div className={styles.methodOptionsGrid}>
              <button
                onClick={() => setCurrentStep(1)}
                className={styles.methodOptionButton}
              >
                <div className={styles.methodIcon}>🎟️</div> {/* 아이콘 변경 */}
                <div className={styles.methodName}>현장 발권</div>
                <div className={styles.methodDesc}>바로 승차할 수 있는<br/>승차권을 발급받습니다</div>
              </button>
              
              <button
                onClick={() => setCurrentStep(1)}
                className={styles.methodOptionButton}
              >
                <div className={styles.methodIcon}>🗓️</div> {/* 아이콘 변경 */}
                <div className={styles.methodName}>예매 발권</div>
                <div className={styles.methodDesc}>미리 예매한<br/>승차권을 발급받습니다</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: 노선 선택 (출발지/도착지 선택) - image_cff676.jpg (오른쪽) */}
      {currentStep === 1 && (
        <div className={styles.routeSelectionScreen}>
          <div className={styles.container}>
            <h2 className={styles.screenTitle}>지역 선택</h2> {/* 이미지에 '지역 선택'이라고 되어있음 */}
            
            <div className={styles.routeHeader}>
              <button 
                className={`${styles.departureButton} ${citySelectionMode === 'departure' ? styles.active : ''}`}
                onClick={() => setCitySelectionMode('departure')}
              >
                출발지: {departure || '선택'}
              </button>
              <span className={styles.arrowIcon}>→</span>
              <button 
                className={`${styles.destinationButton} ${citySelectionMode === 'destination' ? styles.active : ''}`}
                onClick={() => setCitySelectionMode('destination')}
              >
                도착지: {destination || '선택'}
              </button>
            </div>

            <div className={styles.cityTabs}>
              <button 
                className={`${styles.cityTabButton} ${activeRegionTab === 'all' ? styles.active : ''}`}
                onClick={() => setActiveRegionTab('all')}
              >
                전체
              </button>
              <button 
                className={`${styles.cityTabButton} ${activeRegionTab === 'capital' ? styles.active : ''}`}
                onClick={() => setActiveRegionTab('capital')}
              >
                수도권
              </button>
              <button 
                className={`${styles.cityTabButton} ${activeRegionTab === 'chungcheong' ? styles.active : ''}`}
                onClick={() => setActiveRegionTab('chungcheong')}
              >
                충청권
              </button>
              <button 
                className={`${styles.cityTabButton} ${activeRegionTab === 'gyeongsang' ? styles.active : ''}`}
                onClick={() => setActiveRegionTab('gyeongsang')}
              >
                경상권
              </button>
              <button 
                className={`${styles.cityTabButton} ${activeRegionTab === 'jeolla' ? styles.active : ''}`}
                onClick={() => setActiveRegionTab('jeolla')}
              >
                전라권
              </button>
            </div>

            <div className={styles.cityGrid}>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    if (citySelectionMode === 'departure') {
                      setDeparture(city);
                      setCitySelectionMode('destination'); // 출발지 선택 후 도착지 모드로 자동 전환
                    } else { // destination
                      setDestination(city);
                    }
                  }}
                  className={`${styles.cityButton} 
                    ${(departure === city || destination === city) ? styles.selected : ''}
                    ${(citySelectionMode === 'departure' && city === destination) || 
                      (citySelectionMode === 'destination' && city === departure) ? styles.disabled : ''}`}
                  disabled={(citySelectionMode === 'departure' && city === destination) || // 이미 도착지로 선택된 경우 출발지 선택 불가
                            (citySelectionMode === 'destination' && city === departure)} // 이미 출발지로 선택된 경우 도착지 선택 불가
                >
                  {city}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setTicketPrice(calculateTicketPrice()); // 현재 선택된 경로의 가격 계산
                setCurrentStep(2); // 승객 선택 화면으로
              }}
              className={styles.nextStepButton}
              disabled={!isRouteSelected} // 출발지, 도착지 모두 선택되어야 활성화
            >
              다음 단계로
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 승객 선택 - image_cff63d.png (왼쪽) */}
      {currentStep === 2 && (
        <div className={styles.passengerScreen}>
          <div className={styles.container}>
            <h2 className={styles.screenTitle}>승객 선택</h2>
            
            <div className={styles.tripSummaryHeader}>
                <span className={styles.summaryDepartureArrival}>{departure} → {destination}</span>
                <span className={styles.summaryPrice}>{calculateTicketPrice().toLocaleString()}원</span>
            </div>

            <div className={styles.passengerCountControl}>
              <button onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))} className={styles.countButton}>-</button>
              <span className={styles.passengerNumber}>{passengerCount}</span>
              <button onClick={() => setPassengerCount(passengerCount + 1)} className={styles.countButton}>+</button>
            </div>
            
            <button
              onClick={() => setCurrentStep(3)} // 좌석 선택 화면으로
              className={styles.selectSeatButton}
            >
              좌석 선택
            </button>
          </div>
        </div>
      )}

      {/* Step 3: 좌석 선택 - image_cff63d.png (오른쪽) */}
      {currentStep === 3 && (
        <div className={styles.seatSelectionScreen}>
          <div className={styles.container}>
            <h2 className={styles.screenTitle}>좌석 선택</h2>
            
            <div className={styles.seatMapLayout}>
              <div className={styles.busFront}>
                <span className={styles.driverSeat}>운전석</span>
              </div>
              <div className={styles.seatGrid}>
                {seatMap.map((seat) => (
                  <button
                    key={seat.number}
                    onClick={() => setSelectedSeat(seat.number.toString())}
                    disabled={seat.number === 7 || seat.number === 13} // 예시: 7, 13번 좌석은 이미 예약됨
                    className={`${styles.seatButton} 
                                ${selectedSeat === seat.number.toString() ? styles.selected : ''}
                                ${seat.number === 7 || seat.number === 13 ? styles.occupied : styles.available}`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.seatLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.available}`}></div>
                <span>선택 가능</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.occupied}`}></div>
                <span>예약 완료</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.selected}`}></div>
                <span>선택 좌석</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(4)} // 결제 화면으로
              className={styles.proceedToPaymentButton}
              disabled={!isSeatSelected} // 좌석이 선택되어야 활성화
            >
              결제하기
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 결제 화면 (이미지에 없으므로 일반적인 결제 UI) */}
      {currentStep === 4 && (
        <div className={styles.paymentScreen}>
          <div className={styles.container}>
            <h2 className={styles.screenTitle}>결제 방법 선택</h2>
            
            <div className={styles.finalSummary}>
              <p>{departure} → {destination}</p>
              <p>{passengerCount}명 / {selectedSeat ? `${selectedSeat}번 좌석` : '좌석 선택됨'}</p>
              <p className={styles.totalPayment}>총 {calculateTicketPrice().toLocaleString()}원</p>
            </div>

            <div className={styles.paymentOptionsGrid}>
              <button onClick={() => setCurrentStep(5)} className={styles.paymentMethodButton}>
                <span className={styles.paymentMethodIcon}>💳</span>
                <span className={styles.paymentMethodText}>신용카드</span>
              </button>
              <button onClick={() => setCurrentStep(5)} className={styles.paymentMethodButton}>
                <span className={styles.paymentMethodIcon}>📱</span>
                <span className={styles.paymentMethodText}>모바일페이</span>
              </button>
              <button onClick={() => setCurrentStep(5)} className={styles.paymentMethodButton}>
                <span className={styles.paymentMethodIcon}>💰</span>
                <span className={styles.paymentMethodText}>현금</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: 결제 완료 화면 */}
      {currentStep === 5 && (
        <div className={styles.completeScreen}>
          <div className={styles.container}>
            <h2 className={styles.screenTitle}>결제 완료!</h2>
            <div className={styles.completeMessage}>
              <div className={styles.checkIcon}>✅</div>
              <p className={styles.ticketIssuedText}>승차권이 발권되었습니다.</p>
              <p className={styles.finalInstructions}>아래에서 승차권을 가져가세요.</p>
            </div>

            <div className={styles.orderSummary}>
              <p>{departure} → {destination}</p>
              <p>{passengerCount}명 / {selectedSeat ? `${selectedSeat}번 좌석` : '좌석 선택됨'}</p>
              <p className={styles.finalPriceSummary}>총 {calculateTicketPrice().toLocaleString()}원</p>
            </div>

            <div className={styles.actionButtons}>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setDeparture('');
                  setDestination('');
                  setPassengerCount(1);
                  setSelectedSeat(null);
                  setTicketPrice(0);
                  setCitySelectionMode('departure');
                  setActiveRegionTab('all');
                }}
                className={styles.newPurchaseButton}
              >
                새로 구매하기
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