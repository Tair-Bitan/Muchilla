import { ReactElement } from 'react'
import { useState } from "react"
import { Link } from 'react-router-dom';

import '../styles/style.scss';

import Img1 from '../assets/imgs/1.png'
import Img2 from '../assets/imgs/2.png'
import Img3 from '../assets/imgs/3.jpg'

interface Props {

}

export function Home({ }: Props): ReactElement {

    const [state, setState] = useState({})

    return (
        <main className='home-page main'>
            <div className="hero full">
                <div className="main">
                    <div className="hero-txt">
                        <h1>Simple way to discover a new world of traveling</h1>
                        <Link to="/map">Start here</Link>
                    </div>
                </div>
            </div>
            <div className="why-muchilla">
                <div className="travel-together">
                    <div className="img together"></div>
                    <h2>Travel together</h2>
                    <h3>Find partners for your next trip by proximity, common interests and destination</h3>
                </div>
                <div className="share-trip">
                    <div className="img share"></div>
                    <h2>Share your trip</h2>
                    <h3>Create a unique travel diary for each trip and share the moment with your friends and followers</h3>
                </div>
                <div className="travel-safe">
                    <div className="img safe"></div>
                    <h2>Travel safe</h2>
                    <h3>Schedule an automatic safty location message to your loved ones when there is wifi available</h3>
                </div>
            </div>
            {/* <div className="map full"></div> */}
            <div className="img-gallery full">
                <img src={Img1} />
                <img src={Img2} />
                <img src={Img3} />
            </div>
        </main>
    )
}