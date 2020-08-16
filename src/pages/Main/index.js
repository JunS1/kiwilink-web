import React from 'react';
import firebase from '../../Firebase'

import "./index.css"
import logo from '../../logo.svg'

export default class Main extends React.Component {
    state = {
        user: {}
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(async (user) => {
            let uid = user.uid
            firebase.database().ref(`users/${uid}`).once('value').then(res => {
                let js_data = res.val()
                this.setState({user: js_data})
            })
        });
    }

    render() {
        return (
            <div className="Container">
                <header className="Header"></header>
                <div className="Body">
                    <nav className="MainNavBar">
                        <span className="Top-left">
                            <img src={logo} className="App-logo" alt="logo" />
                            <div className="Title">KiwiLink</div>
                        </span>
                        <ul className="MainNavButton">
                            <button className="Nav-Button">Profile</button>
                        </ul>
                        <ul className="MainNavButton">
                            <button className="Nav-Button">For You</button>
                        </ul>
                        <ul className="MainNavButton">
                            <button className="Nav-Button">Explore</button>
                        </ul>
                        <ul className="MainNavButton">
                            <button className="Nav-Button">Message</button>
                        </ul> 
                    </nav>
                    
                    {/* Inside here we conditionally render different components*/}
                    <div className="MainContent">
                        <p>welcome</p>
                    </div>
                    {/* <p>This is Main page</p> */}
                </div>
            </div>
        )
    }
}