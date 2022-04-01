class App extends React.Component {
    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Content style={{ padding: '0 50px' }}>
                    <antd.Breadcrumb style={{ margin: '16px 0' }}>
                        <antd.Breadcrumb.Item>Home</antd.Breadcrumb.Item>
                        <antd.Breadcrumb.Item>List</antd.Breadcrumb.Item>
                        <antd.Breadcrumb.Item>App</antd.Breadcrumb.Item>
                    </antd.Breadcrumb>
                    <div className="site-layout-content">Content</div>
                </antd.Layout.Content>
                <antd.Layout.Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</antd.Layout.Footer>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
