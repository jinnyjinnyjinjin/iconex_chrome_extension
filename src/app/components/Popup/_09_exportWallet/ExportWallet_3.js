/* eslint-disable import/no-webpack-loader-syntax */
import React, { Component } from 'react';
import Worker from 'workers/wallet.worker.js';
import { LoadingComponent, Alert } from 'app/components/'
import withLanguageProps from 'HOC/withLanguageProps';
import { downloadFile } from 'utils';
import FileSaver from 'lib/FileSaver.min.js';
import { withRouter } from 'react-router-dom';
import { routeConstants as ROUTE } from 'constants/index'

const INIT_STATE = {
  isDownloaded: false,
  loading: false,
}

@withRouter
@withLanguageProps
class ExportWallet3 extends Component {

  constructor(props) {
    super(props);
    this.state = INIT_STATE;
    this.worker = new Worker();
    this.worker.onmessage = (m) => {
      const result = JSON.stringify(m.data);
      downloadFile('', result, FileSaver)
      if (!this.state.isDownloaded) {
        this.setState({
          isDownloaded: true,
          loading: false
        }, this.handleSubmit);
      }
    }
  }

  closePopup = () => {
    this.worker.terminate();
    this.setState(INIT_STATE);
    this.props.resetExportWalletState();
    this.props.closePopup();
  }

  handleDownload = () => {
    const { exportWalletObjects, newPw } = this.props;
    this.setState({
      isDownloaded: false,
      loading: true
    }, () => {
      this.worker.postMessage({exportWalletObjects: exportWalletObjects, newPw: newPw, type: 'exportWallet_3'});
    })
  }

  handleSubmit = () => {
    // this.worker.terminate();
    // this.setState(INIT_STATE);
    // this.props.resetExportWalletState();
    // this.props.closePopup();
  }

  goToHome = () => {
    this.closePopup()
    const { history } = this.props;
    history.push({
      pathname: ROUTE['mywallet']
    });

  }

  render() {
    const { loading, isDownloaded } = this.state;
    const { I18n } = this.props;
    return (
      <div className="popup">
  			<span onClick={this.closePopup} className="close"><em className="_img"></em></span>
  			<h1 className="title">{I18n.exportWallet.title}</h1>
  			<h2>{I18n.exportWallet.desc3}</h2>
        <div className="scroll-holder">
  				<div className="scroll">
            <div className="message-holder margin-none"><i className="_img"></i>
      				{I18n.exportWallet.infoBoxTitle2}
      			</div>
      			<div className="message-holder line">
      				<ul>
      					<li>{I18n.exportWallet.infoBoxDesc2_1}</li>
      					<li>{I18n.exportWallet.infoBoxDesc2_2}</li>
      				</ul>
      			</div>
          </div>
        </div>
        <div className="btn-holder">
          <div className="tabbox-holder">
    				<div className="download">
    					{ loading ? (<button type="submit" className="btn-type-normal size-full load"><span><LoadingComponent type="black" /></span></button>)
                        : (<button onClick={this.handleDownload} type="submit" className="btn-type-normal size-full"><span>{I18n.button.download}</span></button>)}
            </div>
    			</div>
        </div>
        {
          isDownloaded && (
            <Alert
              handleCancel={this.goToHome}
              text={I18n.createWallet.downloadSuccess}
              cancelText={I18n.button.confirm}
            />
          )
        }
  		</div>
    );
  }
}

export default ExportWallet3;
