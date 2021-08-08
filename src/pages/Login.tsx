import { ReactElement, SyntheticEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router';

import '../styles/style.scss'
import { LoginCreds } from '../interfaces/Creds.interface'
import { useForm } from '../services/customHooks'
import { userService } from '../services/user-service'

interface Props {

}

export function Login({ }: Props): ReactElement {

    const [isLogin, setIsLogin] = useState(true)
    const [creds, handelChange] = useForm<LoginCreds>({ username: '', password: '' })
    const path = useLocation()

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        setIsLogin(path.pathname === '/login')
    }, [path.pathname])

    const loadUsers = async () => {
        const users = await userService.query()
    }

    const onLogin = async (ev: SyntheticEvent) => {
        ev.preventDefault()
        console.log('creds', creds);
        const user = await userService.login(creds)
        if (user) console.log('user', user)
    }

    return (
        <section className="login main">
            <div className="login-container">
                <h2>{isLogin ? 'LOGIN' : 'SINGUP'}</h2>
                <form className="login-form" onSubmit={(ev) => onLogin(ev)}>
                    <input
                        className="main-input"
                        type="text"
                        name="username"
                        value={creds.username}
                        placeholder="username"
                        onChange={handelChange}
                        required
                    />

                    <input
                        className="main-input"
                        type="text"
                        name="password"
                        value={creds.password}
                        placeholder="password"
                        onChange={handelChange}
                        required
                    />

                    <button className="main-btn">Save</button>
                </form>
            </div>
        </section>
    )
}
