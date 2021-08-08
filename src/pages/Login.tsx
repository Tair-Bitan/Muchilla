import { ReactElement, SyntheticEvent, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router';

import '../styles/style.scss'
import { LoginCreds, SignupCreds } from '../interfaces/Creds.interface'
import { useForm } from '../services/customHooks'
import { userService } from '../services/user-service'
import { Link } from 'react-router-dom';

interface Props {

}

export function Login({ }: Props): ReactElement {

    const path = useLocation()
    const history = useHistory()

    const [isLogin, setIsLogin] = useState(true)
    const [isWrongCreds, setisWrongCreds] = useState(false)
    const [msg, setMsg] = useState('')

    const [loginCreds, loginHandelChange, setEmptyLogin] = useForm<LoginCreds>(userService.getEmptyCreds(true) as LoginCreds)
    const [signupCreds, signupHandelChange, setEmptySignup] = useForm<SignupCreds>(userService.getEmptyCreds(false) as SignupCreds)

    useEffect(() => {
        setIsLogin(path.pathname === '/login')
    }, [path.pathname])

    useEffect(() => {
        //without this handler we will have a memory leak. this is how we cleanup async func
        const handler = new AbortController()
        checkUsername()
        return () => {
            handler.abort()
        }
    }, [signupCreds.username])

    const onLogin = async (ev: SyntheticEvent) => {
        ev.preventDefault()
        try {
            await userService.login(loginCreds)
            resetForm()
            history.push('/map')
        } catch (error) {
            setisWrongCreds(true)
        }
    }

    const onSignup = async (ev: SyntheticEvent) => {
        ev.preventDefault()
        try {
            const msg = await userService.signup(signupCreds)
            resetForm()
            history.push('/map')
        } catch (error) {
            setMsg(error)
        }
    }

    const checkUsername = async () => {
        const isOccupied = await userService.checkUsername(signupCreds.username)
        if (isOccupied) {
            setMsg(`${signupCreds.username} is occupied, try another username`)
        } else {
            setMsg('')
        }
    }

    const resetForm = () => {
        if (isLogin) {
            setEmptyLogin(userService.getEmptyCreds(true) as LoginCreds)
        } else {
            setEmptySignup(userService.getEmptyCreds(false) as SignupCreds)
        }
    }

    return (
        <section className="login main">
            <div className="login-container">
                <h2>{isLogin ? 'LOGIN' : 'SINGUP'}</h2>
                {isLogin &&
                    <>
                        <form className="login-form" onSubmit={(ev) => onLogin(ev)}>
                            <input
                                className="main-input"
                                type="text"
                                name="username"
                                value={loginCreds.username}
                                placeholder="username"
                                onChange={loginHandelChange}
                                required
                            />

                            <input
                                className="main-input"
                                type="text"
                                name="password"
                                value={loginCreds.password}
                                placeholder="password"
                                onChange={loginHandelChange}
                                required
                            />
                            <button type="submit" className="main-btn">Save</button>
                        </form>
                        {isWrongCreds &&
                            <p className="p-new-user">
                                New to Muchilla?
                                <Link
                                    to="/signup"
                                    onClick={() => {
                                        setisWrongCreds(false);
                                        resetForm()
                                    }}>
                                    Create an account.
                                </Link>
                            </p>
                        }
                    </>
                }
                {!isLogin &&
                    <>
                        <form className="signup-form" onSubmit={(ev) => onSignup(ev)}>
                            <input
                                className="main-input"
                                type="text"
                                name="fullname"
                                value={signupCreds.fullname}
                                placeholder="fullname"
                                onChange={signupHandelChange}
                                required
                            />
                            <input
                                className={`main-input ${msg ? 'invalid' : ''}`}
                                type="text"
                                name="username"
                                value={signupCreds.username}
                                placeholder="username"
                                onChange={signupHandelChange}
                                required
                            />

                            <input
                                className="main-input"
                                type="text"
                                name="password"
                                value={signupCreds.password}
                                placeholder="password"
                                onChange={signupHandelChange}
                                required
                            />

                            <input
                                className="main-input"
                                type="text"
                                name="email"
                                value={signupCreds.email}
                                placeholder="name@provider.com"
                                onChange={signupHandelChange}
                                required
                            />

                            <button type="submit" className="main-btn">Save</button>
                        </form>
                        {msg && <p className="p-occupied-user">*{msg}</p>}
                    </>
                }
            </div>
        </section>
    )
}
