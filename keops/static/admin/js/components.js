var ui = angular.module('ui.erp', []);

ui.directive('field', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        link: function(tElement, tAttrs) {

        },
        compile: function (element, attrs) {
            var html = "";
            var fieldAttrs = "";
            var el = $(element[0]);
            var tp = attrs.type;
            if (!tp) tp = "text";
            var nm = attrs.ngModel;
            var lbl = attrs.label;
            var cols = attrs.cols;
            var cls = attrs.class;
            if (!cls) cls = '';
            if ((tp === "decimal") || (tp === "int")) cls = 'text-right';
            if (cls) {
                fieldAttrs += ' class="' + cls + '"';
            }
            var v = attrs.required;
            if (v) {
                v = v.value;
                if (v && (v !== 'false')) fieldAttrs += ' required="true"';
            }
            if (attrs.placeholder) fieldAttrs += ' placeholder="' + attrs.placeholder + '"';
            if (attrs.required) fieldAttrs += ' required';
            if (attrs.maxlength && !attrs.mask) fieldAttrs += ' maxlength="' + attrs.maxlength + '"';
            if (attrs.ngMaxlength) fieldAttrs += ' ng-maxlength="' + attrs.ngMaxlength + '"';
            if (attrs.ngMinlength) fieldAttrs += ' ng-minlength="' + attrs.ngMinlength + '"';
            if (attrs.ngChange) fieldAttrs += ' ng-change="' + attrs.ngChange + '"';
            if (nm) {
                var _nm = nm.split('.');
                var elname = _nm[_nm.length - 1];
                fieldAttrs += ' name="' + elname + '"';
                fieldAttrs += ' id="id_' + elname + '"';
                fieldAttrs += ' ng-model="' + nm + '"';
            }
            var pre = '';
            var pos = '';
            if (attrs.icon) pre = '<i class="icon-prepend ' + attrs.icon + '"></i>';
            if (attrs.mask) fieldAttrs += ' ui-mask="' + attrs.mask + '"';
            if (attrs.helpText) {
                pre += '<i class="icon-append fa fa-question-circle"></i>';
                pos += '<b class="tooltip tooltip-top-right"><i class="fa fa-warning txt-color-teal"></i> ' + attrs.helpText + ' </b>';
            }
            if (tp === "decimal") {
                html = '<label class="input">' + pre + '<input type="text" decimal="decimal" ' + fieldAttrs + '>' + pos + el.html() + '</label>';
            } else if (tp === "int") {
                html = '<label class="input">' + pre + '<input type="text" decimal="decimal" precision="0" ' + fieldAttrs + '>' + pos + el.html() + '</label>';
            } else if (tp === "text") {
                html = pre + '<input class="form-control" type="text" ' + fieldAttrs + '/>' + pos + el.html();
            } else if (tp === "select") {
                html = '<select class="form-control" ' + fieldAttrs + '>' + el.html() + '</select>';
            } else if (tp === "checkbox") {
                html = '<label class="checkbox"><input type="checkbox" ' + fieldAttrs + '><i></i>' + el.html() + '</label>';
            } else if (tp === "textarea") {
                html = pre + '<textarea class="form-control" ' + fieldAttrs + '>' + el.html() + '</textarea>' + pos;
            } else if (tp === 'lookup') {
                if (attrs.multiple) fieldAttrs += ' multiple';
                html = '<input type="text" ' + fieldAttrs + ' ui-select="' + attrs.contentField + '" style="width: 100%;" />';
            } else if (tp === 'date') {
                html = '<input class="form-control" type="text" ' + fieldAttrs + ' ui-datepicker ui-mask="99/99/9999"/>';
            } else if (tp === 'grid') {
                html = '<div>' + el.html() + '</div>';
                console.log('html field', html);
            }
            if (lbl) {
                console.log(lbl);
                lbl = '<label class="control-label" for="id_' + elname + '">' + lbl + '</label>';
            } else lbl = '';
            if (cols) {
                cols = 'class="col-sm-' + cols + '"';
            } else cols = "class='col-sm-12'";
            html = '<section ' + cols + '>' + lbl + html + '</section>';
            element.replaceWith($(html));
        }
    }
});


