import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSI VIT Pune',
  description: 'Computer Society of India Student Branch, VIT Pune',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
