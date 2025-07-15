// app/layout.js or app/layout.jsx
import '../globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'KIITHub | SCGPA Calculator',
  description: 'Easily calculate your SCGPA with the KIITHub SCGPA Calculator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Next.js handles <title> and <meta> via metadata object */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  )
}
