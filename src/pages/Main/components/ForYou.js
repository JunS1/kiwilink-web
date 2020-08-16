import React from 'react';
import "./ForYou.css"
import Fire from '../../../Fire'

export default class ForYou extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }

    async componentDidMount() {
        let users = this.state.users
        await Fire.getMatches(users, true);
        this.setState({
            users: users
        }, ()=> {
            console.log("matched users: " + this.state.users)
        })
    }

    renderMatches = () => {
        console.log(this.state.users)
        return this.state.users.map(obj =>{
            console.log(obj.first_name)
            return (
                <div className="ForYouCard">
                    <img
                        className="FoYouCardImg"
                        src={obj.image}
                    >
                    </img>
                    {obj.first_name}

                </div>
            )
        })

    }
    

    render() {
        return(
            <div className="ForYouContainer">
                <div className="ForYouHeader">
                    <div className="ForYouTitle">For You Page</div>
                    <p>Scroll through this page to see optimized friend recommendations. 
                        Befriend similar people with relevant classes and majors</p>
                </div>
                <section className="ForYouCardsContainer">
                    {this.renderMatches()}
                </section>
            </div>
        );
    }
}