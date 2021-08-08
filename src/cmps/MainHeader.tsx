import { ReactElement } from 'react'
import { NavLink, Link } from 'react-router-dom';

import "../styles/style.scss"

export function MainHeader(): ReactElement {

    return (
        <section className="main-header main">
            <div className="header-container">
                <Link to="/"><h1 className="main-logo">Muchilla</h1></Link>

                <nav className="main-nav">
                    <NavLink exact to="/">Home</NavLink>
                    <NavLink exact to="/map">Map</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {/* <NavLink to="user/123">User</NavLink> */}
                </nav>
                <div className="user-container">
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/signup">Signup</NavLink>

                </div>
            </div>
        </section>
    )

}