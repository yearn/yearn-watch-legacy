import * as React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
}

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={(routeProps) => {
                return currentUser ? (
                    <Component {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/signin',
                            state: { from: routeProps.location },
                        }}
                    />
                );
            }}
        ></Route>
    );
};

export default PrivateRoute;
