import React from 'react';
import { GiftedChat } from "react-web-gifted-chat";
import { v4 as uuidv4 } from 'uuid'
import Fire from '../../../Fire'
import firebase from '../../../Firebase'


export default class Message extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            email: "",
            displayName: "",
            rooms: [],
            room_details: {},
            refreshing: false,
            url: null,
            most_recent: "",
            isLoading: true,
            focused: false,
            currentRoom: null
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
                let friend = snapShot.val()
                let newRooms = this.state.rooms
                let room_id = friend.room
                newRooms.push(room_id)
                firebase.database().ref(`messages/${room_id}`).once('value').then(res => {
                    let temp_room_detail = this.state.room_details
                    let data_json = res.val()
                    data_json.id = room_id;
                    data_json.group_name = friend.first_name + " " + friend.last_name;
                    data_json.recent = {};
                    data_json.messages = ((temp_room_detail[room_id] && temp_room_detail[room_id].messages) || []);
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
                temp[id].members[Fire.uid].last_seen = snap.val()
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

    renderChat() {
        const {currentRoom} = this.state
        if (currentRoom) 
            return (
                <GiftedChat
                    user={{id: this.props.user.uid, name: (this.props.user.first_name + " " + this.props.user.first_name)}}
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
                <div className="Message-Header">Convo</div>
                {
                    Object.values(this.state.room_details).sort((a,b) => this.compare(a,b))
                    .map(item => {
                        return (
                            <button
                                type="button"    
                                onClick={()=>{
                                    this.setState({
                                        currentRoom: item.id
                                    })
                                }}
                            >   
                                <div>
                                    {item.group_name}
                                </div> 
                                <div>
                                    {
                                        !item.recent.user ? 
                                            null 
                                        : 
                                        Fire.displayRecent(item.recent.text, item.recent.createdAt, item.recent.user)
                                    }
                                </div>
                            </button>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        return (
            <div style={styles.container}>
                {/* {this.renderPopup()} */}
                <div style={styles.channelList}>{this.renderChatRooms()}</div>
                <div style={styles.chat}>{this.renderChat()}</div>
                <div style={styles.settings}>{}</div>
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
        flex: 1,
        flexDirection: "column",
    },
    convoList: {
        flex:1, 
        display: "flex", 
        flexDirection: 'column',
    }
};