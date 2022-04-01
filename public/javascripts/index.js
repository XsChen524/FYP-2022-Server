class App extends React.Component {
    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Content
                    style={{
                        padding: '20px',
                    }}
                >
                    <antd.Row>
                        <antd.Col>
                            <div classname="site-layout-content">
                                <h1>Welcome</h1>
                                <h3>This is Final Year Project of fyp21025</h3>
                            </div>
                        </antd.Col>
                    </antd.Row>
                </antd.Layout.Content>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
