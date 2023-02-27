import React from 'react'
import { useHistory } from 'react-router-dom'

const MyLogout = () => {
    const history = useHistory()

  return (
    <div>
        {localStorage.removeItem('userInfo')}
        {history.push('/') }

    </div>
  )
}

export default MyLogout