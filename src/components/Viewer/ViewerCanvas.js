/*eslint-disable*/


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Loading = require('./Loading');

var _Loading2 = _interopRequireDefault(_Loading);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewerCanvas = function (_React$Component) {
    (0, _inherits3.default)(ViewerCanvas, _React$Component);

    function ViewerCanvas() {
        (0, _classCallCheck3.default)(this, ViewerCanvas);

        var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this));

        _this.handleResize = function (e) {
            _this.props.onResize();
        };
        _this.handleCanvasMouseDown = function (e) {
            _this.props.onCanvasMouseDown(e);
            _this.handleMouseDown(e);
        };
        _this.state = {
            isMouseDown: false,
            mouseX: 0,
            mouseY: 0,
        };
        _this.handleMouseScroll = _this.handleMouseScroll.bind(_this);
        _this.handleMouseDown = _this.handleMouseDown.bind(_this);
        _this.bindEvent = _this.bindEvent.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        return _this;
    }

    ViewerCanvas.prototype.componentDidMount = function componentDidMount() {
        if (this.props.drag) {
            this.bindEvent();
        }
    };

    ViewerCanvas.prototype.handleMouseDown = function handleMouseDown(e) {
        if (!this.props.visible || !this.props.drag) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            isMouseDown: true,
            mouseX: e.nativeEvent.pageX,
            mouseY: e.nativeEvent.pageY
        });
    };

    ViewerCanvas.prototype.handleMouseMove = function handleMouseMove(e) {
        if (this.state.isMouseDown) {
            var diffX = e.x - this.state.mouseX;
            var diffY = e.y - this.state.mouseY;
            this.setState({
                mouseX: e.x,
                mouseY: e.y
            });
            this.props.onChangeImgState(this.props.width, this.props.height, this.props.top + diffY, this.props.left + diffX);
        }
    };

    ViewerCanvas.prototype.handleMouseUp = function handleMouseUp(e) {
        this.setState({
            isMouseDown: false
        });
    };

    ViewerCanvas.prototype.handleMouseScroll = function handleMouseScroll(e) {
        var direct = 0;
        var imgCenterXY = this.props.getImageCenterXY();
        if (e.wheelDelta) {
            direct = e.wheelDelta > 0 ? 1 : -1;
        } else if (e.detail) {
            direct = e.detail > 0 ? 1 : -1;
        }
        if (direct !== 0) {
            this.props.onZoom(imgCenterXY.x, imgCenterXY.y, direct, .05);
        }
    };

    ViewerCanvas.prototype.bindEvent = function bindEvent(remove) {
        var funcName = 'addEventListener';
        if (remove) {
            funcName = 'removeEventListener';
        }
        const { container } = this.props;
        if (container) {
            container[funcName]('mousewheel', this.handleMouseScroll, false);
            container[funcName]('DOMMouseScroll', this.handleMouseScroll, false);
        } else {
            document[funcName]('mousewheel', this.handleMouseScroll, false);
            document[funcName]('DOMMouseScroll', this.handleMouseScroll, false);
        }
        document[funcName]('click', this.handleMouseUp, false);
        document[funcName]('mousemove', this.handleMouseMove, false);
        window[funcName]('resize', this.handleResize, false);
    };

    ViewerCanvas.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            if (nextProps.drag) {
                return this.bindEvent();
            }
        }
        if (this.props.visible && !nextProps.visible) {
            this.handleMouseUp({});
            if (nextProps.drag) {
                return this.bindEvent(true);
            }
        }
        if (this.props.drag && !nextProps.drag) {
            return this.bindEvent(true);
        }
        if (!this.props.drag && nextProps.drag) {
            if (nextProps.visible) {
                return this.bindEvent(true);
            }
        }
    };

    ViewerCanvas.prototype.componentWillUnmount = function componentWillUnmount() {
        this.bindEvent(true);
    };

    // ViewerCanvas.prototype.componentWillMount = function componentWillMount() {
    //     this.setState({
    //         rotate: this.props.rotateDegree,
    //     });
    // };

    ViewerCanvas.prototype.render = function render() {
        var { imgSrc, mediaType, container } = this.props;
        var isVideo = mediaType === 'VIDEO';
        var imgStyle = {
            width: this.props.width + 'px',
            height: this.props.height + 'px',
            marginTop: this.props.top + 'px',
            marginLeft: this.props.left ? this.props.left + 'px' : 'auto',
            transform: 'rotate(' + this.props.rotate + 'deg) scaleX(' + this.props.scaleX + ') scaleY(' + this.props.scaleY + ')'
        };
        var videoStyle = {
            position: 'absolute',
            width: container ? 'auto' : '800px',
            maxWidth: '600px',
            height: container ? '500px' : '600px',
            top: '50%',
            left: '50%',
            transform: 'rotate(' + this.props.rotate + 'deg) translateX(-50%) translateY(-50%)'
        };
        var imgClass = this.props.drag ? 'drag' : '';
        if (!this.state.isMouseDown) {
            imgClass += ' ' + this.props.prefixCls + '-image-transition';
        }
        var style = {
            zIndex: this.props.zIndex
        };
        var imgNode = null;
        if (imgSrc !== '') {
            imgNode = React.createElement(isVideo ? 'video' : 'img',
              { className: imgClass, src: this.props.imgSrc, style: isVideo ? videoStyle : imgStyle, onMouseDown: this.handleMouseDown, controls: isVideo, autoPlay: isVideo });
        }
        if (this.props.loading) {
            imgNode = React.createElement(_Loading2.default, { style: {
                    marginTop: this.props.top,
                    marginLeft: this.props.left
                } });
        }
        return React.createElement(
          'div',
          { className: this.props.prefixCls + '-canvas', onMouseDown: this.handleCanvasMouseDown, style: style },
          imgNode
        );
    };

    return ViewerCanvas;
}(React.Component);

exports.default = ViewerCanvas;
module.exports = exports['default'];
