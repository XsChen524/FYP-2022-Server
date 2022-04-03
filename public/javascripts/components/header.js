/**
 * @param isSignedIn
 * @param userId
 * @param userName
 */

const UserTools = function () {
    if (!isSignedIn) {
        return (
            <antd.Menu.Item
                key = "Sign in"
                onClick = {() => {
                    window.location.href = "/login"
                }}
            > Sign in</antd.Menu.Item >
        );
    }
    return (
        <antd.Menu.Item
            key="Sign out"
            onClick={() => {
                window.location.href = "/logout"
            }}
        >Sign out</antd.Menu.Item >
    );
}

class App extends React.Component {

    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Header>
                    <antd.Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <antd.Menu.Item
                            key="Home"
                            onClick={() => {
                                window.location.href = "/"
                            }}
                            >Home</antd.Menu.Item>
                        <antd.Menu.Item
                            key="Snark"
                            onClick={() => {
                                window.location.href = "/snark"
                            }}
                        >Snark</antd.Menu.Item>
                        <UserTools/>
                    </antd.Menu>
                </antd.Layout.Header>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('antHeader'));