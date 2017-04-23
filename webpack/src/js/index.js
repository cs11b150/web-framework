import 'css/index.less';

import React from 'react';
import ReactDom from 'react-dom';
import Image from 'img/test2.jpg';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'Hellp App'
        }
    }

    render() {
        return <div>
            <h1>{this.state.text}</h1>
            <div className="test-img"></div>
            <img src={Image}/>
        </div>
    }
}

ReactDom.render(
    <App/>,
    document.getElementById('root')
);