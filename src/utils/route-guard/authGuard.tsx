import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AuthType } from '../../store/reducers/authorizationReducer'

interface AuthGuardIF {
  children: React.ReactElement
}

export default function AuthGuard({ children }: AuthGuardIF) {
  const navigate = useNavigate()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  React.useEffect(() => {
    if (!authorization.loggedIn) {
      navigate('/')
    }
  }, [navigate, authorization.loggedIn])

  return children
}
