/**
 * @param isSignedIn
 * @param userId
 * @param userName
 */

/**
 * Render flow control components
 * @returns react component
 */
function StepControl() {
    return (
        <div>
            <antd.Steps direction="vertical" current={3}>
                <antd.Steps.Step title="Scan QR Code" description="with accination certificate mobile app" />
                <antd.Steps.Step title="Fill in personal information" description="Mobile app converts it into Hash" />
                <antd.Steps.Step title="Waiting for varification" description="Receive result after the process finishes" />
            </antd.Steps>
        </div>
    );
}


class App extends React.Component {
    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Content>
                    <div className="site-layout-content">

                        <antd.Row id="flowControlContainer">
                            <antd.Col span={12} >
                                <div className="flowControlCol">
                                    <StepControl />
                                </div>
                            </antd.Col>
                            <antd.Col span={12} id="right-antd-col">
                                <div>
                                    Hello
                                </div>
                            </antd.Col>
                        </antd.Row>

                    </div>
                </antd.Layout.Content>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('content'));