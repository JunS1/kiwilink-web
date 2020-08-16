import React from 'react';
import "./Request.css"
import Fire from '../../../Fire'

export default class Request extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    async componentDidMount() {
        let users = this.state.users
        await Fire.getAllReqUsers(users)
        this.setState({reqUsers: users})
        Fire.getRequestListener(
            (async userSnapShot => {
                let uid = userSnapShot.val()
                let users = this.state.users
                let exist = users.some(user => user.uid == uid)
                if (!exist) {
                    await Fire.getReqUser(users, uid)
                    this.setState({users: users})
                }
            }),
            (userSnapShot => {

            })
        )
    }

    removeRequest = (idx) => {
        let reqUser = this.state.users[idx]
        if (reqUser.uid){
            // Fire.removeRequest(this.state.reqUsers[idx].uid)
        }
        // if the card handled is the last one request, rerender screen
        let newReqUsers = this.state.users
        newReqUsers.splice(idx, 1)
        this.setState({
            reqUsers: newReqUsers, 
        })
    }

    confirmRequest = (idx) => {
        let reqUser = this.state.users[idx]
        if (reqUser.uid) {
            // Fire.confirmRequest(reqUser.uid, reqUser.first_name, reqUser.last_name)
        } else {
            console.warn("confirm user id is null")
        }
        let newReqUsers = this.state.users
        newReqUsers.splice(idx, 1)
        this.setState({
            reqUsers: newReqUsers, 
        })
    }

    renderClasses = (courses) => {
        let limit = 2
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
            arr.map( item=> {return (<div className="RoundBox"><p className="ClassesArray">{item}</p></div>)})
        )
    }


    renderRequests = () => {
        console.log(this.state.users)
        return this.state.users.map((obj, idx) =>{
            console.log(obj.first_name)
            return (
                <div className="RequestContainer">
                    <div className= {"RequestCard"}>
                        <div className="RequestImgContainer">
                            <img
                                className="RequestCardImg"
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
                            <div className="FullName">
                                <p>{obj.first_name + " " + obj.last_name}</p>
                            </div>
                            <p>{obj.bio}</p>
                            <p className="ClassTitle">classes this quarter:</p>
                            {/* <div className="ClassesArray"> */}
                                {this.renderClasses(obj.classes)}   
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="RequestButtonContainer">
                        <button 
                            className="AcceptButton"
                            onClick={()=>{
                                this.confirmRequest(idx)
                            }}
                        >
                            Accept
                        </button>
                        <button 
                            className="DeclineButton"
                            onClick={()=>{
                                this.removeRequest(idx)
                            }}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            )
        })

    }
    

    render() {
        return(
            <div className="ForYouContainer">
                <div className="ForYouHeader">
                    <div className="ForYouTitle">Friend Requests</div>
                    <p>Scroll through this page to accept or decline friend requests from different users.</p>
                </div>
                <section className="ForYouCardsContainer">
                    {this.renderRequests()}
                </section>
            </div>
        );
    }
}