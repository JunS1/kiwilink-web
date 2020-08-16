import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Register from '../pages/Register';
import Main from '../pages/Main';


export default function Routes() {
    return (
        <Switch>
            <Route path="/dashboard" component={Main} isPrivate={true} />
            <Route path="/register" component={Register} />
            <Route path="/" exact component={SignIn} />
            {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
            <Route component={SignIn} />
        </Switch>
    );
}