import React from 'react';
import firebase from '../../Firebase'

import "./index.css"
import logo from '../../logo.svg'

export default class Main extends React.Component {
    state = {

    }

    componentDidMount() {
        // fetch all user data and update local state
        console.log(firebase.auth().currentUser)
    }

    render() {
        return (
            <div className="Container">
                <header className="Header"></header>
                <body className="Body">
                    <nav className="MainNavBar">
                        <span className="Top-left">
                            <img src={logo} className="App-logo" alt="logo" />
                            <text className="Title">KiwiLink</text>
                        </span>
                        <ul className="MainNavButton">Profile</ul>
                        <ul className="MainNavButton">For You</ul>
                        <ul className="MainNavButton">Explore</ul>
                        <ul className="MainNavButton">Message</ul> 
                    </nav>
                    
                    {/* Inside here we conditionally render different components*/}
                    <div className="MainContent">
                        <image></image>
                        <p>welcome</p>
                    </div>
                    {/* <p>This is Main page</p> */}
                </body>
            </div>
        )
    }
}