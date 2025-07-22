'use client'

import { useState } from 'react'
import IntroScreen from '@/components/IntroScreen'
import MainScreen from '@/components/MainScreen'
import CoffeeKiosk from '@/components/CoffeeKiosk'
import StoreKiosk from '@/components/StoreKiosk'
import CivilKiosk from '@/components/CivilKiosk'
import TrainKiosk from '@/components/TrainKiosk'
import BusKiosk from '@/components/BusKiosk'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('intro')
  const [showHelp, setShowHelp] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const resetState = () => {
    setCurrentStep(0)
    setSelectedItems([])
    setTotalPrice(0)
    setQuantity(1)
    setShowHelp(false)
  }

  const switchScreen = (screen: string) => {
    setCurrentScreen(screen)
    resetState()
  }

  const screenProps = {
    currentStep,
    setCurrentStep,
    selectedItems,
    setSelectedItems,
    totalPrice,
    setTotalPrice,
    quantity,
    setQuantity,
    showHelp,
    setShowHelp,
    switchScreen
  }

  const renderScreen = () => {
    switch(currentScreen) {
      case 'intro':
        return <IntroScreen switchScreen={switchScreen} />
      case 'main':
        return <MainScreen switchScreen={switchScreen} />
      case 'coffee':
        return <CoffeeKiosk {...screenProps} />
      case 'store':
        return <StoreKiosk {...screenProps} />
      case 'civil':
        return <CivilKiosk {...screenProps} />
      case 'train':
        return <TrainKiosk {...screenProps} />
      case 'bus':
        return <BusKiosk {...screenProps} />
      default:
        return <IntroScreen switchScreen={switchScreen} />
    }
  }

  return <main>{renderScreen()}</main>
}