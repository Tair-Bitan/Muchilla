import { ReactElement } from 'react'
import { NavLink, Link } from 'react-router-dom';

import "../styles/style.scss"

interface Props {

}

export function MainFooter({ }: Props): ReactElement {

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