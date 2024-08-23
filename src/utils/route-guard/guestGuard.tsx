import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'

interface GuestGuardIF {
  children: React.ReactElement
}

function GuestFC({ children }: GuestGuardIF) {
  const navigate = useNavigate()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  React.useEffect(() => {
    if (authorization.loggedIn) {
      navigate('/')
    }
  }, [navigate, authorization.loggedIn])

  return children
}

export default function GuestGuard() {
  return (
    <GuestFC>
      <Outlet />
    </GuestFC>
  )
}
