import React from 'react';
import "./Profile.css"

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bio: this.props.user.bio,
        }
    }

    componentDidMount () {
        console.log("componenet did mount")
        if (this.props & this.props.uri) {
            console.log("update uri!")
            this.setState({
                uri: this.props.uri
            })
        }
    }

    renderCourses = () => {
        console.log("render courses")
        console.log("courses: " + this.props.user.courses)
        for (let item in this.props.user.courses) {
            console.log(item)
            return (
                <p>{this.props.user.courses[item].name}</p>
            )

        }
    }

    render () {
        return (
            <div className="ProfileContainer">
                <img 
                    className="ProfilePicture"
                    src={this.props.user.image}
                    alt="loading"
                >
                </img>
                <p>Welcome {this.props.user.first_name} {this.props.user.last_name}</p>
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

                <p>classes</p>
                <div className="ClassList">
                    {
                        this.renderCourses()
                    }
                </div>
            </div>
        )
    }
}