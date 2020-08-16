import React from 'react';
import "./Profile.css"

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bio: "",
        }
    }

    componentDidMount () {
        this.setState({ bio : this.props.user.bio })
    }

    render () {
        return (
            <div className="ProfileContainer">
                <div>
                    <img 
                        className="ProfilePicture"
                        src={this.props.user.image}
                        alt="loading"
                    >
                    </img>
                </div>
                <div className="Welcome">
                    Welcome, {this.props.user.first_name} {this.props.user.last_name}
                </div>
                <div className="Bio">
                        {this.state.bio}
                </div>
                <div>
                    <button className="Edit-Bio">
                        click to edit bio
                    </button>
                </div>
                <div className="Line"></div>
                <div>
                    <div>
                        <button className="Edit-Button">Classes (click here to edit)</button>
                    </div>
                    <div className="ItemList">
                        {
                            this.props.user.courses && this.props.user.courses.map(course => <button className="Item" key={course.id}>{course.name}</button>)
                        }
                    </div>
                </div>
                <div>
                    <div>
                        <button className="Edit-Button">Major(s) (click here to edit)</button>
                    </div>
                    <div className="ItemList">
                        {
                            this.props.user.majors && this.props.user.majors.map(major => <button className="Item" key={major.id}>{major.name}</button>)
                        }
                    </div>
                </div>
            </div>
        )
    }
}