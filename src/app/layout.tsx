import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '사이음 키오스크 실습',
  description: '어르신을 위한 키오스크 체험 학습 앱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="custom-body-class">{children}</body>
    </html>
  )
}