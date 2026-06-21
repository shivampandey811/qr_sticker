import '../index.css'

export const metadata = {
  title: 'CarPing - Secure Anonymous Driver Contact',
  description: 'Ping vehicle owners privately using secure QR code stickers without sharing phone numbers or personal data.',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
