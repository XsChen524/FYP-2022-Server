/**
 * @param isSignedIn
 * @param userId
 * @param userName
 */

function RunSnark () {
    $.get('/snark/result/start-snark?userId=' + userId);
    console.log('Snark starts');
}

function CheckUserInfo (){
    $.get('/snark/result/check-user-info?userId='+ userId, function(data){
        var infoResult = JSON.parse(data);
        console.log(infoResult);
        return infoResult;
    });
}

function CheckProof () {
    $.get('/snark/result/check-proof?userId=' + userId, function(data){
        var proofResult = JSON.parse(data);
        return proofResult;
    });
}

function CheckVerification () {
    $.get('/snark/result/check-verification?userId=' + userId, function(data){
        var verificationResult = JSON.parse(data);
        console.log(verificationResult);
        return verificationResult;
    });
}

/**
 * The page will have 3 status
 * 1. loading: after loaded the userId, secStr as Hash salt, infoHash from redis
 *      get from URL per 1 second to get the updated status, change the status if get the successful response
 * 2. generated: after proof generated, waiting to be varified
 *      get from URL per 1 second to get the updated status, change to 'verified'
 *      if get the successful response with the verification result
 * 3. verified: after the varification pass or fail
 */
function MessageBar() {
    const [status, setStatus] = React.useState('loading');
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        console.log('hello');
    }, []);

    return (
        <div class="info-div bg-light" id="message-area">
            <div class="row">
                <div class="col-3">
                    <antd.Spin size="large" />
                </div>
                <div class="col-3">
                    <h5>Loading</h5>
                </div>
            </div>
        </div>
    );
}

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

function RunSnarkResult (){
    const [isInitializing, setInitializing] = React.useState(true);
    const [userInfo, setUserInfo] =  React.useState([]);

    const [proofLoading, setProofLoading] = React.useState(true);
    const [proofInfo, setProofInfo] = React.useState([]);

    const [verificationLoading, setVerificationLoading] = React.useState(true);
    const [verifiedInfo, setVerifiedInfo] = React.useState([]);

    React.useEffect( () => {
        const getResult = async() => {
            $.get('/snark/result/check-user-info?userId=' + userId, function (data) {
                var infoResult = JSON.parse(data);
                setUserInfo(infoResult);
                console.log(infoResult);
                setInitializing(false);
            });
            $.get('/snark/result/check-proof?userId=' + userId, function (data) {
                var proofResult = JSON.parse(data);
                setProofInfo(proofResult);
                console.log(proofResult);
                setProofLoading(false);
            });
            $.get('/snark/result/check-verification?userId=' + userId, function (data) {
                var verificationResult = JSON.parse(data);
                console.log(verificationResult);
                setVerifiedInfo(verificationResult);
                setVerificationLoading(false);
            });
        }
        getResult();
    },[])

    return (
        <antd.Spin spinning={isInitializing} tip="Snark is initializing. Please wait a minute">
            <div class="info-div">
                {isInitializing == false &&
                    <antd.Row>
                        <antd.Col span={24}>
                            <h5>Hash Salt</h5>
                        </antd.Col>
                    </antd.Row>
                }
                {isInitializing == false &&
                    <div class="row text-area-row">
                        <div class="col-12">
                            <div class='textArea'>
                                <h5>
                                    {userInfo.secStr}
                                </h5>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div class="info-div">
                {isInitializing == false &&
                    <antd.Row>
                        <antd.Col span={24}>
                            <h5>Personal Information Hash</h5>
                        </antd.Col>
                    </antd.Row>
                }
                {isInitializing == false &&
                    <div class="row text-area-row">
                        <div class="col-12">
                            <div class='textArea'>
                                <h5>
                                    {userInfo.info}
                                </h5>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div class="info-div">
                {proofLoading == false &&
                    <div class="row">
                        <div class="col-12">
                            <h5>Root Hash</h5>
                        </div>
                    </div>
                }
                {proofLoading == false &&
                    <div class="row text-area-row">
                        <div class="col-12">
                            <div class='textArea'>
                                <h5>{proofInfo.rootHash}</h5>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div class="info-div" id='verification-result'>
                {verificationLoading == false &&
                    (
                        verifiedInfo.isPassed == true ?
                        <antd.Alert
                            message="Verification Passed"
                            description="You have successfully passed Zero-Knowledge Proof"
                            type="success"
                            showIcon
                        /> :
                        <antd.Alert
                            message="Verification Failed"
                            description="Sorry, please try again or contact support"
                            type="error"
                            showIcon
                        />
                    )
                }
            </div>                            
        </antd.Spin>
    );
}


class App extends React.Component {
    render() {
        return (
            <antd.Layout className="layout">
                <antd.Layout.Content>
                    <div className="site-layout-content">
                        <antd.Row id="flowControlContainer">
                            <antd.Col span={8} >
                                <div className="flowControlCol">
                                    <StepControl />
                                </div>
                            </antd.Col>
                            <antd.Col span={16} id="right-antd-col">
                                <RunSnarkResult />
                            </antd.Col>
                        </antd.Row>
                    </div>
                </antd.Layout.Content>
            </antd.Layout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('content'));
RunSnark();