/*eslint-disable*/


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

require('./style/index.css');

var _ViewerCanvas = require('./ViewerCanvas');

var _ViewerCanvas2 = _interopRequireDefault(_ViewerCanvas);

var _ViewerNav = require('./ViewerNav');

var _ViewerNav2 = _interopRequireDefault(_ViewerNav);

var _ViewerToolbar = require('./ViewerToolbar');

var _ViewerToolbar2 = _interopRequireDefault(_ViewerToolbar);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}
var transitionDuration = 300;

var ViewerCore = function (_React$Component) {
    (0, _inherits3.default)(ViewerCore, _React$Component);

    function ViewerCore(props) {
        (0, _classCallCheck3.default)(this, ViewerCore);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));

        _this.handleTransitionEnd = function (e) {
            if (!_this.state.transitionEnd || _this.state.visibleStart) {
                _this.setState({
                    visibleStart: false,
                    transitionEnd: true
                });
            }
        };
        _this.handleCanvasMouseDown = function (e) {
            _this.props.onMaskClick(e);
        };
        _this.prefixCls = 'react-viewer';
        _this.state = {
            visible: false,
            visibleStart: false,
            transitionEnd: false,
            activeIndex: _this.props.activeIndex,
            width: 0,
            height: 0,
            top: 15,
            left: null,
            rotate: _this.props.rotateDegree || 0,
            imageWidth: 0,
            imageHeight: 0,
            scaleX: 1,
            scaleY: 1,
            loading: false
        };
        _this.handleChangeImg = _this.handleChangeImg.bind(_this);
        _this.handleChangeImgState = _this.handleChangeImgState.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleResize = _this.handleResize.bind(_this);
        _this.handleZoom = _this.handleZoom.bind(_this);
        _this.handleRotate = _this.handleRotate.bind(_this);
        _this.handleKeydown = _this.handleKeydown.bind(_this);
        _this.handleScaleX = _this.handleScaleX.bind(_this);
        _this.handleScaleY = _this.handleScaleY.bind(_this);
        _this.getImageCenterXY = _this.getImageCenterXY.bind(_this);
        _this.setContainerWidthHeight();
        _this.footerHeight = 84;
        return _this;
    }

    ViewerCore.prototype.setContainerWidthHeight = function setContainerWidthHeight() {
        this.containerWidth = window.innerWidth;
        this.containerHeight = window.innerHeight;
        if (this.props.container) {
            this.containerWidth = this.props.container.offsetWidth;
            this.containerHeight = this.props.container.offsetHeight;
        }
    };

    ViewerCore.prototype.handleClose = function handleClose(e) {
        this.props.onClose();
    };

    ViewerCore.prototype.startVisible = function startVisible(activeIndex) {
        var _this2 = this;

        this.setState({
            visibleStart: true
        });
        setTimeout(function () {
            _this2.setState({
                visible: true
            });
            setTimeout(function () {
                _this2.bindEvent();
                _this2.loadImg(activeIndex, true);
            }, 300);
        }, 10);
    };

    ViewerCore.prototype.componentDidMount = function componentDidMount() {
        this.refs['viewerCore'].addEventListener('transitionend', this.handleTransitionEnd, false);
        this.startVisible(this.state.activeIndex);
    };

    ViewerCore.prototype.getImgWidthHeight = function getImgWidthHeight(imgWidth, imgHeight) {
        var width = 0;
        var height = 0;
        var maxWidth = this.containerWidth * .8;
        var maxHeight = (this.containerHeight - this.footerHeight) * .8;
        width = Math.min(maxWidth, imgWidth);
        height = width / imgWidth * imgHeight;
        if (height > maxHeight) {
            height = maxHeight;
            width = height / imgHeight * imgWidth;
        }
        return [width, height];
    };

    ViewerCore.prototype.loadImg = function loadImg(activeIndex) {
        var _this3 = this;

        var firstLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var imgSrc = '';
        var newDegree = 0;
        var images = this.props.images || [];
        if (images.length > 0) {

            imgSrc = images[activeIndex].src;
            newDegree = images[activeIndex].degree;
        }
        console.log('new image', images[activeIndex]);
        var img = new Image();
        img.src = imgSrc;
        if (firstLoad) {
            this.setState({
                activeIndex: activeIndex,
                width: 0,
                height: 0,
                left: this.containerWidth / 2,
                top: (this.containerHeight - this.footerHeight) / 2,
                rotate: _this3.props.rotateDegree || 0,
                scaleX: 1,
                scaleY: 1,
                loading: true
            });
        } else {
            this.setState({
                activeIndex: activeIndex,
                loading: true,
                rotate: newDegree,
            });
        }
        img.onload = function () {
            var imgWidth = img.width;
            var imgHeight = img.height;
            if (firstLoad) {
                setTimeout(function () {
                    _this3.setState({
                        activeIndex: activeIndex,
                        imageWidth: imgWidth,
                        imageHeight: imgHeight
                    });
                    var imgCenterXY = _this3.getImageCenterXY();
                    _this3.handleZoom(imgCenterXY.x, imgCenterXY.y, 1, 1);
                }, 50);
            } else {
                var _getImgWidthHeight = _this3.getImgWidthHeight(imgWidth, imgHeight),
                  _getImgWidthHeight2 = (0, _slicedToArray3.default)(_getImgWidthHeight, 2),
                  width = _getImgWidthHeight2[0],
                  height = _getImgWidthHeight2[1];

                var left = (_this3.containerWidth - width) / 2;
                var top = (_this3.containerHeight - height - _this3.footerHeight) / 2;
                _this3.setState({
                    activeIndex: activeIndex,
                    width: width,
                    height: height,
                    left: left,
                    top: top,
                    imageWidth: imgWidth,
                    imageHeight: imgHeight,
                    loading: false,
                    rotate: newDegree,
                    scaleX: 1,
                    scaleY: 1
                });
            }
        };
        img.onerror = function () {
            _this3.setState({
                activeIndex: activeIndex,
                imageWidth: 0,
                imageHeight: 0,
                loading: false
            });
        };
    };

    ViewerCore.prototype.handleChangeImg = function handleChangeImg(newIndex) {
        this.loadImg(newIndex);
    };

    ViewerCore.prototype.handleChangeImgState = function handleChangeImgState(width, height, top, left) {
        this.setState({
            width: width,
            height: height,
            top: top,
            left: left
        });
    };

    ViewerCore.prototype.handleAction = function handleAction(type) {
        switch (type) {
            case _Icon.ActionType.prev:
                if (this.state.activeIndex - 1 >= 0) {
                    this.handleChangeImg(this.state.activeIndex - 1);
                }
                break;
            case _Icon.ActionType.next:
                if (this.state.activeIndex + 1 < this.props.images.length) {
                    this.handleChangeImg(this.state.activeIndex + 1);
                }
                break;
            case _Icon.ActionType.zoomIn:
                var imgCenterXY = this.getImageCenterXY();
                this.handleZoom(imgCenterXY.x, imgCenterXY.y, 1, .05);
                break;
            case _Icon.ActionType.zoomOut:
                var imgCenterXY2 = this.getImageCenterXY();
                this.handleZoom(imgCenterXY2.x, imgCenterXY2.y, -1, .05);
                break;
            case _Icon.ActionType.rotateLeft:
                this.handleRotate();
                break;
            case _Icon.ActionType.rotateRight:
                this.handleRotate(true);
                break;
            case _Icon.ActionType.reset:
                this.loadImg(this.state.activeIndex);
                this.props.onRotateClick(0);
                break;
            case _Icon.ActionType.scaleX:
                this.handleScaleX(this.state.scaleX === 1 ? -1 : 1);
                break;
            case _Icon.ActionType.scaleY:
                this.handleScaleY(this.state.scaleY === 1 ? -1 : 1);
                break;
            default:
                break;
        }
    };

    ViewerCore.prototype.handleScaleX = function handleScaleX(newScale) {
        this.setState({
            scaleX: newScale
        });
    };

    ViewerCore.prototype.handleScaleY = function handleScaleY(newScale) {
        this.setState({
            scaleY: newScale
        });
    };

    ViewerCore.prototype.handleZoom = function handleZoom(targetX, targetY, direct, scale) {
        var imgCenterXY = this.getImageCenterXY();
        var diffX = targetX - imgCenterXY.x;
        var diffY = targetY - imgCenterXY.y;
        var diffWidth = direct * this.state.width * scale;
        var diffHeight = direct * this.state.height * scale;
        // when image width is 0, set original width
        if (diffWidth === 0) {
            var _getImgWidthHeight3 = this.getImgWidthHeight(this.state.imageWidth, this.state.imageHeight),
              _getImgWidthHeight4 = (0, _slicedToArray3.default)(_getImgWidthHeight3, 2),
              width = _getImgWidthHeight4[0],
              height = _getImgWidthHeight4[1];

            diffWidth = width;
            diffHeight = height;
        }
        this.setState({
            width: this.state.width + diffWidth,
            height: this.state.height + diffHeight,
            top: this.state.top + -diffHeight / 2 + -direct * diffY * scale,
            left: this.state.left + -diffWidth / 2 + -direct * diffX * scale,
            loading: false
        });
    };

    ViewerCore.prototype.getImageCenterXY = function getImageCenterXY() {
        return {
            x: this.state.left + this.state.width / 2,
            y: this.state.top + this.state.height / 2
        };
    };

    ViewerCore.prototype.handleRotate = function handleRotate() {
        var isRight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var rotate = +(this.state.rotate) + 90 * (isRight ? 1 : -1);
        this.setState({
            rotate: rotate
        }, () => {
            this.props.onRotateClick(rotate);
        });
    };

    ViewerCore.prototype.handleResize = function handleResize() {
        this.setContainerWidthHeight();
        if (this.props.visible) {
            var _getImgWidthHeight5 = this.getImgWidthHeight(this.state.imageWidth, this.state.imageHeight),
              _getImgWidthHeight6 = (0, _slicedToArray3.default)(_getImgWidthHeight5, 2),
              width = _getImgWidthHeight6[0],
              height = _getImgWidthHeight6[1];

            var left = (this.containerWidth - width) / 2;
            var top = (this.containerHeight - height - this.footerHeight) / 2;
            this.setState({
                width: width,
                height: height,
                left: left,
                top: top,
                rotate: 0,
                scaleX: 1,
                scaleY: 1
            });
        }
    };

    ViewerCore.prototype.handleKeydown = function handleKeydown(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var isFeatrue = false;
        switch (keyCode) {
          // key: esc
            case 27:
                this.props.onClose();
                isFeatrue = true;
                break;
          // key: ←
            case 37:
                if (e.ctrlKey) {
                    this.handleAction(_Icon.ActionType.rotateLeft);
                } else {
                    this.handleAction(_Icon.ActionType.prev);
                }
                isFeatrue = true;
                break;
          // key: →
            case 39:
                if (e.ctrlKey) {
                    this.handleAction(_Icon.ActionType.rotateRight);
                } else {
                    this.handleAction(_Icon.ActionType.next);
                }
                isFeatrue = true;
                break;
          // key: ↑
            case 38:
                this.handleAction(_Icon.ActionType.zoomIn);
                isFeatrue = true;
                break;
          // key: ↓
            case 40:
                this.handleAction(_Icon.ActionType.zoomOut);
                isFeatrue = true;
                break;
          // key: Ctrl + 1
            case 49:
                if (e.ctrlKey) {
                    this.loadImg(this.state.activeIndex);
                    isFeatrue = true;
                }
                break;
            default:
                break;
        }
        if (isFeatrue) {
            e.preventDefault();
        }
    };

    ViewerCore.prototype.bindEvent = function bindEvent() {
        var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var funcName = 'addEventListener';
        if (remove) {
            funcName = 'removeEventListener';
        }
        document[funcName]('keydown', this.handleKeydown, false);
    };

    ViewerCore.prototype.componentWillUnmount = function componentWillUnmount() {
        this.bindEvent(true);
        this.refs['viewerCore'].removeEventListener('transitionend', this.handleTransitionEnd, false);
    };

    ViewerCore.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var _this4 = this;
        // console.log('nextProps', nextProps);
        if (!this.props.visible && nextProps.visible) {
            this.startVisible(nextProps.activeIndex);
            return;
        }
        if (this.props.visible && !nextProps.visible) {
            this.bindEvent(true);
            var imgCenterXY2 = this.getImageCenterXY();
            this.handleZoom(imgCenterXY2.x, imgCenterXY2.y, -1, 1);
            setTimeout(function () {
                _this4.setState({
                    visible: false,
                    transitionEnd: false
                });
            }, transitionDuration);
            return;
        }
        if (this.props.activeIndex !== nextProps.activeIndex) {
            this.handleChangeImg(nextProps.activeIndex);
            return;
        }
        if (this.props.rotateDegree !== nextProps.rotateDegree) {
            this.setState({ rotate: nextProps.rotateDegree });
        }
    };

    ViewerCore.prototype.render = function render() {
        var activeImg = {
            src: '',
            alt: ''
        };
        var zIndex = 1000;
        if (this.props.zIndex) {
            zIndex = this.props.zIndex;
        }
        var viewerStryle = {
            opacity: this.state.visible ? 1 : 0
        };
        if (!this.state.visible && this.state.transitionEnd) {
            viewerStryle.display = 'none';
        }
        if (!this.state.visible && this.state.visibleStart) {
            viewerStryle.display = 'block';
        }
        if (this.state.visible && this.state.transitionEnd) {
            var images = this.props.images || [];
            if (images.length > 0 && this.state.activeIndex >= 0) {
                activeImg = images[this.state.activeIndex];
            }
        }
        var className = this.prefixCls + ' ' + this.prefixCls + '-transition';
        if (this.props.container) {
            className += ' inline';
        }
        return React.createElement(
          'div',
          { ref: 'viewerCore', className: className, style: viewerStryle },
          React.createElement('div', { className: this.prefixCls + '-mask', style: { zIndex: zIndex } }),
          React.createElement(
            'div',
            { className: this.prefixCls + '-close ' + this.prefixCls + '-btn', onClick: this.handleClose.bind(this), style: { zIndex: zIndex + 10 } },
            React.createElement(_Icon2.default, { type: _Icon.ActionType.close })
          ),
          React.createElement(_ViewerCanvas2.default, {
              prefixCls: this.prefixCls,
              imgSrc: activeImg.src,
              visible: this.props.visible,
              mediaType: activeImg.mediaType,
              container: this.props.container,
              width: this.state.width,
              height: this.state.height,
              top: this.state.top,
              left: this.state.left,
              rotate: this.state.rotate,
              onChangeImgState: this.handleChangeImgState,
              getImageCenterXY: this.getImageCenterXY,
              onResize: this.handleResize,
              onZoom: this.handleZoom,
              zIndex: zIndex + 5,
              scaleX: this.state.scaleX,
              scaleY: this.state.scaleY,
              loading: this.state.loading,
              drag: this.props.drag,
              onCanvasMouseDown: this.handleCanvasMouseDown
          }),
          React.createElement(
            'div',
            { className: this.prefixCls + '-footer', style: { zIndex: zIndex + 5 } },
            React.createElement(_ViewerToolbar2.default, {
                prefixCls: this.prefixCls,
                onAction: this.handleAction,
                alt: activeImg.alt,
                mediaType: activeImg.mediaType,
                width: this.state.imageWidth,
                height: this.state.imageHeight,
                attribute: this.props.attribute,
                zoomable: this.props.zoomable,
                rotatable: this.props.rotatable,
                scalable: this.props.scalable,
                changeable: this.props.changeable,
                onClose: this.props.onClose,
                toolBarAppend: this.props.toolBarAppend,
            }),
            this.props.images.length > 1 && React.createElement(_ViewerNav2.default, { prefixCls: this.prefixCls, images: this.props.images, activeIndex: this.state.activeIndex, onChangeImg: this.handleChangeImg })
          )
        );
    };

    return ViewerCore;
}(React.Component);

exports.default = ViewerCore;

ViewerCore.defaultProps = {
    visible: false,
    images: [],
    activeIndex: 0,
    zIndex: 1000,
    drag: true,
    attribute: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    changeable: true,
    rotateDegree: 0,
    onClose: noop,
    onMaskClick: noop,
    onRotateClick: noop,
};
module.exports = exports['default'];
