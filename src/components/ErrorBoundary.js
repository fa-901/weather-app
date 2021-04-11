import React, { Fragment, Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
        }
    }

    componentDidCatch(error, info) {
        console.log(error)
        this.setState({ err: true });
    }

    render() {
        const { err } = this.state;
        var errMsg = (
            <Fragment>
                <h3>Something went wrong</h3>
                <h4>Try reloading</h4>
            </Fragment>
        );
        var display = err ? errMsg : this.props.children;
        return display;
    }
}