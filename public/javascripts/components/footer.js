class App extends React.Component {
    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Footer style={{ textAlign: 'center' }}>FYP21025, Department of Computer Science, The University of Hong Kong ©2022 All rights reserved</antd.Layout.Footer>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('antFooter'));
