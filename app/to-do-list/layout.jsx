import '../globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'KIITHub | To-Do-List',
 description: 'Organize your tasks and stay productive with the KIITHub To-Do List',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=notifications_active"
        />
      </head>
      <body>
        {/* <Toaster position="top-center" reverseOrder={false} /> */}
        {children}
      </body>
    </html>
  )
}