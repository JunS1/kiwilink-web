import React from 'react';
import firebase from '../../Firebase'

let default_image = "https://firebasestorage.googleapis.com/v0/b/stinder-3b3b6.appspot.com/o/photos%2Fdefault.png?alt=media&token=df58e5e6-dbce-49fb-9c5d-75028e46138d"

export default class Register extends React.Component {
    state = {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        error: ""
    }

    register = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password).then(creds => {
                firebase.database().ref('users/').child(creds.user.uid).set({
                    email: this.state.email,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    bio: "",
                    // first_time: true,
                    image: default_image
                }).then(() => {
                    this.props.history.push('/dashboard');
                    window.location.reload();
                }).catch(error => console.log(error))
            }).catch(err => this.setState({error: err.message}))    
    }

    render() {
        return (
            <div className="SignInContainer">
                {/* <header className="Header"></header> */}
                {/* <div className="Body"> */}
                    <p>Register now</p>
                    {this.state.error.length > 0 && <p>{this.state.error}</p>}
                    <form className="SignInInput" onSubmit={this.handleSubmit}>
                        <label>
                            <input 
                                placeholder="First name"
                                type="text" 
                                value={this.state.first_name} 
                                onChange={event => this.setState({first_name: event.target.value})}
                            />
                        </label>
                        <label>
                            <input 
                                placeholder="Last name"
                                type="text" 
                                value={this.state.last_name} 
                                onChange={event => this.setState({last_name: event.target.value})}
                            />
                        </label>
                        <label>
                            <input 
                                placeholder="Email"
                                type="email" 
                                value={this.state.email} 
                                onChange={event => this.setState({email: event.target.value})}
                            />
                        </label>
                        <label>
                            <input
                                placeholder="Password"
                                type="password" 
                                value={this.state.password} 
                                onChange={event => this.setState({password: event.target.value})}
                            />
                        </label>
                    </form>
                    <div className="SignInButtonContainer">
                        <button 
                            lassName="SignInButton"
                            onClick={this.register}
                        >
                            Sign up
                        </button>
                        <button     
                            onClick={() => {
                                this.props.history.push('/');
                                window.location.reload();
                            }}
                            className="SignInButton"
                        
                        >
                            Log in
                        </button>
                    </div>
                {/* </div> */}
            </div>
        )
    }
}