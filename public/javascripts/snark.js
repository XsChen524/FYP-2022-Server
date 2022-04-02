/**
 * @param isSignedIn
 * @param userId
 * @param userName
 */

function randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
    return result;
}

function StepControl() {
    return (
        <div>
            <antd.Steps direction="vertical" current={0}>
                <antd.Steps.Step title="Scan QR Code" description="with accination certificate mobile app" />
                <antd.Steps.Step title="Fill in personal information" description="Mobile app converts it into Hash" />
                <antd.Steps.Step title="Waiting for varification" description="Receive result after the process finishes" />
            </antd.Steps>
        </div>
    );
}

function GenerateQrCodeJson() {
    var qrObject = new Object();
    qrObject.userId = userId;
    qrObject.userName = userName;
    qrObject.secStr = randomString(20);
    var qrJson = JSON.stringify(qrObject);
    console.log(qrJson);
    return qrJson;
}

function GenerateQrCode() {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: GenerateQrCodeJson(),
        width: 200,
        height: 200,
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

                        <antd.Row id="flowControlContainer">
                            <antd.Col span={12} >
                                <div className="flowControlCol">
                                    <StepControl/>
                                </div>
                            </antd.Col>
                            <antd.Col span={12}>
                                <div id="qrcode" className="flowControlCol">

                                </div>
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
