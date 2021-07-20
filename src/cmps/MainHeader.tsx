import { NavLink, Link } from 'react-router-dom';
import "../styles/style.scss"


export const MainHeader = () => {

    return (
        <section className="main-header main">
            <div className="header-container">
                <Link to="/"><h1 className="main-logo">Muchilla</h1></Link>

                <nav className="main-nav">
                    <NavLink exact to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                </nav>
                <div className="user-container">
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>

                </div>
            </div>
        </section>
    )

}