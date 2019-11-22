import React, { Component } from 'react';
import { Button } from 'antd';
import { initialOrg } from '@/utils/consts';
import DragModal from '@/components/DragModal';
import QRCode from 'qrcode.react';

interface QRProps {
  showId?: number;
  organizationInfo: any;
  relationship: Iorg[];
}

interface QRState {
  isShowQRCode: boolean;
  qrCodeUrlIndex: number;
  qrCodeUrl?: string;
  organizationName: string;
  filterRelationship: Iorg[];
  // default的用于关闭遮罩层初始化数据
  defaultQrCodeUrlIndex: number;
  defaultQrCodeUrl?: string;
  defaultOrganizationName: string;
}

class DoctorQRCode extends Component<QRProps, QRState> {

  state = {
    isShowQRCode: false,
    qrCodeUrlIndex: 0,
    qrCodeUrl: '',
    organizationName: '',
    filterRelationship: [initialOrg],
    // default的用于关闭遮罩层初始化数据
    defaultQrCodeUrlIndex: 0,
    defaultQrCodeUrl: '',
    defaultOrganizationName: '',
  };

  componentWillMount() {
    const { relationship } = this.props;
    const filterRelationship = relationship
      .filter(r => !!r.qrCodeUrl && r.status === 'CONFIRMED' && (r.roles.includes('DOCTOR') || r.roles.includes('ASSISTANT')));
    const qrCodeUrlIndex = 0;
    this.setState({
      filterRelationship,
      qrCodeUrlIndex,
      qrCodeUrl: filterRelationship[0].qrCodeUrl,
      organizationName: filterRelationship[0].organizationName,
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

  handleQRIndex = (className: string) => {
    const dom: HTMLElement | null = document.querySelector(`.slick-arrow${className}`);
    if (!!dom) {
      dom.click();
    }
  }


  changeOrg = (index: number, qrCodeUrl: string, organizationName: string) => {
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
            maskClosable={true}
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
          </DragModal>
        )}
      </React.Fragment>
    );
  }
}

export default DoctorQRCode;
