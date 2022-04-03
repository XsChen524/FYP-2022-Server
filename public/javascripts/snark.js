/**
 * @param isSignedIn
 * @param userId
 * @param userName
 */

/**
 * Generate random string with fixed length
 * @param {int} length length of random string
 * @returns random string
 */
function randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += str[Math.floor(Math.random() * str.length)];
    return result;
}

/**
 * JQuery get /snark/store-secret-string to store the secret string into Redis
 * @param {int} id userId
 * @param {String} secStr secret string
 */
function StoreQrInfo(id, secStr) {
    $.get('/snark/store-secret-string?userId=' + id + '&secStr=' + secStr, function (data) {
        console.log(data);
    })
}

/**
 * Generate the content of QR Code, in JSON format,
 * Call StoreQrInfo to store Secret String into Redis
 * @returns {String} qrJson Json to generate QRcode
 */
function GenerateQrCodeJson() {
    var qrObject = new Object();
    qrObject.userId = userId;
    qrObject.userName = userName;
    qrObject.secStr = randomString(20);

    StoreQrInfo(userId, qrObject.secStr);

    var qrJson = JSON.stringify(qrObject);
    console.log(qrJson);
    return qrJson;
}

/**
 * Render QRcode component
 */
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

/**
 * Get the scanning status repeatly
 */
/*
function CheckScanningStatus (){}
*/

/**
 * Render flow control components
 * @returns react component
 */
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
                            <antd.Col span={12} id="right-antd-col">
                                <div>
                                    <antd.Row id='qrcode-row'>
                                        <antd.Col>
                                            <div id='qrcode'></div>
                                        </antd.Col>
                                    </antd.Row>
                                    <antd.Row id='alert-row'>
                                        <antd.Col>
                                            <antd.Alert id='alert' message="QR Code will expire in 30 minutes." type="warning" />
                                        </antd.Col>
                                    </antd.Row>
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
