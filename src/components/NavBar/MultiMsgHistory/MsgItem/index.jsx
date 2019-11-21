import React, { Component } from 'react';
import { object, bool } from 'prop-types';
import { defaultAvatar } from 'config';
import { Tooltip } from 'antd';
import Viewer from 'components/Viewer';
import Slider from 'react-slick';
import next from './img/right.svg';
import prev from './img/lift.svg';
import './index.scss';

const settings = {
  dots: false,
  rows: 1,
  slidesToShow: 14,
  infinite: false,
  variableWidth: true, // 配合children的style.width,加入滑动限制
};

class MsgItem extends Component {
  static defaultProps = {
    hidePatient: false,
  };

  static propTypes = {
    info: object,
    hidePatient: bool,
  };

  state = {
    lines: 5,
    view: 'limit',
    images: [],
    activeIndex: 0,
    isShowImages: false,
  };

  handleChangeView = () => {
    const { view } = this.state;
    const isAllView = view === 'all';
    this.setState({
      lines: isAllView ? 5 : 999,
      view: isAllView ? 'limit' : 'all',
    });
  }

  handleClickPrev = () => {
    this.slider.slickPrev();
  }

  handleClickNext = () => {
    this.slider.slickNext();
  }

  toggleShowImages = (image) => {
    // console.log('image', image);
    const { images } = this.props.info;
    const index = images.indexOf(image);
    this.changePicState(index);
    // this.setState({ isShowImages: !isShowImages });
  }

  changePicState = (idx) => {
    const { isShowImages } = this.state;
    this.setState({
      isShowImages: !isShowImages,
      activeIndex: idx,
    });
  }

  render() {
    const { info, hidePatient } = this.props;
    const {
      lines, view, isShowImages, activeIndex,
    } = this.state;
    const { content, images, patients } = info;
    const role = localStorage.getItem('role');
    const shouldShowPatients = () => {
      if (['ROOT', 'ADMIN', 'SUB_ROOT'].includes(role)) {
        return !hidePatient;
      }
      return true;
    };
    return (
      <li className="mmh__item">
        <div className="mmh__content">
          { content && (
            <p
              className="mmh__info"
              style={{ WebkitLineClamp: lines }}
            >{content}</p>
          ) }
          <h4>
            { content && (
              <span
                className="mmh__view pointer"
                onClick={this.handleChangeView}
              >
                { view === 'limit' ? '查看全文' : '收起' }
              </span>
            ) }
            <span className="mmh__time">{moment(info.createdAt).format('YYYY.MM.DD HH:mm')}</span>
          </h4>
          { images && (
            <ul className="mmh__imgs">
              { images.map((img, idx) => (
                <li className="pointer" onClick={() => this.toggleShowImages(img)} key={idx}>
                  <img src={img} alt="" />
                </li>
              )) }
            </ul>
          ) }
          { patients && shouldShowPatients() && (
            <div className="mmh__patients">
              <h2>接收患者</h2>
              <Slider ref={slider => (this.slider = slider)} {...settings} className="mmh__patients-list">
                { patients.map(patient => (
                  <div className="patient" key={patient.id} style={{ width: 47 }}>
                    <img src={patient.avatar || defaultAvatar} alt="" />
                    <Tooltip placement="bottom" title={patient.name}>
                      <h3>{patient.name}</h3>
                    </Tooltip>
                  </div>
                )) }
              </Slider>
              <img src={prev} onClick={this.handleClickPrev} className="prev" alt="" />
              <img src={next} onClick={this.handleClickNext} className="next" alt="" />
            </div>
          ) }
        </div>
        { images && images.length > 0 && (
          <Viewer
            visible={isShowImages}
            images={images.map(url => ({
              src: url,
              thumbUrl: url,
              mediaType: 'PICTURE',
              alt: '',
              degree: 0,
            }))}
            rotateDegree={0}
            activeIndex={activeIndex}
            scalable={false}
            onClose={() => this.changePicState(0)}
            onMaskClick={() => this.changePicState(0)}
          />
        ) }
      </li>
    );
  }
}

export default MsgItem;
