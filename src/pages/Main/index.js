import React from 'react';
import firebase from '../../Firebase'

import "./index.css"
import logo from '../../logo.svg'
import Profile from './components/Profile'
import ForYou from './components/ForYou';
import Explore from './components/Explore';
import Message from './components/Message';
import Request from './components/Request'

export default class Main extends React.Component {
    state = {
        user: {},
        isLoading: true,
        profile: true,
        for_you: false,
        explore: false,
        message: false,
        request: false,
        courses: [],
        majors: []
    }


    componentDidMount() {
        firebase.auth().onAuthStateChanged(async (user) => {
            let uid = user.uid
            console.log(uid)
            firebase.database().ref(`users/${uid}`).once('value').then(res => {
                let js_data = res.val()
                js_data.uid = uid;
                this.setState({user: js_data})
            })
            firebase.database().ref("majors/").once('value').then(res => {
                let js_data = res.val()
                this.setState({ majors: js_data })
            })
            firebase.database().ref("courses/").once('value').then(res => {
                let js_data = res.val()
                this.setState({ courses: js_data, isLoading: false })
            })
        });
    }

    goToProfile = () => {
        this.setState({
            profile: true,
            for_you: false,
            explore: false,
            request: false,
            message: false
        })
    }

    goToForYou = () => {
        this.setState({
            profile: false,
            for_you: true,
            explore: false,
            request: false,
            message: false
        })
    }

    goToExplore = () => {
        this.setState({
            profile: false,
            for_you: false,
            explore: true,
            request: false,
            message: false
        })
    }

    goToFriendRequest = () => {
        this.setState({
            profile: false,
            for_you: false,
            explore: false,
            request: true,
            message: false
        })
    }

    goToMessage = () => {
        this.setState({
            profile: false,
            for_you: false,
            explore: false,
            request: false,
            message: true
        })
    }

    saveBio = (bio) => {
        let temp = this.state.user;
        temp.bio = bio;
        this.setState({ user: temp });
    }

    saveCourses = (courses) => {
        let temp = this.state.user;
        temp.courses = courses;
        this.setState({ user: temp });
    }

    saveMajors = (majors) => {
        let temp = this.state.user;
        temp.majors = majors;
        this.setState({ user: temp });
    }

    render() {
        return (
            this.state.isLoading ? null :
            <div className="Container">
                <header className="Header"></header>
                <div className="Body">
                    <nav className="MainNavBar">
                        <span className="Top-left">
                            <img src={logo} className="App-logo" alt="logo" />
                            <div className="Title">KiwiLink</div>
                        </span>
                        <ul className="MainNavButton">
                            <button className={this.state.profile ? "Selected" : "Nav-Button"} onClick={this.goToProfile}>
                                <div className="Nav-Text">Profile</div>
                            </button>
                        </ul>
                        <ul className="MainNavButton">
                            <button className={this.state.for_you ? "Selected" : "Nav-Button"} onClick={this.goToForYou}>
                                <div className="Nav-Text">For You</div>
                            </button>
                        </ul>
                        <ul className="MainNavButton">
                            <button className={this.state.explore ? "Selected" : "Nav-Button"} onClick={this.goToExplore}>
                                <div className="Nav-Text">Explore</div>
                            </button>
                        </ul>
                        <ul className="MainNavButton">
                            <button className={this.state.request ? "Selected" : "Nav-Button"} onClick={this.goToFriendRequest}>
                                <div className="Nav-Text">Friend Request</div>
                            </button>
                        </ul>
                        <ul className="MainNavButton">
                            <button className={this.state.message ? "Selected" : "Nav-Button"} onClick={this.goToMessage}>
                                <div className="Nav-Text">Message</div>
                            </button>
                        </ul> 
                    </nav>
                    
                    {/* Inside here we conditionally render different components*/}
                    <div className="MainContentContainer">
                        {this.state.profile && 
                            <Profile 
                                user={this.state.user} 
                                saveBio={this.saveBio}
                                saveCourses={this.saveCourses}
                                saveMajors={this.saveMajors}
                                className="MainContent"
                                courses={this.state.courses}
                                majors={this.state.majors}
                            />
                        }
                        {this.state.for_you && <ForYou className="MainContent"></ForYou>}
                        {this.state.explore && <Explore className="MainContent"></Explore>}
                        {this.state.message && <Message user={this.state.user} className="MainContent"></Message>}
                        {this.state.request && <Request className="MainContent"></Request>} 
                    </div>
                    {/* <p>This is Main page</p> */}
                </div>
            </div>
        )
    }
}