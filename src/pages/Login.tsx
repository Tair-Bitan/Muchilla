import { ReactElement, SyntheticEvent, useEffect, useState } from 'react'

import { LoginCreds,SignupCreds } from '../interfaces/Creds.interface'
import { useForm } from '../services/customHooks'
import { userService } from '../services/user-service'

interface Props {

}

export function Login({ }: Props): ReactElement {

    const [creds, handelChange] = useForm<LoginCreds>({ username: '', password: '' })

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        const users = await userService.query()
        console.log('users', users);
    }

    const onLogin = async (ev: SyntheticEvent) => {
        ev.preventDefault()
        console.log('creds', creds);
        const user = await userService.login(creds)
        if (user) console.log('user', user)
    }

    
    return (
        <section>
            <form className="login-form" onSubmit={(ev) => onLogin(ev)}>
                <input
                    type="text"
                    name="username"
                    value={creds.username}
                    placeholder="username"
                    onChange={handelChange}
                    required
                />

                <input
                    type="text"
                    name="password"
                    value={creds.password}
                    placeholder="password"
                    onChange={handelChange}
                    required
                />

                <button>Login</button>
            </form>
        </section>
    )
}
