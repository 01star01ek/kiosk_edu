'use client'

import { useState, useEffect, useRef } from 'react'
import styles from '@/styles/CoffeeKiosk.module.scss'
import HelpButton from './HelpButton'

interface CoffeeKioskProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  selectedItems: any[]
  setSelectedItems: (items: any[]) => void
  totalPrice: number
  setTotalPrice: (price: number) => void
  quantity: number
  setQuantity: (qty: number) => void 
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  switchScreen: (screen: string) => void
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  options?: {
    sizes?: { name: string; priceMultiplier: number }[];
    temperatures?: string[];
  };
}

interface SelectedOrderItem {
    id: number;
    name: string;
    basePrice: number;
    quantity: number;
    temperature: string;
    size: string;
    price: number; // 최종 가격
    disposableFeeAdded?: boolean; // 일회용컵 사용 여부
}

export default function CoffeeKiosk({ 
  currentStep, setCurrentStep, selectedItems, setSelectedItems, 
  totalPrice, setTotalPrice, quantity, setQuantity, showHelp, setShowHelp, switchScreen 
}: CoffeeKioskProps) {
  const coffeeMenu: MenuItem[] = [
    { id: 1, name: '아메리카노', price: 2000, image: '/images/americano.jpg', options: { temperatures: ['ICE', 'HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}, {name: 'Mega', priceMultiplier: 1.2}, {name: 'King', priceMultiplier: 1.5}]} },
    { id: 2, name: '카페라떼', price: 2500, image: '/images/cafelatte.jpg', options: { temperatures: ['ICE', 'HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}, {name: 'Mega', priceMultiplier: 1.2}]} },
    { id: 3, name: '카푸치노', price: 2800, image: '/images/cappuccino.jpg', options: { temperatures: ['HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}]} }, 
    { id: 4, name: '바닐라라떼', price: 3000, image: '/images/vanillalatte.jpg', options: { temperatures: ['ICE', 'HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}]} },
    { id: 5, name: '에스프레소', price: 1800, image: '/images/espresso.jpg', options: { temperatures: ['HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}]} },
    { id: 6, name: '마끼아또', price: 2900, image: '/images/macchiato.jpg', options: { temperatures: ['ICE', 'HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}]} },
    { id: 7, name: '모카라떼', price: 3200, image: '/images/moccalatte.jpg', options: { temperatures: ['ICE', 'HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}]} },
    { id: 8, name: '카라멜라떼', price: 3100, image: '/images/caramellatte.jpg', options: { temperatures: ['ICE', 'HOT'], sizes: [{name: 'Standard', priceMultiplier: 1}]} }
  ];

  // 옵션 선택 모달 관련 상태
  const [selectedItemForOptions, setSelectedItemForOptions] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ temperature: string; size: string; price: number } | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1); 

  // 스탬프 적립을 위한 휴대폰 번호 상태
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // 일회용품 사용 선택 (true: 사용, false: 미사용/매장컵)
  const [useDisposableCup, setUseDisposableCup] = useState<boolean>(true);
  const DISPOSABLE_CUP_FEE = 300; 

  // 선택된 최종 결제 수단 (카드결제 화면에 반영하기 위함)
  const [selectedFinalPaymentMethod, setSelectedFinalPaymentMethod] = useState<'card' | 'kakaopay' | 'naverpay' | 'voucher' | null>(null);

  // 주문 패널 참조를 위한 useRef (이제 fixed 아님 -> CSS 변수 설정 useEffect도 불필요)
  const orderPanelRef = useRef<HTMLDivElement>(null); 

  // 이전 fixed 로직에서 사용되었던 CSS 변수 설정 useEffect는 이제 제거합니다.
  // 이 부분은 더 이상 필요 없으며, 남겨두면 혼란만 줄 수 있습니다.
  useEffect(() => {
    // console.log("orderPanelRef is now used for direct DOM manipulation if needed, not for fixed position padding.");
  }, []); // 의존성 배열을 비워 한 번만 실행되도록 하거나, 필요 없다면 완전히 제거합니다.


  // 메뉴 아이템 클릭 시 옵션 모달 열기
  const handleItemClick = (item: MenuItem) => {
    setSelectedItemForOptions(item);
    setSelectedOptions({
      temperature: item.options?.temperatures?.[0] || 'ICE', 
      size: item.options?.sizes?.[0].name || 'Standard', 
      price: item.price 
    });
    setItemQuantity(1); 
  };

  // 모달에서 옵션 변경
  const handleOptionChange = (type: 'temperature' | 'size', value: string) => {
    if (!selectedItemForOptions || !selectedOptions) return;

    let newPrice = selectedItemForOptions.price;
    let newTemperature = selectedOptions.temperature;
    let newSize = selectedOptions.size;

    if (type === 'temperature') {
      newTemperature = value;
    } else if (type === 'size') {
      newSize = value;
      const selectedSize = selectedItemForOptions.options?.sizes?.find(s => s.name === value);
      if (selectedSize) {
        newPrice = selectedItemForOptions.price * selectedSize.priceMultiplier;
      }
    }

    setSelectedOptions({
      temperature: newTemperature,
      size: newSize,
      price: newPrice
    });
  };

  // 모달에서 개수 변경
  const handleQuantityChange = (change: number) => {
    setItemQuantity(prev => Math.max(1, prev + change));
  };

  // 옵션 선택 후 주문 목록에 추가 (모달 닫기)
  const confirmOptionsAndAddItem = () => {
    if (!selectedItemForOptions || !selectedOptions) return;

    const finalPrice = selectedOptions.price * itemQuantity;
    const newItem: SelectedOrderItem = {
      id: selectedItemForOptions.id,
      name: selectedItemForOptions.name,
      basePrice: selectedItemForOptions.price,
      quantity: itemQuantity,
      temperature: selectedOptions.temperature,
      size: selectedOptions.size,
      price: finalPrice,
      disposableFeeAdded: false // 일단 false로 초기화 (일회용품 선택 단계에서 변경)
    };

    setSelectedItems(prevItems => [...prevItems, newItem]);
    setTotalPrice(prevPrice => prevPrice + finalPrice);

    // 모달 닫기
    setSelectedItemForOptions(null);
    setSelectedOptions(null);
    setItemQuantity(1);
  };

  // 모달 닫기 (취소)
  const cancelOptions = () => {
    setSelectedItemForOptions(null);
    setSelectedOptions(null);
    setItemQuantity(1);
  };


  // 주문 내역에서 아이템 삭제
  const removeItem = (indexToRemove: number) => {
    const itemToRemove = selectedItems[indexToRemove];
    const newItems = selectedItems.filter((_, index) => index !== indexToRemove);
    setSelectedItems(newItems);
    setTotalPrice(prevPrice => prevPrice - itemToRemove.price);
  };

  const getHelpText = () => {
    const helpTexts: Record<number, string> = {
      0: "아무곳이나 터치해서 시작하세요",
      1: "원하는 음료를 선택해주세요",
      2: "주문 내역을 확인하고 결제하기를 눌러주세요",
      3: "포장 또는 매장을 선택해주세요",
      4: "일회용품 사용 여부를 선택해주세요.", 
      5: "결제 수단을 선택해주세요.",
      6: "스탬프를 적립할 휴대폰 번호를 입력하거나 건너뛰세요.",
      7: "결제를 진행해주세요.", // 문구 변경: "카드를 단말기에 올려주세요." -> "결제를 진행해주세요."
      8: "결제가 완료되었습니다. 주문번호를 확인해주세요."
    }
    return helpTexts[currentStep] || "화면을 터치해주세요"
  }

  // 휴대폰 번호 입력 처리 함수
  const handleNumberInput = (num: string | number) => {
    if (num === '⬅') { // Backspace
      setPhoneNumber(prev => prev.slice(0, -1));
    } else if (typeof num === 'number') { // Number input
      if (phoneNumber.length < 11) { // 휴대폰 번호는 보통 11자리 (010 포함)
        setPhoneNumber(prev => prev + num);
      }
    }
  };

  // 휴대폰 번호 포맷팅 함수 (예: 010-1234-5678)
  const formatPhoneNumber = (num: string) => {
    if (num.length <= 3) {
      return num;
    } else if (num.length <= 7) {
      return `${num.slice(0, 3)}-${num.slice(3)}`;
    } else {
      return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
    }
  };

  // 일회용품 선택 완료 후 가격 조정 및 다음 스텝으로
  const finalizeDisposableChoice = () => {
    let currentTotal = 0; // 현재 선택된 아이템들의 순수 가격 합계
    const updatedItems = selectedItems.map(item => {
      // 기존 가격에서 disposableFeeAdded 여부로 수수료를 뺀 순수 가격을 계산
      const itemBasePrice = item.disposableFeeAdded ? item.price - (item.quantity * DISPOSABLE_CUP_FEE) : item.price;
      
      let finalItemPrice = itemBasePrice;
      let feeAddedFlag = false;

      // 일회용컵 사용을 선택했다면 수수료 추가
      if (useDisposableCup) {
          finalItemPrice = itemBasePrice + (item.quantity * DISPOSABLE_CUP_FEE);
          feeAddedFlag = true;
      }
      
      currentTotal += finalItemPrice;
      return { ...item, price: finalItemPrice, disposableFeeAdded: feeAddedFlag };
    });

    setSelectedItems(updatedItems);
    setTotalPrice(currentTotal);
    setCurrentStep(5); // 결제 수단 선택 단계로 이동
  };


  return (
    <div className={styles.coffeeKiosk}>
      {/* MEGA 스타일 헤더 */}
      <div className={styles.header}>
        <button
          onClick={() => switchScreen('main')}
          className={styles.backButton}
        >
          ← 메인으로
        </button>
        <h1 className={styles.title}>MEGA COFFEE</h1>
        <HelpButton 
          showHelp={showHelp} 
          setShowHelp={setShowHelp} 
          helpText={getHelpText()} 
        />
      </div>

      {/* 시작 화면 */}
      {currentStep === 0 && (
        <div 
          onClick={() => setCurrentStep(1)}
          className={styles.startScreen}
        >
          <div className={styles.megaDisplay}>
            <img src="/images/mega_coffee_poster.png" alt="MEGA COFFEE Promotion" className={styles.posterImage} />
            <p className={styles.touchText}>아무곳이나 터치!</p>
          </div>
        </div>
      )}

      {/* 메뉴 선택 화면 */}
      {currentStep === 1 && (
        <div className={styles.menuScreen}>
          <div className={styles.topSection}>
            <div className={styles.categoryBar}>
              <button className={`${styles.categoryBtn} ${styles.active}`}>커피</button>
              <button className={styles.categoryBtn}>차</button>
              <button className={styles.categoryBtn}>스무디</button>
              <button className={styles.categoryBtn}>음료</button>
              <button className={styles.categoryBtn}>디저트</button>
              <button className={styles.categoryBtn}>MD</button>
            </div>
          </div>
          
          <div className={styles.mainContent}>
            <div className={styles.menuArea}>
              <div className={styles.menuGrid}>
                {coffeeMenu.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)} // 옵션 모달 열기
                    className={styles.menuCard}
                  >
                    <div className={styles.menuImageContainer}>
                        <img src={item.image} alt={item.name} className={styles.menuImage} />
                    </div>
                    <h3 className={styles.menuName}>{item.name}</h3>
                    <p className={styles.menuPrice}>{item.price.toLocaleString()}원</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 주문 패널 컨테이너 - 이제 fixed 아님 */}
            {/* orderPanelRef는 이제 이 요소에 연결할 필요가 없습니다. (fixed/sticky 해제) */}
            <div className={styles.orderPanelContainer}> 
                <div className={styles.orderPanel}>
                <h3 className={styles.orderTitle}>주문내역</h3>
                {selectedItems.length === 0 ? (
                    <div className={styles.emptyOrder}>
                    <div className={styles.cartIcon}>🛒</div>
                    <p>주문을 담아주세요</p>
                    </div>
                ) : (
                    <div className={styles.orderList}>
                    {selectedItems.map((item, index) => (
                        <div key={index} className={styles.orderItem}>
                            <div className={styles.itemDetails}>
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemOptions}>
                                    {item.temperature} / {item.size}
                                    {item.disposableFeeAdded && useDisposableCup ? ' (일회용컵)' : ''} {/* 일회용컵 표시 조건 강화 */}
                                </span>
                            </div>
                            <div className={styles.itemActions}>
                                <span className={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                                <button onClick={() => removeItem(index)} className={styles.removeItemBtn}>X</button>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
                <div className={styles.orderTotal}>
                    <div className={styles.totalLine}>
                    <span>총 금액</span>
                    <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
                    </div>
                    <button
                    onClick={() => setCurrentStep(2)}
                    className={styles.orderBtn}
                    >
                    주문하기
                    </button>
                </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* 옵션 선택 모달 */}
      {selectedItemForOptions && selectedOptions && (
        <div className={styles.optionModalOverlay}>
          <div className={styles.optionModal}>
            <h3 className={styles.modalTitle}>{selectedItemForOptions.name}</h3>
            <div className={styles.modalOptions}>
              <div className={styles.optionGroup}>
                <h4>온도</h4>
                <div className={styles.optionButtons}>
                  {selectedItemForOptions.options?.temperatures?.map(temp => (
                    <button
                      key={temp}
                      className={`${styles.optionBtn} ${selectedOptions.temperature === temp ? styles.active : ''}`}
                      onClick={() => handleOptionChange('temperature', temp)}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.optionGroup}>
                <h4>사이즈</h4>
                <div className={styles.optionButtons}>
                  {selectedItemForOptions.options?.sizes?.map(size => (
                    <button
                      key={size.name}
                      className={`${styles.optionBtn} ${selectedOptions.size === size.name ? styles.active : ''}`}
                      onClick={() => handleOptionChange('size', size.name)}
                    >
                      {size.name} ({selectedItemForOptions.price * size.priceMultiplier - selectedItemForOptions.price > 0 ? `+${(selectedItemForOptions.price * size.priceMultiplier - selectedItemForOptions.price).toLocaleString()}원` : '기본'})
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.optionGroup}>
                <h4>수량</h4>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleQuantityChange(-1)}>-</button>
                  <span>{itemQuantity}</span>
                  <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <span className={styles.modalPrice}>
                {(selectedOptions.price * itemQuantity).toLocaleString()}원
              </span>
              <button onClick={cancelOptions} className={styles.modalCancelBtn}>취소</button>
              <button onClick={confirmOptionsAndAddItem} className={styles.modalConfirmBtn}>담기</button>
            </div>
          </div>
        </div>
      )}

      {/* 주문 확인 화면 */}
      {currentStep === 2 && (
        <div className={styles.confirmScreen}>
          <h2 className={styles.confirmTitle}>주문 확인</h2>
          <div className={styles.confirmList}>
            {selectedItems.map((item, index) => (
              <div key={index} className={styles.confirmItem}>
                <div>
                  <span className={styles.confirmName}>{item.name}</span>
                  <div className={styles.confirmDetails}>
                    {item.temperature} / {item.size}
                    {item.disposableFeeAdded ? ' (+300원)' : ''}
                  </div>
                </div>
                <span className={styles.confirmPrice}>{item.price.toLocaleString()}원</span>
              </div>
            ))}
            <div className={styles.confirmTotal}>
              <span>총 결제금액</span>
              <span className={styles.confirmTotalPrice}>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
          <div className={styles.confirmButtons}>
            <button
              onClick={() => setCurrentStep(1)}
              className={styles.addMoreBtn}
            >
              메뉴 추가
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className={styles.payBtn}
            >
              결제하기
            </button>
          </div>
        </div>
      )}

      {/* 포장/매장 선택 */}
      {currentStep === 3 && (
        <div className={styles.packageScreen}>
          <h2 className={styles.packageTitle}>포장, 매장 선택하기</h2>
          <div className={styles.packageOptions}>
            <button
              onClick={() => { setUseDisposableCup(true); setCurrentStep(4); }} // 포장 시 일회용컵 사용으로 기본 설정
              className={styles.packageBtn}
            >
              <div className={styles.packageIcon}>🥤</div>
              <span>포장</span>
            </button>
            <button
              onClick={() => { setUseDisposableCup(false); setCurrentStep(4); }} // 매장 시 일회용컵 미사용으로 기본 설정
              className={styles.packageBtn}
            >
              <div className={styles.packageIcon}>🪑</div>
              <span>매장</span>
            </button>
          </div>
        </div>
      )}

      {/* 일회용품 선택 화면 (NEW STEP 4) */}
      {currentStep === 4 && (
        <div className={styles.disposableScreen}>
          <h2 className={styles.disposableTitle}>일회용품 사용 여부</h2>
          <div className={styles.disposableContent}>
            <p className={styles.disposableQuestion}>
              주문하신 음료에 일회용 컵을 사용하시겠습니까?
            </p>
            <div className={styles.disposableOptions}>
              <button
                className={`${styles.disposableBtn} ${useDisposableCup ? styles.active : ''}`}
                onClick={() => setUseDisposableCup(true)}
              >
                일회용 컵 사용
                <br/>
                <span className={styles.feeInfo}>(개당 +{DISPOSABLE_CUP_FEE}원)</span>
              </button>
              <button
                className={`${styles.disposableBtn} ${!useDisposableCup ? styles.active : ''}`}
                onClick={() => setUseDisposableCup(false)}
              >
                매장 컵 또는 개인 컵 사용
              </button>
            </div>
            {/* 현재 환경부담금 미리보기 */}
            <p className={styles.currentFee}>
                {useDisposableCup ? `환경부담금: ${selectedItems.length * DISPOSABLE_CUP_FEE}원` : '환경부담금 없음'}
            </p>
            <button 
                onClick={finalizeDisposableChoice} // 가격 조정 및 다음 단계로 이동
                className={styles.nextStepBtn}
            >
                다음
            </button>
          </div>
        </div>
      )}


      {/* 결제수단 선택 (STEP 5) */}
      {currentStep === 5 && (
        <div className={styles.paymentMethodScreen}>
          <h2 className={styles.paymentMethodTitle}>결제수단 선택</h2>
          <div className={styles.paymentMethodOptions}>
            <button onClick={() => { setSelectedFinalPaymentMethod('kakaopay'); setCurrentStep(6); }} className={styles.methodBtn}>
              <div className={styles.methodIcon}>📲</div>
              <span>카카오페이</span>
            </button>
            <button onClick={() => { setSelectedFinalPaymentMethod('naverpay'); setCurrentStep(6); }} className={styles.methodBtn}>
              <div className={styles.methodIcon}>🌳</div>
              <span>네이버페이</span>
            </button>
            <button onClick={() => { setSelectedFinalPaymentMethod('card'); setCurrentStep(6); }} className={styles.methodBtn}>
              <div className={styles.methodIcon}>💳</div>
              <span>신용카드</span>
            </button>
            <button onClick={() => { setSelectedFinalPaymentMethod('voucher'); setCurrentStep(6); }} className={styles.methodBtn}>
              <div className={styles.methodIcon}>🎫</div>
              <span>모바일 상품권 / 쿠폰</span>
            </button>
          </div>
        </div>
      )}


      {/* 스탬프 선택 (STEP 6) */}
      {currentStep === 6 && (
        <div className={styles.stampScreen}>
          <h2 className={styles.stampTitle}>스탬프 적립하기</h2>
          <div className={styles.stampContent}>
            <div className={styles.stampInfo}>
              <div className={styles.stampIcon}>⭐</div>
              <p className={styles.stampQuestion}>스탬프를 적립하시겠습니까?</p>
              <p className={styles.phoneNumberDisplay}>
                {formatPhoneNumber(phoneNumber)}
              </p>
            </div>
            
            <div className={styles.numberPad}>
              {[1,2,3,4,5,6,7,8,9,'',0,'⬅'].map((num, idx) => (
                <button 
                  key={idx} 
                  className={`${styles.numberBtn} ${num === '' ? styles.emptyBtn : ''}`}
                  onClick={() => handleNumberInput(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            
            <div className={styles.stampActions}>
              <button
                onClick={() => setCurrentStep(7)} 
                className={styles.directBtn}
              >
                직접하기
              </button>
              <button
                onClick={() => setCurrentStep(7)} 
                className={styles.skipBtn}
              >
                건너뛰기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결제 진행 화면 (STEP 7) - 선택된 결제 수단에 따라 동적 내용 */}
      {currentStep === 7 && (
        <div className={styles.paymentScreen}>
          {selectedFinalPaymentMethod === 'card' && (
            <>
              <h2 className={styles.paymentTitle}>신용카드 결제</h2>
              <div className={styles.cardArea}>
                <div className={styles.cardIcon}>💳</div>
                <p className={styles.cardText}>카드를 단말기에<br/>올려주세요</p>
                <div className={styles.cardSlot}>
                    <div className={styles.cardSlotInner}></div>
                </div>
              </div>
            </>
          )}
          {selectedFinalPaymentMethod === 'kakaopay' && (
            <>
              <h2 className={styles.paymentTitle}>카카오페이 결제</h2>
              <div className={styles.cardArea}> 
                <div className={styles.cardIcon}>📲</div>
                <p className={styles.cardText}>
                  카카오페이 앱을 열어<br/>결제를 완료해주세요
                </p>
              </div>
            </>
          )}
          {selectedFinalPaymentMethod === 'naverpay' && (
            <>
              <h2 className={styles.paymentTitle}>네이버페이 결제</h2>
              <div className={styles.cardArea}>
                <div className={styles.cardIcon}>🌳</div>
                <p className={styles.cardText}>
                  네이버페이 앱을 열어<br/>결제를 완료해주세요
                </p>
              </div>
            </>
          )}
          {selectedFinalPaymentMethod === 'voucher' && (
            <>
              <h2 className={styles.paymentTitle}>모바일 상품권 / 쿠폰</h2>
              <div className={styles.cardArea}>
                <div className={styles.cardIcon}>🎫</div>
                <p className={styles.cardText}>
                  바코드를 스캔하거나<br/>상품권 번호를 입력해주세요
                </p>
              </div>
            </>
          )}
          
          <button
            onClick={() => setCurrentStep(8)} 
            className={styles.payCompleteBtn}
          >
            결제 완료 (시뮬레이션)
          </button>
        </div>
      )}

      {/* 결제 완료 (STEP 8) */}
      {currentStep === 8 && (
        <div className={styles.completeScreen}>
          <div className={styles.completeIcon}>✅</div>
          <h2 className={styles.completeTitle}>결제 완료!</h2>
          <div className={styles.completeInfo}>
            <p className={styles.orderNumber}>주문번호: 007</p>
            <p className={styles.completeMessage}>주문이 완료되었습니다</p>
            <p className={styles.waitTime}>음료 제조까지 약 3-5분 소요됩니다</p>
          </div>
          <div className={styles.completeButtons}>
            <button
              onClick={() => {
                setCurrentStep(0)
                setSelectedItems([])
                setTotalPrice(0)
                setPhoneNumber('');
                setUseDisposableCup(true); // 초기화
                setSelectedFinalPaymentMethod(null); // 초기화
              }}
              className={styles.newOrderBtn}
            >
              새 주문하기
            </button>
            <button
              onClick={() => switchScreen('main')}
              className={styles.backBtn}
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}