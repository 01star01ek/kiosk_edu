'use client'

import { useState, useEffect } from 'react'
import styles from '@/styles/ItxKiosk.module.scss'
import HelpButton from './HelpButton'

interface TrainKioskProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  switchScreen: (screen: string) => void
}

export default function TrainKiosk({ 
  currentStep, setCurrentStep, showHelp, setShowHelp, switchScreen 
}: TrainKioskProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [departure, setDeparture] = useState(''); // 출발역 초기값 비움
  const [destination, setDestination] = useState(''); // 도착역 초기값 비움
  const [passengerCount, setPassengerCount] = useState(1);
  const [ticketPricePerPerson, setTicketPricePerPerson] = useState(0); // 가격 초기값 0

  const [activeStationTab, setActiveStationTab] = useState<'major' | 'region'>('major');
  const [selectingStationType, setSelectingStationType] = useState<'departure' | 'destination'>('departure'); // 현재 어떤 역을 선택 중인지

  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const [showLoadingSearch, setShowLoadingSearch] = useState(false);
  const [showPostPaymentAccumulate, setShowPostPaymentAccumulate] = useState(false);

  // ITX 역 목록 (이미지 및 일반적인 ITX-청춘 노선 반영)
  const allItxStations = [
    '남춘천', '춘천', '가평', '평내호평', '청량리', '용산',
    '천안', '대전', '대구', '부산', '광주', '목포', '강릉', '동해', // 지역 예시 포함
    '서울', '수원', '영등포', '대전', '동대구', '부산', '광주송정', '목포', '강릉', '여수엑스포' // 더 많은 역
  ].sort((a, b) => a.localeCompare(b, 'ko-KR'));

  // 주요역과 지역역을 구분 (예시, 실제 데이터는 백엔드에서 받아올 수 있음)
  const majorStations = allItxStations.filter(st => ['남춘천', '춘천', '가평', '평내호평', '청량리', '용산', '서울'].includes(st));
  const regionalStations = allItxStations.filter(st => !['남춘천', '춘천', '가평', '평내호평', '청량리', '용산', '서울'].includes(st));


  // 가격 계산 함수 (임시)
  const calculatePrice = (dep: string, dest: string) => {
    if (!dep || !dest || dep === dest) return 0;
    // 실제로는 역 간 거리에 따른 복잡한 계산이 필요하지만, 여기서는 단순화
    const basePrice = 7900; // 남춘천-용산 기준
    const distanceFactor = Math.abs(allItxStations.indexOf(dep) - allItxStations.indexOf(dest)) / 5;
    return Math.max(basePrice, Math.round(basePrice * (1 + distanceFactor * 0.5) / 100) * 100); // 100원 단위 반올림
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // 출발역 또는 도착역이 변경될 때마다 가격을 다시 계산
    if (departure && destination) {
      setTicketPricePerPerson(calculatePrice(departure, destination));
    } else {
      setTicketPricePerPerson(0);
    }
  }, [departure, destination]);

  const getHelpText = () => {
    const helpTexts: Record<number, string> = {
      0: "원하는 승차권 관련 서비스를 선택하세요. 승차권 구매를 눌러주세요.",
      1: "출발역 또는 도착역을 선택하세요. '주요역' 또는 '지역' 탭에서 선택 후 '열차 조회하기'를 누르세요.",
      2: "조회된 열차 정보와 좌석을 선택하고, 다음 단계로 넘어가세요.",
      3: "결제 방법을 선택하고 결제를 진행하세요.",
      4: "코레일 이용 실적을 적립하시겠습니까? 선택 후 다음 단계로 넘어가세요.",
      5: "결제가 완료되었습니다. 승차권을 가져가세요."
    };
    return helpTexts[currentStep] || "화면을 터치해주세요";
  };

  // 역 선택 버튼 클릭 시
  const handleStationSelection = (station: string) => {
    if (selectingStationType === 'departure') {
      if (station === destination) {
        alert("출발역과 도착역은 같을 수 없습니다.");
        return;
      }
      setDeparture(station);
      setSelectingStationType('destination'); // 출발역 선택 후 자동으로 도착역 선택 모드로 전환
    } else { // selectingStationType === 'destination'
      if (station === departure) {
        alert("출발역과 도착역은 같을 수 없습니다.");
        return;
      }
      setDestination(station);
    }
  };

  const searchTrain = () => {
    if (!departure || !destination || departure === destination) {
      alert("출발역과 도착역을 정확히 선택해주세요.");
      return;
    }
    setShowLoadingSearch(true);
    setTimeout(() => {
      setShowLoadingSearch(false);
      setCurrentStep(2);
    }, 1500);
  };

  const handlePaymentComplete = () => {
    setShowPostPaymentAccumulate(true);
  };

  const handleAccumulateChoice = (choice: 'yes' | 'no') => {
    setShowPostPaymentAccumulate(false);
    setCurrentStep(5);
  };

  return (
    <div className={styles.itxKiosk}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button
          onClick={() => switchScreen('main')}
          className={styles.backButton}
        >
          ← 메인으로
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.korailLogo}>KORAIL</span>
          <span className={styles.currentTime}>{currentTime}</span>
        </div>
        <HelpButton 
          showHelp={showHelp} 
          setShowHelp={setShowHelp} 
          helpText={getHelpText()} 
        />
      </div>

      {/* Step 0: 메뉴 선택 */}
      {currentStep === 0 && (
        <div className={styles.mainMenuScreen}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>원하시는 서비스를 선택하세요</h2>
            
            <div className={styles.menuGrid}>
              <button
                onClick={() => setCurrentStep(1)}
                className={styles.menuButton}
              >
                <span className={styles.menuIcon}>≫</span>
                <span className={styles.menuText}>승차권 구매</span>
              </button>
              
              <button className={styles.menuButton}>
                <span className={styles.menuIcon}>⊙</span>
                <span className={styles.menuText}>승차권 환불</span>
              </button>
              
              <button className={styles.menuButton}>
                <span className={styles.menuIcon}>🔍</span>
                <span className={styles.menuText}>예약표 찾기</span>
              </button>
              
              <button className={styles.menuButton}>
                <span className={styles.menuIcon}>◎</span>
                <span className={styles.menuText}>예약 취소</span>
              </button>
            </div>

            <div className={styles.footerButtons}>
              <button className={styles.langButton}>English</button>
              <button className={styles.langButton}>한국어</button>
              <button className={styles.receiptButton}>
                <span className={styles.receiptIcon}>🗑️</span>
                영수증 출력
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: 역 선택 */}
      {currentStep === 1 && (
        <div className={styles.stationSelectionScreen}>
          <div className={styles.container}>
            <div className={styles.stationSelectHeader}>
              <div 
                className={`${styles.departureStationDisplay} ${selectingStationType === 'departure' ? styles.active : ''}`}
                onClick={() => setSelectingStationType('departure')}
              >
                <span className={styles.displayLabel}>출발역</span>
                <span className={styles.displayValue}>{departure || '선택'}</span>
              </div>
              <div className={styles.centerArrow}>→</div>
              <div 
                className={`${styles.arrivalStationDisplay} ${selectingStationType === 'destination' ? styles.active : ''}`}
                onClick={() => setSelectingStationType('destination')}
              >
                <span className={styles.displayLabel}>도착역</span>
                <span className={styles.displayValue}>{destination || '선택'}</span>
              </div>
              <div className={styles.dateAndKtxInfo}>
                <span className={styles.dateInfo}>2025년 05월 02일 (금)</span>
                <span className={styles.ktxInfo}>KTX</span>
              </div>
            </div>

            <div className={styles.stationMainContent}>
              <div className={styles.stationTabContainer}>
                <button 
                  className={`${styles.stationTabButton} ${activeStationTab === 'major' ? styles.active : ''}`}
                  onClick={() => setActiveStationTab('major')}
                >
                  주요역
                </button>
                <button 
                  className={`${styles.stationTabButton} ${activeStationTab === 'region' ? styles.active : ''}`}
                  onClick={() => setActiveStationTab('region')}
                >
                  지역
                </button>
                <div className={styles.searchStationInput}>
                    역 이름을 찾기 🔍
                </div>
              </div>

              <div className={styles.stationListGridContainer}>
                {(activeStationTab === 'major' ? majorStations : regionalStations).map((station) => (
                    <button
                        key={station}
                        className={`${styles.stationGridButton} 
                                   ${(selectingStationType === 'departure' && departure === station) || 
                                     (selectingStationType === 'destination' && destination === station) ? styles.selected : ''}
                                   ${(selectingStationType === 'departure' && station === destination) || 
                                     (selectingStationType === 'destination' && station === departure) ? styles.disabled : ''}
                                  `}
                        onClick={() => handleStationSelection(station)}
                        disabled={(selectingStationType === 'departure' && station === destination) || 
                                  (selectingStationType === 'destination' && station === departure)}
                    >
                        {station}
                    </button>
                ))}
              </div>
            </div>

            <button 
              onClick={searchTrain} 
              className={styles.searchTrainButton}
              disabled={!departure || !destination || departure === destination}
            >
              열차 조회하기
            </button>
          </div>

          {/* 안내 메시지 팝업 (image_dca91e.jpg 좌측) */}
          {showInfoMessage && (
            <div className={styles.overlay}>
              <div className={styles.infoModal}>
                <p className={styles.infoMessageTitle}>ITX-청춘</p>
                <p className={styles.infoMessageContent}>ITX-청춘 이용 고객은 승차권 확인 QR코드로<br/>게이트를 열거나, 직원이 확인 후 개표합니다.<br/>핸드폰을 확인해주세요.</p>
                <button onClick={() => setShowInfoMessage(false)} className={styles.confirmButton}>확인</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: 열차/좌석 조회 화면 */}
      {currentStep === 2 && (
        <div className={styles.trainSearchScreen}>
          <div className={styles.container}>
            <div className={styles.summaryHeader}>
              <p className={styles.summaryJourney}>어딜(ITX-청춘) 이용하시면 더욱 편리하게 이용하실 수 있습니다!</p>
              <p className={styles.summaryDepartureArrival}>{departure} → {destination}</p>
              <p className={styles.summaryTimeDate}>05월 02일 (금) 오후 {currentTime}</p>
            </div>

            {showLoadingSearch ? (
              <div className={styles.loadingSection}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>처리중</p>
              </div>
            ) : (
              <div className={styles.searchResults}>
                <table className={styles.trainResultTable}>
                  <thead>
                    <tr>
                      <th>회차</th>
                      <th>출발</th>
                      <th>도착</th>
                      <th>열차명</th>
                      <th>매진</th>
                      <th>선택</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>16:00</td>
                      <td>17:00</td>
                      <td>ITX-청춘</td>
                      <td>✔</td>
                      <td><button className={styles.selectSeatButton} disabled>매진</button></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>17:00</td>
                      <td>18:00</td>
                      <td>ITX-청춘</td>
                      <td></td>
                      <td><button onClick={() => setCurrentStep(3)} className={styles.selectSeatButton}>좌석선택</button></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>18:00</td>
                      <td>19:00</td>
                      <td>ITX-청춘</td>
                      <td>✔</td>
                      <td><button className={styles.selectSeatButton} disabled>매진</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            <div className={styles.actionNavButtons}>
              <button onClick={() => setCurrentStep(1)} className={styles.navButton}>이전</button>
              <button onClick={() => setCurrentStep(0)} className={styles.navButton}>취소</button>
              <button 
                onClick={() => setCurrentStep(3)}
                className={`${styles.navButton} ${styles.confirmNavButton}`}
                disabled={showLoadingSearch}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 결제 방법 선택 */}
      {currentStep === 3 && (
        <div className={styles.paymentMethodSelectionScreen}>
          <div className={styles.container}>
            <div className={styles.paymentHeader}>
              <span className={styles.paymentHeaderTitle}>결제방법을 선택하십시오.</span>
              <span className={styles.paymentCurrentTime}>{currentTime}</span>
            </div>

            <div className={styles.ticketSummaryDetail}>
              <p className={styles.summaryRoutePrice}>{departure} (17:47 출발) → {destination} (18:50 도착) / D-좌석</p>
              <p className={styles.summaryCount}>어른 1명</p>
              <p className={styles.summaryFare}>기본운임 {ticketPricePerPerson.toLocaleString()} 원</p>
              <div className={styles.totalPaymentDisplay}>
                <span>총 결제금액</span>
                <span className={styles.finalAmountText}>{(ticketPricePerPerson * passengerCount).toLocaleString()} 원</span>
              </div>
            </div>

            <div className={styles.paymentOptionsGrid}>
              <button onClick={handlePaymentComplete} className={styles.paymentOptionButton}>
                <span className={styles.optionText}>신용카드</span>
              </button>
              <button onClick={handlePaymentComplete} className={styles.paymentOptionButton}>
                <span className={styles.optionText}>현금</span>
              </button>
              <button onClick={handlePaymentComplete} className={styles.paymentOptionButton}>
                <span className={styles.optionText}>마일리지</span>
              </button>
            </div>
          </div>
          {/* 결제 후 적립 팝업 */}
          {showPostPaymentAccumulate && (
            <div className={styles.overlay}>
              <div className={styles.accumulateModal}>
                <p className={styles.accumulateMessageTitle}>적립 확인</p>
                <p className={styles.accumulateMessage}>코레일 멤버십 이용실적을 적립하시겠습니까?</p>
                <p className={styles.accumulateInfo}>'아니오'를 선택하시면 수수료가 부과됩니다.</p>
                <div className={styles.accumulateButtons}>
                  <button onClick={() => handleAccumulateChoice('yes')} className={styles.accumulateYes}>예</button>
                  <button onClick={() => handleAccumulateChoice('no')} className={styles.accumulateNo}>아니오</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: 결제 완료 */}
      {currentStep === 5 && (
        <div className={styles.finalCompleteScreen}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>발권이 완료되었습니다!</h2>
            <div className={styles.completeSummary}>
              <span className={styles.completeTicketIcon}>🎫</span>
              <p className={styles.completeSummaryText}>탑승 정보: {departure} → {destination}</p>
              <p className={styles.completeSummaryText}>매수: {passengerCount}매</p>
              <p className={styles.completeSummaryPrice}>총 결제금액: {(ticketPricePerPerson * passengerCount).toLocaleString()}원</p>
            </div>
            <p className={styles.instructionMessage}>발매된 승차권을 가져가세요.</p>
            
            <div className={styles.finalActionButtons}>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setDeparture(''); // 초기화
                  setDestination(''); // 초기화
                  setPassengerCount(1);
                  setTicketPricePerPerson(0);
                  setActiveStationTab('major');
                  setSelectingStationType('departure'); // 초기 선택 모드
                  setShowInfoMessage(false);
                  setShowLoadingSearch(false);
                  setShowPostPaymentAccumulate(false);
                }}
                className={styles.resetPurchaseButton}
              >
                새로운 승차권 구매
              </button>
              <button onClick={() => switchScreen('main')} className={styles.backToMainButton}>
                메인 화면으로
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}