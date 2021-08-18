import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { store } from '../stores/storeHelpers';

import "../styles/style.scss"

export function _MainFooter(): ReactElement {

    const {uiStore} = store.useStore()

    if (!uiStore.isFooterOn) return <div></div>

    return (
        <section className="main-footer main">
            <div className="footer-container">
                <Link to="/"><h1 className="main-logo">Muchilla</h1></Link>

                <nav className="main-nav">
                    <NavLink exact to="/">Home</NavLink>
                    <NavLink exact to="/map">Map</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="user/123">User</NavLink>
                </nav>
            </div>
        </section>
    )

}

export const MainFooter = observer(_MainFooter)