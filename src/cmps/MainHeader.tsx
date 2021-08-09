import { ReactElement } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite'

import { store } from '../stores/storeHelpers';

import "../styles/style.scss"


function _MainHeader(): ReactElement {

    const { userStore: { loggedInUser } } = store.useStore()

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
                    {loggedInUser &&
                        <>
                            <NavLink to={`/user/${loggedInUser._id}`}>Hi, {loggedInUser.username}</NavLink>
                            <NavLink to='/login'>Logout</NavLink>
                        </>
                    }
                    {!loggedInUser &&
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/signup">Signup</NavLink>
                        </>
                    }
                </div>
            </div>
        </section>
    )

}

export const MainHeader = observer(_MainHeader)