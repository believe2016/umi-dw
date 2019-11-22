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

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewerToolbar = function (_React$Component) {
    (0, _inherits3.default)(ViewerToolbar, _React$Component);

    function ViewerToolbar() {
        (0, _classCallCheck3.default)(this, ViewerToolbar);
        return (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this));
    }

    ViewerToolbar.prototype.handleAction = function handleAction(type) {
        this.props.onAction(type);
    };

    ViewerToolbar.prototype.render = function render() {
        var _this2 = this;
        const isPic = this.props.mediaType !== 'VIDEO';
        var attributeNode = this.props.attribute && isPic ? React.createElement(
            'p',
            { className: this.props.prefixCls + '-attribute' },
            this.props.alt + '(' + this.props.width + ' x ' + this.props.height + ')'
        ) : null;
        var featureNodeArr = [];
        if (isPic) {
          if (this.props.zoomable) {
            featureNodeArr = featureNodeArr.concat([React.createElement(
              'li',
              { key: 'zoomIn', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.zoomIn);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.zoomIn })
            ), React.createElement(
              'li',
              { key: 'zoomOut', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.zoomOut);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.zoomOut })
            )]);
          }
          if (this.props.changeable) {
            featureNodeArr = featureNodeArr.concat([React.createElement(
              'li',
              { key: 'prev', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.prev);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.prev })
            ), React.createElement(
              'li',
              { key: 'next', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.next);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.next })
            )]);
          }
          featureNodeArr = featureNodeArr.concat([React.createElement(
            'li',
            { key: 'reset', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                _this2.handleAction(_Icon.ActionType.reset);
              } },
            React.createElement(_Icon2.default, { type: _Icon.ActionType.reset })
          )]);
          if (this.props.rotatable) {
            featureNodeArr = featureNodeArr.concat([React.createElement(
              'li',
              { key: 'rotateLeft', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.rotateLeft);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.rotateLeft })
            ), React.createElement(
              'li',
              { key: 'rotateRight', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.rotateRight);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.rotateRight })
            )]);
          }
          if (this.props.scalable) {
            featureNodeArr = featureNodeArr.concat([React.createElement(
              'li',
              { key: 'scaleX', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.scaleX);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.scaleX })
            ), React.createElement(
              'li',
              { key: 'scaleY', className: this.props.prefixCls + '-btn', onClick: function onClick() {
                  _this2.handleAction(_Icon.ActionType.scaleY);
                } },
              React.createElement(_Icon2.default, { type: _Icon.ActionType.scaleY })
            )]);
          }
        }
      featureNodeArr = featureNodeArr.concat([this.props.toolBarAppend]);
        return React.createElement(
            'div',
            null,
            attributeNode,
            React.createElement(
                'ul',
                { className: this.props.prefixCls + '-toolbar' },
                featureNodeArr
            )
        );
    };

    return ViewerToolbar;
}(React.Component);

exports.default = ViewerToolbar;
module.exports = exports['default'];
