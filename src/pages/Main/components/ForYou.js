import React from 'react';
import "./ForYou.css"
import Fire from '../../../Fire'

export default class ForYou extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    async componentDidMount() {
        let users = this.state.users
        await Fire.getMatches(users, true);
        this.setState({
            users: users
        }, ()=> {
            console.log("matched users: " + this.state.users)
        })
    }

    renderClasses = (courses) => {
        let limit = 3
        let arr = []
        if (courses.length > limit) {
            for (let i = 0; i < (limit - 1); i++) {
                arr.push(courses[i]);
            }
            arr.push("and more...");
        } else {
            arr = courses
        }
        return (
            arr.map( item=> {return (<p>{item}</p>)})
        )
    }

    requestFriend = (idx) => {
        let currUser = this.state.users[idx]
        if (currUser.id !== null) {
            // Fire.requestFriend(currUser.uid) 
        } else {
            console.warn("request user id is null")
        }
        let newUsers = this.state.users
        newUsers.splice(idx, 1)
        this.setState({
            users: newUsers, 
        })
    }

    renderMatches = () => {
        console.log(this.state.users)
        return this.state.users.map((obj, idx) =>{
            console.log(obj.first_name)
            return (
                <div className= {"ForYouCard"}>
                    <div className="ForYouImgContainer">
                        <img
                            className="FoYouCardImg"
                            src={obj.image}
                        />
                        <button className="ForYouImgBotBar" onClick={() => this.requestFriend(idx)}>
                            <div>
                                <img
                                    className="ForYouRequestButton"
                                    src={require("../assets/star.png")}
                                />
                            </div>
                        </button>
                    </div>
                    <div className="ForYouUserInfoContainer">
                        <p>{obj.first_name}</p>
                        <p>{obj.bio}</p>
                        <p>classes this quarter:</p>
                        {this.renderClasses(obj.classes)}
                    </div>
                </div>
            )
        })

    }
    

    render() {
        return(
            <div className="ForYouContainer">
                <div className="ForYouHeader">
                    <div className="ForYouTitle">Explore</div>
                    <p>Scroll through this page to see optimized friend recommendations. 
                        Befriend similar people with relevant classes and majors</p>
                </div>
                <section className="ForYouCardsContainer">
                    <div className="ForYouPlaceHolder"></div>
                    {this.renderMatches()}
                </section>
            </div>
        );
    }
}