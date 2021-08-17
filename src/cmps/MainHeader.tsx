import { ReactElement, useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite'

import { store } from '../stores/storeHelpers';

import "../styles/style.scss"
import { useForm } from '../services/customHooks';
import { MainSearch } from './MainSearch';


function _MainHeader(): ReactElement {

    const { userStore } = store.useStore()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<Boolean>(false)


    useEffect(() => {
        userStore.setLoggedinUser()
    }, [])



    const onToggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    return (
        <section className="main-header main">
            <div className="header-container">
                <Link to="/"><h1 className="main-logo">Muchilla</h1></Link>

                <nav className="main-nav">
                    <NavLink exact to="/">Home</NavLink>
                    <NavLink exact to="/map">Map</NavLink>
                    <NavLink to="/about">About</NavLink>
                </nav>

                <MainSearch/> 

                <div className="user-container">
                    {userStore.loggedInUser &&
                        <>
                            <div className="user-menu-btn" onClick={onToggleUserMenu} >
                                <img src={userStore.loggedInUser.imgUrl} alt="user-avatar" />
                                <button >☰</button>
                            </div>
                            {isUserMenuOpen &&
                                <div className="user-menu-modal">
                                    <NavLink to={`/user/${userStore.loggedInUser._id}`}>Profile</NavLink>
                                    <NavLink to='/' onClick={() => { userStore.logoutUser() }}>Logout</NavLink>
                                </div>
                            }
                        </>
                    }

                    {!userStore.loggedInUser &&
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