import React from 'react';
import firebase from '../../../Firebase'
import "./Profile.css"

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            newBio: "",
            editBio: false,
            editCourses: false,
            editMajors: false
        }
    }

    componentDidMount () {
        this.setState({ bio : this.props.user.bio, newBio: this.props.user.bio })
    }

    saveBio = () => {
        this.setState({bio: this.state.newBio});
        // save to firebase and call back?
        firebase.database().ref(`users/${this.props.user.uid}`).update({
            bio: this.state.newBio
        })
        this.props.saveBio(this.state.newBio);
        this.setState({ editBio: false })
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
                {
                    this.state.editBio ?
                        <div>
                            <div>
                                <textarea
                                    className="Bio-Area"
                                    value={this.state.newBio}
                                    onChange={event => this.setState({ newBio: event.target.value })}
                                />
                            </div>
                            <button className="Edit-Bio" onClick={this.saveBio}>
                                save
                            </button>
                            <button className="Edit-Bio" onClick={() => this.setState({ editBio: false, newBio: this.state.bio })}>
                                cancel
                            </button>
                        </div>
                    :
                    <div>
                        <div className="Bio">
                            {this.state.bio}
                        </div>
                        <button className="Edit-Bio" onClick={() => this.setState({ editBio: true })}>
                            click to edit bio
                        </button>
                    </div>
                }
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