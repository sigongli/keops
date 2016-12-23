// Generated by CoffeeScript 1.10.0
(function() {
  var Templates;

  Templates = (function() {
    function Templates() {}

    Templates.prototype.getViewRenderer = function(viewType) {
      return this["render_" + viewType];
    };

    Templates.prototype.getButtons = function(scope) {
      var act, buttons;
      act = scope.action;
      buttons = {
        list: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'list\')"><i class="fa fa-list"></i></button>',
        form: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'form\')"><i class="fa fa-edit"></i></button>',
        calendar: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'calendar\')"><i class="fa fa-calendar"></i></button>',
        chart: '<button class="btn btn-default" type="button" ng-click="action.setViewType(\'chart\')"><i class="fa fa-bar-chart-o"></i></button>'
      };
      return buttons;
    };

    Templates.prototype.getViewButtons = function(scope) {
      var act, buttons, i, len, r, ref, vt;
      act = scope.action;
      buttons = this.getButtons(scope);
      r = [];
      ref = act.viewModes;
      for (i = 0, len = ref.length; i < len; i++) {
        vt = ref[i];
        r.push(buttons[vt]);
      }
      return '<div class="btn-group">' + r.join('') + '</div>';
    };

    Templates.prototype.render_form = function(scope, html) {
      var act, actions, buttons, i, len, ref;
      buttons = this.getViewButtons(scope);
      actions = '';
      if (scope.view.view_actions) {
        ref = scope.view.view_actions;
        for (i = 0, len = ref.length; i < len; i++) {
          act = ref[i];
          actions += "<li><a href=\"javascript:void(0)\" ng-click=\"action.doViewAction('" + act.name + "', record.id)\">" + act.title + "</a></li>";
        }
      }
      return ("<div class=\"data-heading panel panel-default\"> <div class=\"panel-body\"> <div> <a href=\"javascript:void(0)\" title=\"Add to favorite\"><i class=\"fa star fa-star-o pull-right\"></i></a> <ol class=\"breadcrumb\"> <li><a href=\"javascript:void(0)\" ng-click=\"action.setViewType(\'list\')\">${ action.info.display_name }</a></li> <li>${ record.display_name }</li> </ol> <div class=\"pull-right\"> <span> ${recordIndex} / ${records.length} </span> </div> <p class=\"help-block\">${ action.info.usage }&nbsp;</p> </div> <div class=\"toolbar\"> <button class=\"btn btn-primary\" type=\"button\" ng-click=\"action.saveChanges()\">" + (Katrid.i18n.gettext('Save')) + "</button> <button class=\"btn btn-default\" type=\"button\" ng-click=\"action.cancelChanges()\"><i class=\"fa fa-fw fa-remove text-danger\"></i> " + (Katrid.i18n.gettext('Cancel')) + "</button> <div class=\"btn-group\"> <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\"> " + (Katrid.i18n.gettext('Action')) + " <span class=\"caret\"></span></button> <ul class=\"dropdown-menu animated flipInX\"> <li><a href='javascript:void(0)' ng-click=\"action.deleteSelection()\"><i class=\"fa fa-fw fa-trash\"></i> " + (Katrid.i18n.gettext('Delete')) + "</a></li> " + actions + " </ul> </div> <div class=\"pull-right\"> <div class=\"btn-group\" role=\"group\"> <button class=\"btn btn-default\" type=\"button\" ng-click=\"dataSource.prior(\'form\')\"><i class=\"fa fa-chevron-left\"></i> </button> <button class=\"btn btn-default\" type=\"button\" ng-click=\"dataSource.next(\'form\')\"><i class=\"fa fa-chevron-right\"></i> </button> </div>\n " + buttons + " </div> </div> </div> </div><div class=\"content container animated fadeIn\"><div class=\"panel panel-default data-panel\"><div class=\"panel-body\"><div class=\"row\">") + html + "</div></div></div></div>";
      console.log(html);
      return html;
    };

    Templates.prototype.render_list = function(scope, html) {
      var buttons;
      buttons = this.getViewButtons(scope);
      return ("<div class=\"data-heading panel panel-default\"> <div class=\"panel-body\"> <div> <a href=\"javascript:void(0)\" title=\"Add to favorite\"><i class=\"fa star fa-star-o pull-right\"></i></a> <ol class=\"breadcrumb\"> <li>${ action.info.display_name } </li> </ol> <div class=\"pull-right\"> <span> <strong>1 - ${records.length}</strong> of <strong>${recordCount}</strong> </span> </div> <p class=\"help-block\">${ action.info.usage }&nbsp;</p> </div> <div class=\"toolbar\"> <button class=\"btn btn-primary\" type=\"button\" ng-click=\"action.createNew()\">" + (Katrid.i18n.gettext('Create')) + "</button> <div class=\"btn-group\"> <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\"> " + (Katrid.i18n.gettext('Action')) + " <span class=\"caret\"></span></button> <ul class=\"dropdown-menu animated flipInX\"> <li><a href='javascript:void(0)' ng-click=\"action.deleteSelection()\"><i class=\"fa fa-fw fa-trash\"></i> " + (Katrid.i18n.gettext('Delete')) + "</a></li> </ul> </div> <div class=\"pull-right\"> <div class=\"btn-group\"> <button class=\"btn btn-default\" type=\"button\" ng-click=\"action.prior()\"><i class=\"fa fa-chevron-left\"></i> </button> <button class=\"btn btn-default\" type=\"button\" ng-click=\"action.next()\"><i class=\"fa fa-chevron-right\"></i> </button> </div>\n " + buttons + " </div> </div> </div> </div><div class=\"content no-padding\"> <div class=\"panel panel-default data-panel\"> <div class=\"panel-body no-padding\"> <div class=\"dataTables_wrapper form-inline dt-bootstrap no-footer\">") + html + "</div></div></div></div>";
    };

    Templates.prototype.renderList = function(scope, element, attrs, rowClick) {
      var choice, cls, col, cols, fieldInfo, i, j, len, len1, name, ref, ref1, s, ths;
      ths = '';
      cols = '';
      ref = element.children();
      for (i = 0, len = ref.length; i < len; i++) {
        col = ref[i];
        name = $(col).attr('name');
        fieldInfo = scope.view.fields[name];
        if (fieldInfo.choices) {
          fieldInfo._listChoices = {};
          ref1 = fieldInfo.choices;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            choice = ref1[j];
            fieldInfo._listChoices[choice[0]] = choice[1];
          }
        }
        cls = fieldInfo.type + " field-" + name;
        ths += "<th class=\"" + cls + "\"><label>${view.fields." + name + ".caption}</label></th>";
        cls = fieldInfo.type + " field-" + name;
        if (fieldInfo.type === 'ForeignKey') {
          cols += "<td><a href=\"javscript:void(0)\" ng-click=\"$event.stopPropagation();\" data-id=\"${row." + name + "[0]}\">${row." + name + "[1]}</a></td>";
        } else if (fieldInfo._listChoices) {
          cols += "<td class=\"" + cls + "\">${view.fields." + name + "._listChoices[row." + name + "]}</td>";
        } else if (fieldInfo.type === 'BooleanField') {
          cols += "<td>${row." + name + " ? '" + (Katrid.i18n.gettext('yes')) + "' : '" + (Katrid.i18n.gettext('no')) + "'}</td>";
        } else if (fieldInfo.type === 'DecimalField') {
          cols += "<td class=\"" + cls + "\">${row." + name + "|number:2}</td>";
        } else if (fieldInfo.type === 'DateField') {
          cols += "<td class=\"" + cls + "\">${row." + name + "|date:shortDate}</td>";
        } else {
          cols += "<td>${row." + name + "}</td>";
        }
      }
      if (rowClick == null) {
        rowClick = 'dataSource.setRecordIndex($index);action.location.search({view_type: \'form\', id: row.id});';
      }
      s = "<table class=\"table table-striped table-bordered table-hover display responsive nowrap dataTable no-footer dtr-column\">\n<thead><tr>" + ths + "</tr></thead>\n<tbody>\n<tr ng-repeat=\"row in records\" ng-click=\"" + rowClick + "\">" + cols + "</tr>\n</tbody>\n</table>";
      return s;
    };

    return Templates;

  })();

  this.Katrid.UI.Utils = {
    Templates: new Templates()
  };

}).call(this);

//# sourceMappingURL=ui.templ.js.map