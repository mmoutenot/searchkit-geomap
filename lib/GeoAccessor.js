'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _searchkit = require('searchkit');

var GeoAccessor = (function (_Accessor) {
  _inherits(GeoAccessor, _Accessor);

  function GeoAccessor() {
    _classCallCheck(this, GeoAccessor);

    _get(Object.getPrototypeOf(GeoAccessor.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GeoAccessor, [{
    key: 'setArea',
    value: function setArea(area) {
      this.area = area;
    }
  }, {
    key: 'setPrecision',
    value: function setPrecision(precision) {
      this.precision = precision;
    }
  }, {
    key: 'setResults',
    value: function setResults(results) {
      _get(Object.getPrototypeOf(GeoAccessor.prototype), 'setResults', this).call(this, results);
      // let significant = _.map(this.getAggregations(['geo', 'significant', 'buckets'], []) , 'key');
    }
  }, {
    key: 'buildSharedQuery',
    value: function buildSharedQuery(query) {
      if (this.area) {
        return query.addQuery(new _searchkit.FilteredQuery({
          filter: {
            geo_bounding_box: {
              'pous.location': this.area
            }
          }
        }));
      }
      return query;
    }
  }, {
    key: 'buildOwnQuery',
    value: function buildOwnQuery(query) {
      return query.setAggs(new _searchkit.FilterBucket('geo', query.getFilters(), new _searchkit.GeohashBucket('areas', 'location', {}, new _searchkit.GeoBoundsMetric('cell', 'location')), {}, new _searchkit.GeoBoundsMetric('bounds', 'location')));
    }
  }]);

  return GeoAccessor;
})(_searchkit.Accessor);

exports.GeoAccessor = GeoAccessor;