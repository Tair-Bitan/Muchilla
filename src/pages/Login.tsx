import { ReactElement, SyntheticEvent, useEffect, useState } from 'react'

import { useForm } from '../services/customHooks'
import '../styles/style.scss'
import { useLocation } from 'react-router';
interface Props {

}

export function Login({ }: Props): ReactElement {

    const path = useLocation()
   
    const [isLogin , setIsLogin] = useState(true)
    
    const [creds, handelChange] = useForm({ username: '', password: '' })
    
    useEffect(()=>{
        if (path.pathname === '/signup') {
            setIsLogin(false)
        }
    },[path.pathname])

    const onLogin = (ev: SyntheticEvent) => {
        ev.preventDefault()
        console.log('creds', creds);
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
                    />

                    <input
                        className="main-input"
                        type="text"
                        name="password"
                        value={creds.password}
                        placeholder="password"
                        onChange={handelChange}
                    />

                    <button className="main-btn">Save</button>
                </form>
            </div>
        </section>
    )
}
