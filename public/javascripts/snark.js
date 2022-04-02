function StepControl() {
    return (
        <antd.Steps direction="vertical" current={1}>
            <antd.Steps.Step title="Finished" description="This is a description." />
            <antd.Steps.Step title="In Progress" description="This is a description." />
            <antd.Steps.Step title="Waiting" description="This is a description." />
        </antd.Steps>
    );
}

function GenerateQrCode() {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: "http://jindo.dev.naver.com/collie",
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

class App extends React.Component {
    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Content>
                    <div className="site-layout-content">
                        <antd.Row>
                            <antd.Col span={12} >
                                <div className="flowControlCol">
                                    <StepControl/>
                                </div>
                            </antd.Col>
                            <antd.Col span={12}>
                                <div id="qrcode"></div>
                            </antd.Col>
                        </antd.Row>
                    </div>
                </antd.Layout.Content>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('content'));
GenerateQrCode();
