import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Button, Carousel } from 'antd';
import { Button } from 'antd';
import DragModal from 'components/DragModal';

// import { okBtn } from 'utils/componentFactory/button';
import QRCode from 'qrcode.react';

class DoctorQRCode extends Component {
  static propTypes = {
    showId: PropTypes.number,
    organizationInfo: PropTypes.object,
    relationship: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowQRCode: false,
      qrCodeUrlIndex: null,
      qrCodeUrl: '',
      organizationName: '',
      filterRelationship: [],
      // default的用于关闭遮罩层初始化数据
      defaultQrCodeUrlIndex: null,
      defaultQrCodeUrl: '',
      defaultOrganizationName: '',
    };
  }

  componentWillMount() {
    const { organizationInfo, relationship } = this.props;
    const filterRelationship = relationship
      .filter(r => !!r.qrCodeUrl && r.status === 'CONFIRMED' && (r.roles.includes('DOCTOR') || r.roles.includes('ASSISTANT')));
    const qrCodeUrlIndex = 0;
    this.setState({
      organizationInfo,
      filterRelationship,
      qrCodeUrlIndex,
      qrCodeUrl: filterRelationship[0].qrCodeUrl,
      organizationName: filterRelationship[0].organizationName,
      // default的用于关闭遮罩层初始化数据
      defaultQrCodeUrlIndex: qrCodeUrlIndex,
      defaultQrCodeUrl: filterRelationship[0].qrCodeUrl,
      defaultOrganizationName: filterRelationship[0].organizationName,
    });
  }

  handleToggleQRCode = () => {
    const {
      isShowQRCode, defaultQrCodeUrlIndex, defaultQrCodeUrl, defaultOrganizationName,
    } = this.state;
    this.setState({
      isShowQRCode: !isShowQRCode,
      qrCodeUrlIndex: defaultQrCodeUrlIndex,
      qrCodeUrl: defaultQrCodeUrl,
      organizationName: defaultOrganizationName,
    });
  }

  handleQRIndex = (className) => {
    const dom = document.querySelector(`.slick-arrow${className}`);
    // console.log('dom', dom);
    dom.click();
  }


  changeOrg = (index, qrCodeUrl, organizationName) => {
    this.setState({
      qrCodeUrlIndex: index,
      qrCodeUrl,
      organizationName,
    });
  }


  render() {
    const {
      isShowQRCode, qrCodeUrlIndex, filterRelationship, qrCodeUrl,
    } = this.state;
    const { showId } = this.props;
    return (
      <React.Fragment>
        <div className="header__title__doctor">
          <div className="header__actions-qr" onClick={this.handleToggleQRCode}>
            {<QRCode size={40} value={filterRelationship[0].qrCodeUrl} />}
          </div>
        </div>
        <div style={{ fontSize: 14, marginLeft: 15 }}>医生识别码: {showId}</div>
        {isShowQRCode && (
          <DragModal
            title="二维码"
            footer={null}
            width={460}
            visible={isShowQRCode}
            onCancel={this.handleToggleQRCode}
            maskClosable
          >
            <div className="header__qr">
              {filterRelationship.length > 0 && filterRelationship
                .map((r, index) => (
                  <Button
                    className={index === qrCodeUrlIndex ? 'active' : ''}
                    onClick={() => this.changeOrg(index, r.qrCodeUrl, r.organizationName)}
                    key={index}
                  >
                    {r.organizationName}
                  </Button>
                ))}
            </div>
            <div className="qrCodes-swiper">
              {qrCodeUrl && <QRCode size={306} value={qrCodeUrl} />}
              {/* <h3>{organizationName}</h3> */}
              <p>患者可通过app端"扫一扫"建立关联关系</p>
            </div>
            {/* <Carousel
              className="header__qr"
              arrows
              initialSlide={qrCodeUrlIndex}
            >
              {filterRelationship.length > 0 && filterRelationship
                .map((r, index) => (
                  <div className="qrCodes-swiper" key={index}>
                    <QRCode size={306} value={r.qrCodeUrl} />
                    <h3>{r.organizationName}</h3>
                    <p>患者可通过app端"扫一扫"建立关联关系</p>
                  </div>
                ))}
            </Carousel>
            <div className="carousel__btn">
              {okBtn({
                okText: '上一页',
                onOk: () => this.handleQRIndex('.slick-prev'),
              })}
              {okBtn({
                okText: '下一页',
                onOk: () => this.handleQRIndex('.slick-next'),
              })}
            </div> */}
          </DragModal>
        )}
      </React.Fragment>
    );
  }
}

export default DoctorQRCode;
