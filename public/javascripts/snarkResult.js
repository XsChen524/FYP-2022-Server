/**
 * @param isSignedIn
 * @param userId
 * @param userName
 */

/**
 * The page will have 3 status
 * 1. loading: after loaded the userId, secStr as Hash salt, infoHash from redis
 *      get from URL per 1 second to get the updated status, change the status if get the successful response
 * 2. generated: after proof generated, waiting to be varified
 *      get from URL per 1 second to get the updated status, change to 'verified'
 *      if get the successful response with the verification result
 * 3. verified: after the varification pass or fail
 */
function MessageBar () {
    const [status, setStatus] = React.useState('loading');
    const [isLoading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);

    React.useEffect(()=>{
        console.log('hello');
    },[]);

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
                                <div>

                                    <div class="info-div">
                                        <div class="row">
                                            <div class="col-12">
                                                <h5>Hash Salt</h5>
                                            </div>
                                        </div>
                                        <div class="row text-area-row">
                                            <div class="col-12">
                                                <div class='textArea'>
                                                    <h5>5891b5b5 22d5df08 6d0ff0b1 10fbd9d2</h5>
                                                    <h5>1bb4fc71 63af34d0 8286a2e8 46f6be03</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="info-div">
                                        <div class="row">
                                            <div class="col-12">
                                                <h5>Personal Information Hash</h5>
                                            </div>
                                        </div>
                                        <div class="row text-area-row">
                                            <div class="col-12">
                                                <div class='textArea'>
                                                    <h5>5891b5b5 22d5df08 6d0ff0b1 10fbd9d2</h5>
                                                    <h5>1bb4fc71 63af34d0 8286a2e8 46f6be03</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="info-div">
                                        <div class="row">
                                            <div class="col-12">
                                                <h5>Root Hash</h5>
                                            </div>
                                        </div>
                                        <div class="row text-area-row">
                                            <div class="col-12">
                                                <div class='textArea'>
                                                    <h5>5891b5b5 22d5df08 6d0ff0b1 10fbd9d2</h5>
                                                    <h5>1bb4fc71 63af34d0 8286a2e8 46f6be03</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
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