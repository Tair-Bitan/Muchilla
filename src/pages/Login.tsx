import { ReactElement, SyntheticEvent, useState } from 'react'
import { useForm } from '../services/customHooks'
interface Props {

}

export function Login({ }: Props): ReactElement {

    const [creds, handelChange] = useForm({ username: '', password: '' })

    const onLogin = (ev: SyntheticEvent) => {
        ev.preventDefault()
        console.log('creds', creds);
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
                />

                <input
                    type="text"
                    name="password"
                    value={creds.password}
                    placeholder="password"
                    onChange={handelChange}
                />

                <button>Save</button>
            </form>
        </section>
    )
}