ui.directive('formset', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        template: function (tElement, attrs) {
            var html = tElement.html();
            var cols = tElement.children();
            var nm = attrs.name;
            var r = '<fieldset><div ng-init="form.loadFormset(\'' + nm + '\')">' +
                '<div class="row" ng-form="' + nm + '.{{$index}}" ng-repeat="subform in form.data.' + nm + '">' +
                html +
                '</div>' +
                '<div class="col-sm-12 margin-top-10"><button type="button" class="btn btn-default btn-sm" ng-click="form.data.' + nm + '.push({})">Adicionar</button></div>' +
                '</div></fieldset>';
            return r;
        }
    }
});


ui.directive('actions', function ($compile) {
    return {
        restrict: 'E',
        replace: true,
        template: function (tElement, attrs) {
            var html = tElement.html();
            var groups = tElement.children();
            var r = '<div class="actions">';
            groups.each(function () {
                var group = this;
                var _attrs = '';
                $(group.attributes).each(function() { if (this.nodeName != 'class') _attrs += ' ' + this.nodeName + '="' + this.nodeValue + '"'; });
                var cls = $(group).attr('class');
                if (!cls) cls = 'btn-default';
                if (group.nodeName === 'ACTION') {
                    r += '<button class="btn btn-margin ' + cls + '"' + _attrs + '>' + group.innerHTML + '</button>';
                }
                else if (group.nodeName === 'ACTION-GROUP') {
                    r += '<div class="btn-group btn-margin"><a class="btn dropdown-toggle ' + cls + '"' + _attrs + ' data-toggle="dropdown" href="javascript:void(0);">' + $(group).attr('heading') + ' <span class="caret"></span></a><ul class="dropdown-menu" role="menu">';
                    var actions = $(group).children();
                    actions.each(function() {
                        var action = this;
                        r += '<li><a href="javascript:void(0);">' + action.innerHTML + '</a></li>'
                        //'<div class="btn-group btn-margin"><a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">Ações <span class="caret"></span></a><ul class="dropdown-menu"><li><a href="javascript:void(0);">Exportar Dados</a></li></ul></div>'
                    });
                    r += '</ul></div>'
                }
            });
            return r + '</div>';
        }
    }
});


