import './globals.css'

export const metadata = {
  title: 'MPJ Dashboard',
  description: 'Marriott Palm Jumeirah Performance Dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
