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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewerNav = function (_React$Component) {
    (0, _inherits3.default)(ViewerNav, _React$Component);

    function ViewerNav() {
        (0, _classCallCheck3.default)(this, ViewerNav);
        return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
    }

    ViewerNav.prototype.handleChangeImg = function handleChangeImg(newIndex) {
        if (this.props.activeIndex === newIndex) {
            return;
        }
        this.props.onChangeImg(newIndex);
    };

    ViewerNav.prototype.render = function render() {
        var _this2 = this;

        var marginLeft = (Math.ceil(this.props.images.length / 2) - this.props.activeIndex - 1) * 0.75 * 30;
        var listStyle = {
            marginLeft: marginLeft + 'px'
        };
        return React.createElement(
            'div',
            { className: this.props.prefixCls + '-navbar' },
            React.createElement(
                'ul',
                { className: this.props.prefixCls + '-list ' + this.props.prefixCls + '-list-transition', style: listStyle },
                this.props.images.map(function (item, index) {
                    var isPic = item.mediaType === 'PICTURE';
                    return React.createElement(
                        'li',
                        { key: index, className: index === _this2.props.activeIndex ? 'active' : '', onClick: _this2.handleChangeImg.bind(_this2, index) },
                        React.createElement(isPic ? 'img' : 'video', { src: item.src || item.thumbUrl, alt: item.alt })
                    );
                })
            )
        );
    };

    return ViewerNav;
}(React.Component);

exports.default = ViewerNav;

ViewerNav.defaultProps = {
    activeIndex: 0
};
module.exports = exports['default'];
