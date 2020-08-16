import React from 'react';
import { GiftedChat } from "react-web-gifted-chat";
import { v4 as uuidv4 } from 'uuid'
import Fire from '../../../Fire'
import firebase from '../../../Firebase'
import CreateGroup from './CreateGroup'
import "./Message.css"


export default class Message extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            email: "",
            displayName: "",
            rooms: [],
            room_details: {},
            user_details: {},
            refreshing: false,
            url: null,
            most_recent: "",
            isLoading: true,
            focused: false,
            currentRoom: null,
            create: false
        }
    }


    componentDidMount() {
        let user = firebase.auth().currentUser;
        const {email, displayName} = user;
        this.setState({ email, displayName })
        firebase.database().ref(`users/${Fire.uid}/image`).once('value').then(res => {
            // pass to header to use in navigationOptions
            let url = res.val()
            this.setState({ url });
        })

        this.getRooms();
    }

    getRooms = () => {
        Fire.getGroupChatListener((room => {
            let room_id = room.val()
            firebase.database().ref(`messages/${room_id}`).once('value').then(res => {
                let temp_rooms = this.state.rooms
                temp_rooms.push(room_id)
                let temp_room_detail = this.state.room_details
                let data_json = res.val();
                data_json.id = room_id;
                data_json.url = require("../assets/kiwi.png")
                data_json.recent = {};
                data_json.messages = ((temp_room_detail[room_id] && temp_room_detail[room_id].messages) || []);
                temp_room_detail[room_id] = data_json;
                this.setState(
                    { 
                        rooms: temp_rooms, 
                        room_details: temp_room_detail,
                    },
                    () => {
                        this.getListeners(room_id)
                    }
                );
            })
        }), (room => {
            let room_id = room.val()
            Fire.off(room_id)
            Fire.unsubscribeReadReceipts(room_id)
            let temp = this.state.room_details
            delete temp[room_id]
            
            let temp_ids = this.state.rooms
            const index = temp_ids.indexOf(room_id);
            if (index > -1) {
                temp_ids.splice(index, 1);
            }
            this.setState({ rooms: temp_ids, room_details: temp })
        }))
        Fire.getFriendListener(
            (snapShot=>{
                let uid = snapShot.key
                firebase.database().ref(`users/${uid}`).once('value').then(res => 
                    {
                        let user = res.val();
                        let major = ""
                        let classes = []
                        let newUserDetails = this.state.user_details
                        for (let index in user.majors) {
                            major += user.majors[index].name + "\n"
                        }
                        for (let index in user.courses) {
                            classes.push(user.courses[index].name)
                        }
                        user.courses = classes
                        user.majors = major
                        newUserDetails[`${uid}`] = user
                        this.setState({
                            user_details: newUserDetails
                        })
                    }
                ).catch(e=>{console.log(e)})
                let friend = snapShot.val()
                let newRooms = this.state.rooms
                let room_id = friend.room
                newRooms.push(room_id)
                firebase.database().ref(`messages/${room_id}`).once('value').then(async (res) => {
                    let temp_room_detail = this.state.room_details
                    let data_json = res.val()
                    data_json.id = room_id;
                    data_json.url = await Fire.picture(uid)
                    data_json.group_name = friend.first_name + " " + friend.last_name;
                    data_json.recent = {};
                    data_json.messages = ((temp_room_detail[room_id] && temp_room_detail[room_id].messages) || []);
                    data_json.uid = uid;
                    temp_room_detail[room_id] = data_json;
                    this.setState(
                        { 
                            rooms: newRooms, 
                            room_details: temp_room_detail,
                        },
                        () => {
                            this.getListeners(room_id)
                        }
                    );
                })

            }),
            (snapShot=>{
                let uid = snapShot.key
                let friend = snapShot.val()
                let room_id = friend.room
                Fire.off(room_id)
                Fire.unsubscribeReadReceipts(room_id)
                let temp = this.state.room_details
                delete temp[room_id]
                
                let temp_ids = this.state.rooms
                const index = temp_ids.indexOf(room_id);
                if (index > -1) {
                    temp_ids.splice(index, 1);
                }
                this.setState({ rooms: temp_ids, room_details: temp })
            })
        )
    }

    componentWillUnmount() {
        this.unsubscribeListeners()
    }

    getListeners = (id) => {
        Fire.get((message => {
            let temp = this.state.room_details;
            if (temp[id]) {
                if (!temp[id].recent.createdAt || temp[id].recent.createdAt < message.createdAt) {
                    temp[id].recent = message
                }
                temp[id].messages = GiftedChat.append(temp[id].messages, message).sort((a, b) => b.createdAt - a.createdAt)
                this.setState({ room_details: temp })
            }
        }), id);
        Fire.getReadReceipts(id, (snap => {
            let temp = this.state.room_details;
            if (temp[id]) {
                temp[id].members[this.props.user.uid].last_seen = snap.val()
                this.setState({ room_details: temp })   
            } 
        }))      
    }

    unsubscribeListeners = () => {
        for (let i = 0; i < this.state.rooms.length; i++) {
            Fire.off(this.state.rooms[i]);
            Fire.unsubscribeReadReceipts(this.state.rooms[i]);
        }
    }

    compare = (first, second) => {
        if (first.recent.createdAt < second.recent.createdAt) {
            return 1;
        } else if (first.recent.createdAt > second.recent.createdAt) {
            return -1;
        }
        return 0;
    }

    cancelCreateGroup = () => {
        this.setState({ create: false })
    }

    renderChat() {
        const {currentRoom, create} = this.state
        if (create) {
            return <CreateGroup user={this.props.user} cancel={this.cancelCreateGroup} />
        }
        if (currentRoom) 
            return (
                <GiftedChat
                    showUserAvatar={true}
                    user={{
                        _id: this.props.user.uid,
                        id: this.props.user.uid, 
                        name: (this.props.user.first_name + " " + this.props.user.last_name), 
                        avatar: this.props.user.image
                    }}
                    messages={this.state.room_details[`${currentRoom}`].messages}
                    onSend={(messages)=> Fire.send(messages, currentRoom)}
                />
            );
    }

    renderChatRooms() {
        return (
            <div 
                style={styles.convoList}
            >
                <div className="Align">
                    <img src={this.props.user.image} className="You"/>
                    <div className="Message-Header">
                        Convos
                    </div>
                </div>
                <button className="Create" onClick={() => this.setState({ create: true })}>
                    Create new group +
                </button>
                {
                    Object.values(this.state.room_details).sort((a,b) => this.compare(a,b))
                    .map(item => {
                        return (
                            <button
                                className="Convos"
                                type="button"    
                                onClick={()=>{
                                    if (this.state.currentRoom) {
                                        // post time stamp
                                        firebase.database().ref(`messages/${this.state.currentRoom}/members/${this.props.user.uid}`).update({
                                            last_seen: firebase.database.ServerValue.TIMESTAMP
                                        })
                                    }
                                    this.setState({
                                        currentRoom: item.id,
                                        create: false
                                    })
                                }}
                            >   
                                <img src={item.url} className="Avatar"/>
                                <div>
                                    <div className="GroupName">
                                        {item.group_name}
                                    </div>
                                    <div className={this.state.currentRoom === item.id ? 
                                        "read" : item.members[this.props.user.uid].last_seen < item.recent.createdAt ? 
                                        "Unread" : "read"}
                                    >
                                        {
                                            !item.recent.user ? 
                                                null 
                                            : 
                                            Fire.displayRecent(item.recent.text, item.recent.createdAt, item.recent.user, this.props.user.uid)
                                        }
                                    </div>
                                </div>
                            </button>
                        )
                    })
                }
            </div>
        )
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
            arr.map( item=> {return (<div className="RoundBox"><p className="ClassesArray">{item}</p></div>)})
        )
    }

    renderSetting() {
        if (this.state.currentRoom && this.state.room_details[`${this.state.currentRoom}`].uid) {
            let uid = this.state.room_details[`${this.state.currentRoom}`].uid
            let user = this.state.user_details[uid]
            
            console.log("obj:", user)
            return (
                <div className= {"ForYouCard"}>
                    <div className="ForYouImgContainer">
                        <img
                            className="ForYouCardImg"
                            src={user.image}
                        />
                    </div>
                    <div className="ForYouUserInfoContainer">
                        <p>{user.first_name} {user.first_name}</p>
                        {/* <p>{obj.majors}</p> */}
                        <p>{user.bio}</p>
                        <p>classes this quarter:</p>
                        {this.renderClasses(user.courses)}
                    </div>
                </div>
            )
        } else {
            // return 
        }
    }

    render() {
        return (
            <div style={styles.container}>
                {/* {this.renderPopup()} */}
                <div style={styles.channelList}>{this.renderChatRooms()}</div>
                <div style={styles.chat}>{this.renderChat()}</div>
                <div style={styles.settings}>{this.renderSetting()}</div>
            </div>
        );
    }

}

const styles = {
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        height: "100vh",
    },
    channelList: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
    chat: {
        display: "flex",
        flex: 3,
        flexDirection: "column",
        borderWidth: "1px",
        borderColor: "#ccc",
        borderRightStyle: "solid",
        borderLeftStyle: "solid",
    },
    settings: {
        display: "flex",
        flex: 2,
        flexDirection: "column",
    },
    convoList: {
        flex:1, 
        display: "flex", 
        flexDirection: 'column',
    }
};