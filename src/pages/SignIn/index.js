import React from 'react';
import "./signIn.css";
import firebase from '../../Firebase'

export default class SignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: ''
        };
    }


    login = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(res => {
            this.props.history.push('/dashboard');
            window.location.reload();
        }).catch(err => this.setState({error: err.message}))
    }
    
    render() {
        return (
            <div className="SignInContainer">
                <p>Welcome to KiwiLink</p>
                {this.state.error.length > 0 && <p>{this.state.error}</p>}
                <form className="SignInInput" onSubmit={this.handleSubmit}>
                    <label>
                        {/* Email: */}
                        <input type="email" 
                            placeholder="Email"
                            value={this.state.email} 
                            onChange={event => {
                                this.setState({email: event.target.value});
                            }} 
                        />
                    </label>
                    <label>
                        {/* Password: */}
                        <input 
                            placeholder="Password"
                            type="password" 
                            value={this.state.password} 
                            onChange={event => {
                                this.setState({password: event.target.value});
                            }}  
                        />
                    </label>
                </form>
                <div className="SignInButtonContainer">
                    <button 
                        onClick={this.login}
                        className="SignInButton"
                    >
                        Log in
                    </button>
                    <button 
                        className="SignInButton"
                        onClick = {() => {
                            this.props.history.push('/register');
                            window.location.reload();
                        }}
                    >
                        Sign up
                    </button>
                </div>
            </div>
        )
    }
}