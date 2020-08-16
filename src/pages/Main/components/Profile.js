import React from 'react';
import "./Profile.css"

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uri: "../../logo.svg",
            bio: "",
        }
    }

    componentDidMount () {
        
    }

    render () {
        return (
            <div className="ProfileContainer">
                <image 
                    className="ProfilePicture"
                    src={this.state.uri}
                ></image>
                <p>Welcome User</p>
                <input 
                    className="BioBox"
                    placeholder="Put your bio here"
                    type="text"
                    value={this.state.bio}
                    onChange={event => {
                        this.setState({bio: event.target.value});
                    }} 
                >
                </input>
            </div>
        )
    }
}