ui.directive('contentObject', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        template: function(tElement, tAttrs) {
            var attrs = tAttrs;
            var html = tElement.html();
            var node = tElement[0].nodeName;
            if (node === 'LIST') {
                var cols = tElement.children();
                var th = '<th class="checkbox-action"><input id="action-toggle" type="checkbox" ng-click="toggleCheckAll();" /></th>';
                var td = '<td><input type="checkbox" class="action-select" ng-click="selectItem(item)" /></td>';
                for (var i=0;i<cols.length;i++) {
                    var col = $(cols[i]);
                    if (col[0].nodeName === 'ACTIONS') { var actions = col[0]; continue; }
                    var css = col.attr('class');
                    if (!css) css = '';
                    else css = ' class="' + css + '"';
                    var lbl = col.attr('label');
                    if (!lbl) lbl = '';
                    th += '<th' + css + '>' + col.attr('label') + '</th>';
                    td += '<td ' + css + ' ng-click="list.itemClick(item)" ng-bind="item.' + col.attr('name') + '"></td>';
                }

                    var model = attrs.contentObject;

                    var paginator = '<div class="pull-right nav-paginator">' +
                        '<label class="nav-recno-info">1-{{ list.items.length }} de {{ list.total }}</label>' +
                        '<a class="btn btn-default"><i class="fa fa-chevron-left"></i></a>' +
                        '<a class="btn btn-default"><i class="fa fa-chevron-right"></i></a>' +
                        '</div>';

                    var nhtml = '<div ng-controller="ListController">' +
                        '<div class="row view-header">' +
                        '<div>' +
                        '<div>' +
                        '<h1 class="page-title txt-color-blueDark col-sm-6"><i class="fa fa-table fa-fw "></i>' + attrs.viewTitle + '</h1>' +
                        '<form class="header-search pull-right">' +
                        '<input id="search-fld" type="text" placeholder="Busca rápida" ng-model="queryField" ng-enter="list.query(queryField)">' +
                        '<button type="button" ng-click="list.query(queryField)"><i class="fa fa-search"></i></button><a href="javascript:void(0);" id="cancel-search-js" title="Cancel Search"><i class="fa fa-times"></i></a></form>' +
                        '</div>' +
                        '<div class="col-sm-12 view-toolbar">' +
                        '<button class="btn btn-danger view-toolbutton" ng-click="showForm()"> Criar </button>' +
                        '<button class="btn btn-default view-toolbutton" ng-show="selection" ng-click="list.deleteSelection();">' +
                        '<span class="glyphicon glyphicon-trash"></span> Excluir</button>' +
                        //actions.outerHTML +
                        '<div class="btn-group view-toolbutton">' +
                        '<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);">Ações <span class="caret"></span></a>' +
                        '<ul class="dropdown-menu"><li><a href="javascript:void(0);">Exportar Dados</a></li></ul>' +
                        '</div>' +
                        '<div class="btn-group pull-right view-mode-buttons"><button type="button" class="btn btn-default active" title="Ir para pesquisa"><i class="fa fa-table"></i></button><button type="button" class="btn btn-default" title="Exibir formulário" ng-click="showForm(list.items[0].pk)"><i class="fa fa-edit"></i></button></div>' +
                        '</div>' +
                        '</div></div>' +
                        '<div class="row"><article class="col-sm-12">' +
                        '<div>' +
                        '<div role="content">' +
                        '<div class="list-content">' +
                        '<div><div class="col-sm-6"><p class="row" ng-show="selection === 1">{{ selection }} Item selecionado.</p>' +
                        '<p class="row" ng-show="selection > 1">{{ selection }} Itens selecionados.</p>' +
                        '<p class="row" ng-show="!selection">Nenhum item selecionado.</p></div>' +
                        '<div class="pull-right" style="margin-top: -4px;">' +
                        paginator +
                        '</div>' +
                        '</div>' +
                        '<table class="table table-hover table-bordered table-striped table-condensed" ng-init="list.init(\'' + model + '\', list.q);"><thead><tr>' + th + '</tr></thead>' +
                        '<tbody>' +
                        '<tr ng-repeat="item in list.items" class="table-row-clickable">' +
                        td +
                        '</tr></tbody></table>' +
                        '<div class="dt-toolbar-footer"><div class="col-sm-6 col-xs-12 hidden-xs">' +
                        '<div>Total de Registros: {{ list.total | number }}<br />' +
                        'Exibindo de <span class="txt-color-darken">{{ list.start - list.items.length + 1 }}</span> até <span class="txt-color-darken">{{ list.start }}</span></div></div>' +
                        '<div class="col-sm-6 col-xs-12">' +
                        '<div class="data-table-paginate paging_simple_numbers" style="margin-top: 0">' +
                            paginator +
                        '</div></div></div>' +
                        '</div></div></div>' +
                        '</article></div></div>';
                    return nhtml;

            }
            else {
                var model = attrs.contentObject;
                var nhtml = '<div ng-controller="FormController" ng-init="form.init(\'' + model + '\')">' +
                    '<div class="row view-header">' +
                    '<div class="col-sm-12">' +
                    '<div class="pull-right nav-paginator" style="margin-top: 10px">' +
                    '<label class="nav-recno-info">1 / 1</label>' +
                    '<a class="btn btn-default"><i class="fa fa-chevron-left"></i></a>' +
                    '<a class="btn btn-default"><i class="fa fa-chevron-right"></i></a>' +
                    '</div>' +
                    '<h1 class="page-title txt-color-blueDark">' +
                    '<i class="fa-fw fa fa-pencil-square-o"></i>' + attrs.viewTitle + ' <span>/ {{ form.data.__str__ }}</span><span ng-show="!form.data.pk">&nbsp;</span></h1>' +
                    '</div><div class="col-sm-12 view-toolbar">' +
                    '<button type="button" class="btn btn-danger view-toolbutton" title="Salvar" ng-click="submit()">Salvar</button>' +
                    '<button ng-click="showList()" class="btn btn-default view-toolbutton">Cancelar</button>' +
                    '<div class="btn-group pull-right view-mode-buttons"><button type="button" class="btn btn-default" title="Ir para pesquisa" ng-click="showList()"><i class="fa fa-table"></i></button><button type="button" class="btn btn-default active" title="Exibir formulário"><i class="fa fa-edit"></i></button></div>' +
                    '</div></div>' +
                    '<div class="row">' +
                    '<div class="form-content"> ' +
                    '<div>' +
                    '<div class="widget-body">' +
                    '<form name="dataForm" ng-submit="submit()" novalidate>' +
                    html +
                    '</form></div></div></div></div></div>';
                return nhtml;
            }
        }
    }
});

