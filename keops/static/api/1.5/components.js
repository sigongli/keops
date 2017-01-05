// Generated by CoffeeScript 1.10.0
(function() {
  var formCount, uiKatrid;

  uiKatrid = Katrid.uiKatrid;

  formCount = 0;

  uiKatrid.directive('field', function($compile) {
    var fieldType, widget;
    fieldType = null;
    widget = null;
    return {
      restrict: 'E',
      replace: true,
      transclude: false,
      template: function(element, attrs) {
        if ((element.parent('list').length)) {
          fieldType = 'column';
          return '<column></column>';
        } else {
          fieldType = 'field';
          return "<section class=\"section-field-" + attrs.name + " form-group\" />";
        }
      },
      link: function(scope, element, attrs) {
        var cols, ctrl, fcontrol, field, form, templ, tp;
        field = scope.view.fields[attrs.name];
        if (fieldType === 'field') {
          element.removeAttr('name');
          widget = attrs.widget;
          if (!widget) {
            tp = field.type;
            if (tp === 'ForeignKey') {
              widget = tp;
            } else if (field.choices) {
              widget = 'SelectField';
            } else if (tp === 'TextField') {
              widget = 'TextareaField';
            } else if (tp === 'BooleanField') {
              widget = 'CheckBox';
            } else if (tp === 'DecimalField') {
              widget = 'DecimalField';
              cols = 3;
            } else if (tp === 'IntegerField') {
              widget = 'TextField';
              cols = 3;
            } else if (tp === 'CharField') {
              widget = 'TextField';
              if (field.max_length && field.max_length < 30) {
                cols = 3;
              }
            } else if (tp === 'OneToManyField') {
              widget = tp;
              cols = 12;
            } else if (tp === 'ManyToManyField') {
              widget = tp;
            } else {
              widget = 'TextField';
            }
          }
          element.addClass("col-md-" + (attrs.cols || cols || 6));
          widget = new Katrid.UI.Widgets[widget];
          field = scope.view.fields[attrs.name];
          templ = $compile(widget.template(scope, element, attrs, field))(scope);
          element.append(templ);
          fcontrol = templ.find('.form-field');
          if (fcontrol.length) {
            fcontrol = fcontrol[fcontrol.length - 1];
            form = element.controller('form');
            ctrl = angular.element(fcontrol).data().$ngModelController;
            if (ctrl) {
              form.$addControl(ctrl);
            }
          }
          return widget.link(scope, element, attrs, $compile, field);
        }
      }
    };
  });

  uiKatrid.directive('view', function() {
    return {
      restrict: 'E',
      template: function(element, attrs) {
        formCount++;
        return '';
      },
      link: function(scope, element, attrs) {
        if (scope.model) {
          element.attr('class', 'view-form-' + scope.model.name.replace(new RegExp('\.', 'g'), '-'));
          element.attr('id', 'katrid-form-' + formCount.toString());
          element.attr('model', scope.model);
          return element.attr('name', 'dataForm' + formCount.toString());
        }
      }
    };
  });

  uiKatrid.directive('list', function($compile, $http) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var html;
        html = Katrid.UI.Utils.Templates.renderList(scope, element, attrs);
        return element.replaceWith($compile(html)(scope));
      }
    };
  });

  uiKatrid.controller('dialogForm', function($scope) {
    console.log('start controller');
    return $scope.form;
  });

  uiKatrid.directive('grid', function($compile, $http) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      link: function(scope, element, attrs) {
        var field, masterChanged, p, renderDialog;
        field = scope.$parent.view.fields[attrs.name];
        scope.fieldName = attrs.name;
        scope.field = field;
        scope.records = [];
        scope.recordIndex = -1;
        scope._viewCache = {};
        scope.dataSet = [];
        scope.model = new Katrid.Services.Model(field.model);
        scope.dataSource = new Katrid.Data.DataSource(scope);
        p = scope.$parent;
        while (p) {
          if (p.dataSource) {
            scope.dataSource.setMasterSource(p.dataSource);
            break;
          }
          p = p.$parent;
        }
        scope.dataSource.fieldName = scope.fieldName;
        scope.gridDialog = null;
        scope.model.getViewInfo({
          view_type: 'list'
        }).done(function(res) {
          return scope.$apply(function() {
            var html;
            scope.view = res.result;
            html = Katrid.UI.Utils.Templates.renderGrid(scope, $(scope.view.content), attrs, 'showDialog($index)');
            return element.replaceWith($compile(html)(scope));
          });
        });
        renderDialog = function() {
          var el, html;
          html = scope._viewCache.form.content;
          html = $(Katrid.UI.Utils.Templates.gridDialog().replace('<!-- view content -->', html));
          el = $compile(html)(scope);
          scope.gridDialog = el;
          el.modal('show');
          el.on('hidden.bs.modal', function() {
            el.remove();
            scope.gridDialog = null;
            return scope.recordIndex = -1;
          });
          return false;
        };
        scope.addItem = function() {
          return scope.showDialog();
        };
        scope.save = function() {
          var attr, data, rec;
          data = scope.dataSource.applyModifiedData(scope.form, scope.gridDialog, scope.record);
          if (scope.recordIndex > -1) {
            rec = scope.records[scope.recordIndex];
            for (attr in data) {
              rec[attr] = data[attr];
            }
          }
          scope.gridDialog.modal('toggle');
        };
        scope.showDialog = function(index) {
          var rec;
          if (index != null) {
            scope.recordIndex = index;
            if (!scope.dataSet[index]) {
              scope.dataSource.get(scope.records[index].id, 0).done(function(res) {
                if (res.ok) {
                  return scope.$apply(function() {
                    return scope.dataSet[index] = scope.record;
                  });
                }
              });
            }
            rec = scope.dataSet[index];
          } else {
            scope.recordIndex = -1;
            rec = {};
          }
          scope.record = rec;
          if (scope._viewCache.form) {
            setTimeout(function() {
              return renderDialog();
            });
          } else {
            scope.model.getViewInfo({
              view_type: 'form'
            }).done(function(res) {
              if (res.ok) {
                scope._viewCache.form = res.result;
                return renderDialog();
              }
            });
          }
          return false;
        };
        masterChanged = function(key) {
          var data;
          data = {};
          data[field.field] = key;
          scope.records = [];
          return scope.dataSource.search(data);
        };
        return scope.$parent.$watch('recordId', function(key) {
          return masterChanged(key);
        });
      }
    };
  });

  uiKatrid.directive('ngEnter', function() {
    return function(scope, element, attrs) {
      return element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            return scope.$eval(attrs.ngEnter);
          });
          return event.preventDefault();
        }
      });
    };
  });

  uiKatrid.directive('datepicker', function() {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, controller) {
        var el, updateModelValue;
        el = element.datepicker({
          format: Katrid.i18n.gettext('dd/mm/yyyy'),
          forceParse: false
        });
        updateModelValue = function() {
          return el.val(controller.$modelValue);
        };
        scope.$watch(attrs.ngModel, updateModelValue);
        el = el.mask('00/00/0000');
        controller.$render = function() {
          return console.log(controller.$modelValue);
        };
        return el.on('blur', function(evt) {
          var dt, s;
          s = el.val();
          if ((s.length === 5) || (s.length === 6)) {
            if (s.length === 6) {
              s = s.substr(0, 5);
            }
            dt = new Date();
            el.datepicker('setDate', s + '/' + dt.getFullYear().toString());
          }
          if ((s.length === 2) || (s.length === 3)) {
            if (s.length === 3) {
              s = s.substr(0, 2);
            }
            dt = new Date();
            return el.datepicker('setDate', new Date(dt.getFullYear(), dt.getMonth(), s));
          }
        });
      }
    };
  });

  uiKatrid.directive('ajaxChoices', function($location) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, controller) {
        var cfg, el, multiple, serviceName;
        multiple = attrs.multiple;
        serviceName = attrs.ajaxChoices;
        cfg = {
          ajax: {
            url: serviceName,
            dataType: 'json',
            quietMillis: 500,
            data: function(term, page) {
              return {
                q: term,
                t: 1,
                p: page - 1,
                file: attrs.reportFile,
                sql_choices: attrs.sqlChoices
              };
            },
            results: function(data, page) {
              var more;
              console.log(data);
              data = data.items;
              more = (page * 10) < data.count;
              if (!multiple && (page === 1)) {
                data.splice(0, 0, {
                  id: null,
                  text: '---------'
                });
              }
              return {
                results: data,
                more: more
              };
            }
          },
          escapeMarkup: function(m) {
            return m;
          },
          initSelection: function(element, callback) {
            var i, j, len, v, values;
            v = controller.$modelValue;
            if (v) {
              if (multiple) {
                values = [];
                for (j = 0, len = v.length; j < len; j++) {
                  i = v[j];
                  values.push({
                    id: i[0],
                    text: i[1]
                  });
                }
                return callback(values);
              } else {
                return callback({
                  id: v[0],
                  text: v[1]
                });
              }
            }
          }
        };
        if (multiple) {
          cfg['multiple'] = true;
        }
        el = element.select2(cfg);
        element.on('$destroy', function() {
          $('.select2-hidden-accessible').remove();
          $('.select2-drop').remove();
          return $('.select2-drop-mask').remove();
        });
        el.on('change', function(e) {
          var v;
          v = el.select2('data');
          controller.$setDirty();
          if (v) {
            controller.$viewValue = v;
          }
          return scope.$apply();
        });
        return controller.$render = function() {
          if (controller.$viewValue) {
            return element.select2('val', controller.$viewValue);
          }
        };
      }
    };
  });

  uiKatrid.directive('decimal', function($filter) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, controller) {
        var decimal, el, negative, precision, symbol, thousands;
        precision = attrs.precision || 2;
        thousands = attrs.uiMoneyThousands || ".";
        decimal = attrs.uiMoneyDecimal || ",";
        symbol = attrs.uiMoneySymbol;
        negative = attrs.uiMoneyNegative || true;
        el = element.maskMoney({
          symbol: symbol,
          thousands: thousands,
          decimal: decimal,
          precision: precision,
          allowNegative: negative,
          allowZero: true
        }).bind('keyup blur', function(event) {
          controller.$setViewValue(element.val().replace(RegExp('\\' + thousands, 'g'), '').replace(RegExp('\\' + decimal, 'g'), '.'));
          controller.$modelValue = parseFloat(element.val().replace(RegExp('\\' + thousands, 'g'), '').replace(RegExp('\\' + decimal, 'g'), '.'));
          return scope.$apply();
        });
        return controller.$render = function() {
          if (controller.$viewValue) {
            return element.val($filter('number')(controller.$viewValue, precision));
          } else {
            return element.val('');
          }
        };
      }
    };
  });

  Katrid.uiKatrid.directive('foreignkey', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, controller) {
        var config, f, multiple, newItem, sel;
        f = scope.view.fields['model'];
        sel = el;
        el.addClass('form-field');
        newItem = function() {};
        config = {
          allowClear: true,
          ajax: {
            url: '/api/rpc/' + scope.model.name + '/get_field_choices/?args=' + attrs.name,
            data: function(term, page) {
              return {
                q: term
              };
            },
            results: function(data, page) {
              var item, msg, r;
              r = (function() {
                var j, len, ref, results;
                ref = data.result;
                results = [];
                for (j = 0, len = ref.length; j < len; j++) {
                  item = ref[j];
                  results.push({
                    id: item[0],
                    text: item[1]
                  });
                }
                return results;
              })();
              if (!multiple) {
                msg = Katrid.i18n.gettext('Create <i>"{0}"</i>...');
                if (sel.data('select2').search.val()) {
                  r.push({
                    id: newItem,
                    text: msg
                  });
                }
              }
              return {
                results: r
              };
            }
          },
          formatResult: function(state) {
            var s;
            s = sel.data('select2').search.val();
            if (state.id === newItem) {
              state.str = s;
              return '<strong>' + state.text.format(s) + '</strong>';
            }
            return state.text;
          },
          initSelection: function(el, cb) {
            var obj, v;
            v = controller.$modelValue;
            if (multiple) {
              v = (function() {
                var j, len, results;
                results = [];
                for (j = 0, len = v.length; j < len; j++) {
                  obj = v[j];
                  results.push({
                    id: obj[0],
                    text: obj[1]
                  });
                }
                return results;
              })();
              return cb(v);
            } else if (v) {
              return cb({
                id: v[0],
                text: v[1]
              });
            }
          }
        };
        multiple = attrs.multiple;
        if (multiple) {
          config['multiple'] = true;
        }
        sel = sel.select2(config);
        sel.on('change', function(e) {
          var obj, service, v;
          v = sel.select2('data');
          if (v.id === newItem) {
            service = new Katrid.Services.Model(scope.view.fields[attrs.name].model);
            return service.createName(v.str).then(function(res) {
              controller.$setDirty();
              controller.$setViewValue(res.result);
              return sel.select2('val', {
                id: res.result[0],
                text: res.result[1]
              });
            });
          } else if (v && multiple) {
            v = (function() {
              var j, len, results;
              results = [];
              for (j = 0, len = v.length; j < len; j++) {
                obj = v[j];
                results.push(obj.id);
              }
              return results;
            })();
            return controller.$setViewValue(v);
          } else {
            controller.$setDirty();
            if (v) {
              return controller.$setViewValue([v.id, v.text]);
            } else {
              return controller.$setViewValue(null);
            }
          }
        });
        return controller.$render = function() {
          var obj, v;
          if (multiple) {
            if (controller.$viewValue) {
              v = (function() {
                var j, len, ref, results;
                ref = controller.$viewValue;
                results = [];
                for (j = 0, len = ref.length; j < len; j++) {
                  obj = ref[j];
                  results.push(obj[0]);
                }
                return results;
              })();
              sel.select2('val', v);
            }
          }
          if (controller.$viewValue) {
            return sel.select2('val', controller.$viewValue[0]);
          } else {
            return sel.select2('val', null);
          }
        };
      }
    };
  });

  uiKatrid.controller('TabsetController', [
    '$scope', function($scope) {
      var ctrl, destroyed, tabs;
      ctrl = this;
      tabs = ctrl.tabs = $scope.tabs = [];
      ctrl.select = function(selectedTab) {
        angular.forEach(tabs, function(tab) {
          if (tab.active && tab !== selectedTab) {
            tab.active = false;
            tab.onDeselect();
          }
        });
        selectedTab.active = true;
        selectedTab.onSelect();
      };
      ctrl.addTab = function(tab) {
        tabs.push(tab);
        if (tabs.length === 1) {
          tab.active = true;
        } else if (tab.active) {
          ctrl.select(tab);
        }
      };
      ctrl.removeTab = function(tab) {
        var index, newActiveIndex;
        index = tabs.indexOf(tab);
        if (tab.active && tabs.length > 1 && !destroyed) {
          newActiveIndex = index === tabs.length - 1 ? index - 1 : index + 1;
          ctrl.select(tabs[newActiveIndex]);
        }
        tabs.splice(index, 1);
      };
      destroyed = void 0;
      $scope.$on('$destroy', function() {
        destroyed = true;
      });
    }
  ]);

  uiKatrid.directive('tabset', function() {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        type: '@'
      },
      controller: 'TabsetController',
      template: "<div>\n" + "  <ul class=\"nav nav-{{type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" + "  <div class=\"tab-content\">\n" + "    <div class=\"tab-pane\" \n" + "         ng-repeat=\"tab in tabs\" \n" + "         ng-class=\"{active: tab.active}\"\n" + "         tab-content-transclude=\"tab\">\n" + "    </div>\n" + "  </div>\n" + "</div>\n",
      link: function(scope, element, attrs) {
        scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
        return scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
      }
    };
  });

  uiKatrid.directive('tab', [
    '$parse', function($parse) {
      return {
        require: '^tabset',
        restrict: 'EA',
        replace: true,
        template: "<li ng-class=\"{active: active, disabled: disabled}\">\n" + "  <a href ng-click=\"select()\" tab-heading-transclude>{{heading}}</a>\n" + "</li>\n",
        transclude: true,
        scope: {
          active: '=?',
          heading: '@',
          onSelect: '&select',
          onDeselect: '&deselect'
        },
        controller: function() {},
        compile: function(elm, attrs, transclude) {
          return function(scope, elm, attrs, tabsetCtrl) {
            scope.$watch('active', function(active) {
              if (active) {
                tabsetCtrl.select(scope);
              }
            });
            scope.disabled = false;
            if (attrs.disabled) {
              scope.$parent.$watch($parse(attrs.disabled), function(value) {
                scope.disabled = !!value;
              });
            }
            scope.select = function() {
              if (!scope.disabled) {
                scope.active = true;
              }
            };
            tabsetCtrl.addTab(scope);
            scope.$on('$destroy', function() {
              tabsetCtrl.removeTab(scope);
            });
            scope.$transcludeFn = transclude;
          };
        }
      };
    }
  ]);

  uiKatrid.directive('tabHeadingTransclude', [
    function() {
      return {
        restrict: 'A',
        require: '^tab',
        link: function(scope, elm, attrs, tabCtrl) {
          scope.$watch('headingElement', function(heading) {
            if (heading) {
              elm.html('');
              elm.append(heading);
            }
          });
        }
      };
    }
  ]);

  uiKatrid.directive('tabContentTransclude', function() {
    var isTabHeading;
    isTabHeading = function(node) {
      return node.tagName && (node.hasAttribute('tab-heading') || node.hasAttribute('data-tab-heading') || node.tagName.toLowerCase() === 'tab-heading' || node.tagName.toLowerCase() === 'data-tab-heading');
    };
    return {
      restrict: 'A',
      require: '^tabset',
      link: function(scope, elm, attrs) {
        var tab;
        tab = scope.$eval(attrs.tabContentTransclude);
        tab.$transcludeFn(tab.$parent, function(contents) {
          angular.forEach(contents, function(node) {
            if (isTabHeading(node)) {
              tab.headingElement = node;
            } else {
              elm.append(node);
            }
          });
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=components.js.map
