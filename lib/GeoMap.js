'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _reactMapGl = require('react-map-gl');

var _reactMapGl2 = _interopRequireDefault(_reactMapGl);

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

var _GeoAccessor = require('./GeoAccessor');

var _searchkit = require('searchkit');

var GeoMap = (function (_SearchkitComponent) {
  _inherits(GeoMap, _SearchkitComponent);

  function GeoMap(props) {
    _classCallCheck(this, GeoMap);

    _get(Object.getPrototypeOf(GeoMap.prototype), 'constructor', this).call(this, props);

    this.state = {
      viewport: Object.assign({
        zoom: 7,
        startDragLngLat: null,
        isDragging: false
      }, props)
    };
  }

  _createClass(GeoMap, [{
    key: 'defineAccessor',
    value: function defineAccessor() {
      return new _GeoAccessor.GeoAccessor();
    }
  }, {
    key: 'centerFromBound',
    value: function centerFromBound(bound) {
      return {
        lat: (bound.top_left.lat + bound.bottom_right.lat) / 2,
        lng: (bound.top_left.lon + bound.bottom_right.lon) / 2
      };
    }
  }, {
    key: 'getPoints',
    value: function getPoints() {
      var _this = this;

      var areas = this.accessor.getAggregations(['geo', 'areas', 'buckets'], []);
      var points = _.map(areas, function (area) {
        return _this.centerFromBound(area.cell.bounds);
      });
      return points;
    }
  }, {
    key: '_onChangeViewport',
    value: function _onChangeViewport(opt) {
      var viewport = this.state.viewport;

      if (!opt.isDragging) {

        // stopped dragging, refresh the data
        var mercator = new _viewportMercatorProject2['default'](viewport);

        var bounds = [mercator.unproject([0, 0]), mercator.unproject([viewport.width, viewport.height])];

        var nw = bounds[0];
        var se = bounds[1];

        var area = {
          top_left: { lat: nw[1], lon: nw[0] },
          bottom_right: { lat: se[1], lon: se[0] }
        };

        this.accessor.setArea(area);
        this.searchkit.search();
      }

      this.setState({
        viewport: Object.assign(viewport, {
          latitude: opt.latitude,
          longitude: opt.longitude,
          zoom: opt.zoom,
          startDragLngLat: opt.startDragLngLat,
          isDragging: opt.isDragging
        })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var viewport = this.state.viewport;

      var locations = _immutable2['default'].fromJS(this.getPoints().map(function (item) {
        return [item.lng, item.lat];
      }));

      return _react2['default'].createElement(
        _reactMapGl2['default'],
        _extends({}, viewport, { onChangeViewport: this._onChangeViewport.bind(this) }),
        _react2['default'].createElement(_reactMapGl.ScatterplotOverlay, _extends({}, viewport, {
          locations: locations,
          dotRadius: 2,
          globalOpacity: 1,
          compositeOperation: 'screen' }))
      );
    }
  }]);

  return GeoMap;
})(_searchkit.SearchkitComponent);

exports.GeoMap = GeoMap;