class App extends React.Component {
    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Header>
                    <antd.Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        {new Array(15).fill(null).map((_, index) => {
                            const key = index + 1;
                            return <antd.Menu.Item key={key}>{`nav ${key}`}</antd.Menu.Item>;
                        })}
                    </antd.Menu>
                </antd.Layout.Header>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('antHeader'));