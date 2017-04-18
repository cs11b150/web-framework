import 'css/index.less';

import React from 'react';
import ReactDom from 'react-dom';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: 'Hello App'
        }
    }

    render() {
        return <h1>{this.state.text}</h1>
    }

}

ReactDom.render(
    <App/>,
    document.getElementById('root')
);
