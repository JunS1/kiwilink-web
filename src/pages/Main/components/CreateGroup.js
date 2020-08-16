import React from 'react';
import firebase from '../../../Firebase'
import VirtualizedSelect from 'react-virtualized-select'
import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";
import createFilterOptions from 'react-select-fast-filter-options';

export default class CreateGroup extends React.Component {
    state = {
        friends: [],
        selectedUsers: [],
        group_chat_name: ""
    }

    componentDidMount() {
        // get list of friends
        firebase.database().ref(`users/${this.props.user.uid}/friends`).once('value').then(res => {
            let js_data = res.val();
            let result = []
            for (let uid in js_data) {
                let user = {
                    id: uid,
                    name: js_data[uid].first_name + " " + js_data[uid].last_name
                }
                result.push(user);
            }
            this.setState({ friends: result }, () => {
                console.log(this.state.friends)
            })
        })
    }

    filter = (items) => {
        let options = items
        return createFilterOptions({ options, labelKey:"name", valueKey:"id"})
    }

    confirmGroup = () => {
        let group_chat_name = this.state.group_chat_name
        firebase.database().ref('/messages').push({
            group_name: group_chat_name,
            texts:  [
                        {
                            text: this.props.user.first_name + " has created a new group",
                            timestamp: firebase.database.ServerValue.TIMESTAMP,
                            system: true,
                            user: {
                                _id: 1,
                                id: 1,
                                name: "System"
                            }
                        }
                    ]
        }).then(snap => {
            for (let i = 0; i < this.state.selectedUsers.length; i++) {
                let uid = this.state.selectedUsers[i].id;
                let name = this.state.selectedUsers[i].name
                firebase.database().ref(`/users/${uid}/messages`).update({
                    [snap.key]: snap.key
                });
                firebase.database().ref(`/messages/${snap.key}/members/${uid}`).update({
                    name: name,
                    active: true
                });
            }
            firebase.database().ref(`/users/${this.props.user.uid}/messages`).update({
                [snap.key]: snap.key
            });
            firebase.database().ref(`/messages/${snap.key}/members/${this.props.user.uid}`).update({
                name: this.props.user.first_name + " " + this.props.user.last_name,
                active: true
            });
            this.props.cancel();
        });
    }

    render () {
        return (
            <div>
                <div onSubmit={this.handleSubmit}>
                    <label>
                        {/* Email: */}
                        <input type="text"
                            className="GroupName-Create"
                            placeholder="Group name"
                            value={this.state.group_chat_name} 
                            onChange={event => {
                                this.setState({group_chat_name: event.target.value});
                            }}
                        />
                    </label>
                    <label>
                        <VirtualizedSelect 
                            labelKey={"name"}
                            valueKey={"id"}
                            options={this.state.friends}
                            value={this.state.selectedUsers}
                            multi={true}
                            filterOptions={this.filter(this.state.friends)}
                            className="Dropdown"
                            onChange={items => 
                                this.setState({ selectedUsers: items })
                            }
                            placeholder="Search for your friends"
                        />
                    </label>
                    <div className="Space-Between">
                        <button className="Create-Button" onClick={() => this.confirmGroup()}>
                            Confirm
                        </button>
                        <button className="Create-Button" onClick={this.props.cancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}