ui.directive('grid', function($compile) {
    return {
        restrict: 'E',
        replace: true,
        template: function(tElement, tAttrs) {
            var cols = tElement.children();
            var th = '';
            var td = '';
            var model = 'none';
            for (var i=0;i<cols.length;i++) {
                var col = $(cols[i]);
                var css = col.attr('class');
                if (!css) css = '';
                else css = ' class="' + css + '"';
                var lbl = col.attr('label');
                if (!lbl) lbl = '';
                th += '<th' + css + '>' + col.attr('label') + '</th>';
                td += '<td ' + css + ' ng-click="item.click(item)" ng-bind="item.' + col.attr('name') + '"></td>';
            }
            var nhtml = '<div class="data-grid"><table class="table table-hover table-bordered table-striped table-condensed" ng-init="list.init(\'' + model + '\', list.q);">' +
                '<thead>' +
                '<tr>' + th +
                '</tr></thead>' +
                '<tbody>' +
                '<tr ng-repeat="item in list.items" class="table-row-clickable">' +
                td +
                '</tr></tbody></table></div>';
            console.log(nhtml);
            return nhtml;
        }
    }
});



ui.directive('uiSelect', function ($location) {
    return {
        restrict: 'A',
        require : 'ngModel',
        link: function(scope, element, attrs, controller) {
            var multiple = attrs.multiple;
            var allowCreate = false;
            var fname = attrs.uiSelect.split('.');
            var m = fname[0] + '.' + fname[1];
            var f = fname[2];
            var cfg = {
                ajax: {
                    url: '/api/content/' + fname[0] + '/' + fname[1] + '/',
                    dataType: 'json',
                    quietMillis: 500,
                    data: function (term, page) {
                        return {
                            mode: 'lookup',
                            field: f,
                            q: term,
                            t: 1,
                            p: page - 1
                        }
                    },
                    results: function (data, page) {
                        data = data.items;
                        var more = (page * 10) < data.count;
                        if (!multiple && (page === 1)) {
                            data.splice(0, 0, {id: null, text: '---------'});
                        }
                        if (allowCreate && !more) data.data.push({id: {}, text: '<b><i>' + 'Create new...' + '</i></b>'});
                        return { results: data, more: more };
                    }
                },
                initSelection: function (element, callback) {
                    var v = controller.$modelValue;
                    if (v) {
                        if (multiple) {
                            var values = [];
                            for (var i=0;i<v.length;i++) values.push({id: v[i][0], text: v[i][1]});
                            callback(values);
                        }
                        else
                            callback({id: v[0], text: v[1]})
                    }
                }
            };
            if (multiple) cfg['multiple'] = true;
            var el = element.select2(cfg);
            element.on('$destroy', function() {
                $('.select2-hidden-accessible').remove();
                $('.select2-drop').remove();
                $('.select2-drop-mask').remove();
            });
            el.on('change', function(e) {
                controller.$setDirty();
                scope.$apply();
            });

            controller.$render = function () {
                if (controller.$viewValue)
                    element.select2('val', controller.$viewValue);
            };
        }
    }
});

ui.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                event.preventDefault();
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
            }
        });
    };
});

ui.directive('decimal', function ($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {

            var precision = attrs.precision || 2;

            //            $(function() {
            var thousands = attrs.uiMoneyThousands || ".";
            var decimal = attrs.uiMoneyDecimal || ",";
            var symbol = attrs.uiMoneySymbol;
            var negative = attrs.uiMoneyNegative || true;
            var el = element.maskMoney({ symbol: symbol, thousands: thousands, decimal: decimal, precision: precision, allowNegative: negative, allowZero: true }).
            bind('keyup blur', function (event) {
                controller.$setViewValue(element.val().replace(RegExp('\\' + thousands, 'g'), '').replace(RegExp('\\' + decimal, 'g'), '.'));
                scope.$apply();
            }
            );
            //            });

            controller.$render = function () {
                if (controller.$viewValue) element.val($filter('number')(controller.$viewValue, precision));
                else element.val('');
            };

        }
    }
});

ui.directive('uiDatepicker', function ($location) {
    return {
        restrict: 'A',
        require : 'ngModel',
        priority: 1,
        link: function(scope, element, attrs, controller) {
            var el = element.datepicker({
                dateFormat: 'dd/mm/yy',
                prevText: '<i class="fa fa-chevron-left"></i>',
			    nextText: '<i class="fa fa-chevron-right"></i>'
            });
        }
    }
});

ui.directive('uiMask', function ($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var el = element.mask(attrs.uiMask);
        }
    }
});