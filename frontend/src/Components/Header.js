import React from 'react'
import { ReactComponent as Logo } from '../assets/logo.svg'  // Importing the SVG file

const Header = () => {
  return (
    <div>
      <header className="pt-4 pb-2">
        <div className="d-flex align-items-center" style={{ color: 'rgba(12, 150, 230, 1)', marginLeft: '20px' }}>
          <Logo className="me-2 fs-3" style={{ height: '30px' }} />  {/* Set a height for the logo */}
        </div>
      </header>
    </div>
  )
}

export default Header
