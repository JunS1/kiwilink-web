import React from 'react';
import firebase from '../../../Firebase'
import VirtualizedSelect from 'react-virtualized-select'
import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";
import createFilterOptions from 'react-select-fast-filter-options';
import "./Profile.css"


export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            newBio: "",
            courses: [],
            newCourses: [],
            majors: [],
            newMajors: [],
            editBio: false,
            editCourses: false,
            editMajors: false
        }
    }

    componentDidMount () {
        this.setState({ 
            bio : this.props.user.bio, 
            newBio: this.props.user.bio,
            courses: this.props.user.courses,
            newCourses: this.props.user.courses,
            majors: this.props.user.majors,
            newMajors: this.props.user.majors
        })
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

    saveCourses = () => {
        this.setState({courses: this.state.newCourses})
        firebase.database().ref(`users/${this.props.user.uid}`).update({
            courses: this.state.newCourses
        })
        this.props.saveCourses(this.state.newCourses);
        this.setState({ editCourses: false })
    }

    saveMajors = () => {
        this.setState({majors: this.state.newMajors})
        firebase.database().ref(`users/${this.props.user.uid}`).update({
            majors: this.state.newMajors
        })
        this.props.saveMajors(this.state.newMajors);
        this.setState({ editMajors: false })
    }

    filter = (items) => {
        let options = items
        return createFilterOptions({ options, labelKey:"name", valueKey:"id"})
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
                            {this.state.bio.length === 0 ? "click to add a bio" : "click to edit bio"}
                        </button>
                    </div>
                }
                <div className="Line"></div>
                {
                    this.state.editCourses ?
                        <div>
                            <div>
                                <VirtualizedSelect
                                    labelKey={"name"}
                                    valueKey={"id"}
                                    options={this.props.courses}
                                    value={this.state.newCourses}
                                    multi={true}
                                    filterOptions={this.filter(this.props.courses)}
                                    className="Dropdown"
                                    onChange={items => {
                                        items = items.map(item => {
                                            return {
                                                name: item.name.split(":")[0],
                                                id: item.id
                                            }
                                        })
                                        this.setState({ newCourses: items })
                                    }}
                                    placeholder="Search for courses..."
                                />
                            </div>
                            <button className="Edit-Button" onClick={this.saveCourses}>
                                save
                            </button>
                            <button className="Edit-Button" onClick={() => this.setState({ editCourses: false, newCourses: this.state.courses })}>
                                cancel
                            </button>
                        </div>
                    :
                    <div>
                        <div>
                            <button className="Edit-Button" onClick={() => this.setState({ editCourses: true })}>
                                {this.state.courses && this.state.courses.length === 0 ? "Click here to add classes" : "Classes (click here to edit)"}
                            </button>
                        </div>
                        <div className="ItemList">
                            {
                                this.props.user.courses && this.props.user.courses.map(course => <button className="Item" key={course.id}>{course.name}</button>)
                            }
                        </div>
                    </div>
                }
                {
                    this.state.editMajors ?
                        <div>
                            <div>
                                <VirtualizedSelect
                                    labelKey={"name"}
                                    valueKey={"id"}
                                    options={this.props.majors}
                                    value={this.state.newMajors}
                                    multi={true}
                                    filterOptions={this.filter(this.props.majors)}
                                    className="Dropdown"
                                    onChange={item => this.setState({ newMajors: item })}
                                    placeholder="Search for majors..."
                                />
                            </div>
                            <button className="Edit-Button" onClick={this.saveMajors}>
                                save
                            </button>
                            <button className="Edit-Button" onClick={() => this.setState({ editMajors: false, newMajors: this.state.majors })}>
                                cancel
                            </button>
                        </div>
                    :
                    <div>
                        <div>
                            <button className="Edit-Button" onClick={() => this.setState({ editMajors: true })}>
                                {this.state.majors && this.state.majors.length === 0 ? "Click here to add majors" : "Major(s) (click here to edit)"}
                            </button>
                        </div>
                        <div className="ItemList">
                            {
                                this.props.user.majors && this.props.user.majors.map(major => <button className="Item" key={major.id}>{major.name}</button>)
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}