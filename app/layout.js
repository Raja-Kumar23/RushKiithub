import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'KIITHub | The Ultimate Toolkit for Every KIITian',
  description: 'KIITHub brings everything a KIIT student needs in one place — PYQs, faculty reviews, section swapping, CGPA calculator, and many more useful academic tools.',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Favicon */}
        <link rel="icon" href="/icon.png" />

        {/* ✅ Google Fonts & Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=notifications_active"
        />

        {/* ✅ Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RM0XQTBF6J"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RM0XQTBF6J');
            `,
          }}
        />
      </head>
      <body>
        {/* ✅ Toast Notification (optional, uncomment if needed) */}
        {/* <Toaster position="top-center" reverseOrder={false} /> */}

        {children}
      </body>
    </html>
  )
}
