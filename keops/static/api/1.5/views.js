// Generated by CoffeeScript 1.10.0
(function() {
  var FacetView, SearchField, SearchFilter, SearchGroup, SearchItem, SearchMenu, SearchQuery, SearchView,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SearchMenu = (function() {
    function SearchMenu(element, parent1, options1) {
      this.element = element;
      this.parent = parent1;
      this.options = options1;
      this.input = this.parent.find('.search-view-input');
      this.input.on('keyup', (function(_this) {
        return function(evt) {
          if (_this.input.val().length) {
            return _this.show();
          } else {
            return _this.close();
          }
        };
      })(this)).on('keydown', (function(_this) {
        return function(evt) {
          var item;
          switch (evt.which) {
            case $.ui.keyCode.BACKSPACE:
              if (_this.input.val() === '') {
                item = _this.searchView.query.items[_this.searchView.query.items.length - 1];
                _this.searchView.onRemoveItem(evt, item);
              }
              break;
          }
        };
      })(this)).on('blur', (function(_this) {
        return function(evt) {
          _this.input.val('');
          return _this.close();
        };
      })(this));
    }

    SearchMenu.prototype.link = function() {
      return this.element.hide();
    };

    SearchMenu.prototype.show = function() {
      return this.element.show();
    };

    SearchMenu.prototype.close = function() {
      this.element.hide();
      return this.reset();
    };

    SearchMenu.prototype.expand = function(item) {
      var scope;
      scope = this.searchView.scope;
      return scope.model.getFieldChoices(item.ref.name, scope.search.text).then((function(_this) {
        return function(res) {
          var j, len, obj, ref1, results;
          if (res.ok) {
            ref1 = res.result;
            results = [];
            for (j = 0, len = ref1.length; j < len; j++) {
              obj = ref1[j];
              results.push(_this.searchView.loadItem(item.item, obj, item));
            }
            return results;
          }
        };
      })(this));
    };

    SearchMenu.prototype.collapse = function(item) {
      var i, j, len, ref1;
      ref1 = item.children;
      for (j = 0, len = ref1.length; j < len; j++) {
        i = ref1[j];
        i.remove();
      }
      return item.children = [];
    };

    SearchMenu.prototype.reset = function() {
      var i, j, len, ref1, results;
      ref1 = this.searchView.items;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        i = ref1[j];
        if (i.children && i.children.length) {
          this.collapse(i);
          results.push(i.reset());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SearchMenu.prototype.select = function(evt, item) {
      if (this.options.select) {
        if (item.parentItem) {
          item.parentItem.value = item.value;
          item = item.parentItem;
        }
        item.searchString = this.input.val();
        this.options.select(evt, item);
        return this.input.val('');
      }
    };

    return SearchMenu;

  })();

  SearchQuery = (function() {
    function SearchQuery(searchView1) {
      this.searchView = searchView1;
      this.items = [];
      this.groups = [];
    }

    SearchQuery.prototype.add = function(item) {
      if (indexOf.call(this.items, item) >= 0) {
        item.facet.addValue(item);
        item.facet.refresh();
      } else {
        this.items.push(item);
        this.searchView.renderFacets();
      }
      if (item instanceof SearchGroup) {
        this.groups.push(item);
      }
      return this.searchView.change();
    };

    SearchQuery.prototype.remove = function(item) {
      this.items.splice(this.items.indexOf(item), 1);
      item.facet.element.remove();
      delete item.facet;
      if (item instanceof SearchGroup) {
        this.groups.splice(this.groups.indexOf(item), 1);
      }
      return this.searchView.change();
    };

    SearchQuery.prototype.getParams = function() {
      var i, j, len, r, ref1;
      r = [];
      ref1 = this.items;
      for (j = 0, len = ref1.length; j < len; j++) {
        i = ref1[j];
        r = r.concat(i.getParamValues());
      }
      console.log('params', r);
      return r;
    };

    return SearchQuery;

  })();

  FacetView = (function() {
    function FacetView(item1) {
      this.item = item1;
      this.values = [
        {
          searchString: this.item.getDisplayValue(),
          value: this.item.value
        }
      ];
    }

    FacetView.prototype.addValue = function(item1) {
      this.item = item1;
      return this.values.push({
        searchString: this.item.getDisplayValue(),
        value: this.item.value
      });
    };

    FacetView.prototype.templateValue = function() {
      var s, sep;
      sep = " <span class=\"facet-values-separator\">" + (Katrid.i18n.gettext('or')) + "</span> ";
      return ((function() {
        var j, len, ref1, results;
        ref1 = this.values;
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          s = ref1[j];
          results.push(s.searchString);
        }
        return results;
      }).call(this)).join(sep);
    };

    FacetView.prototype.template = function() {
      var s;
      s = "<span class=\"facet-label\">" + (this.item.getFacetLabel()) + "</span>";
      return "<div class=\"facet-view\">\n" + s + "\n<span class=\"facet-value\">" + (this.templateValue()) + "</span>\n<span class=\"fa fa-sm fa-remove facet-remove\"></span>\n</div>";
    };

    FacetView.prototype.link = function(searchView) {
      var html, rm;
      html = $(this.template());
      this.item.facet = this;
      this.element = html;
      rm = html.find('.facet-remove');
      rm.click((function(_this) {
        return function(evt) {
          return searchView.onRemoveItem(evt, _this.item);
        };
      })(this));
      return html;
    };

    FacetView.prototype.refresh = function() {
      return this.element.find('.facet-value').html(this.templateValue());
    };

    return FacetView;

  })();

  SearchItem = (function() {
    function SearchItem(name1, item1, parent1, ref1, menu1) {
      this.name = name1;
      this.item = item1;
      this.parent = parent1;
      this.ref = ref1;
      this.menu = menu1;
      this.label = this.item.attr('label') || (this.ref && this.ref['caption']) || this.name;
    }

    SearchItem.prototype.templateLabel = function() {
      return " Pesquisar <i>" + this.label + "</i> por: <strong>${search.text}</strong>";
    };

    SearchItem.prototype.template = function() {
      var s;
      s = '';
      if (this.expandable) {
        s = "<a class=\"expandable\" href=\"#\"></a>";
      }
      if (this.value) {
        s = "<a class=\"search-menu-item indent\" href=\"#\">" + this.value[1] + "</a>";
      } else {
        s += "<a href=\"#\" class=\"search-menu-item\">" + (this.templateLabel()) + "</a>";
      }
      return "<li>" + s + "</li>";
    };

    SearchItem.prototype.link = function(scope, $compile, parent) {
      var html;
      html = $compile(this.template())(scope);
      if (parent != null) {
        html.insertAfter(parent.element);
        parent.children.push(this);
        this.parentItem = parent;
      } else {
        html.appendTo(this.parent);
      }
      this.element = html;
      this.itemEl = html.find('.search-menu-item').click(function(evt) {
        return evt.preventDefault();
      }).mousedown((function(_this) {
        return function(evt) {
          evt.stopPropagation();
          evt.preventDefault();
          _this.menu.select(evt, _this);
          return _this.menu.close();
        };
      })(this));
      this.expand = html.find('.expandable').on('mousedown', (function(_this) {
        return function(evt) {
          _this.expanded = !_this.expanded;
          evt.stopPropagation();
          evt.preventDefault();
          $(evt.target).toggleClass('expandable expanded');
          if (_this.expanded) {
            return _this.searchView.menu.expand(_this);
          } else {
            return _this.searchView.menu.collapse(_this);
          }
        };
      })(this)).click(function(evt) {
        return evt.preventDefault();
      });
      return false;
    };

    SearchItem.prototype.getFacetLabel = function() {
      console.log('get facet label');
      return this.label;
    };

    SearchItem.prototype.getDisplayValue = function() {
      if (this.value) {
        return this.value[1];
      }
      return this.searchString;
    };

    SearchItem.prototype.getValue = function() {
      var s;
      return (function() {
        var j, len, ref1, results;
        ref1 = this.facet.values;
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          s = ref1[j];
          results.push(s.value || s.searchString);
        }
        return results;
      }).call(this);
    };

    SearchItem.prototype.getParamValue = function(name, value) {
      var r;
      r = {};
      if ($.isArray(value)) {
        r[name] = value[0];
      } else {
        r[name + '__icontains'] = value;
      }
      return r;
    };

    SearchItem.prototype.getParamValues = function() {
      var j, len, r, ref1, v;
      r = [];
      ref1 = this.getValue();
      for (j = 0, len = ref1.length; j < len; j++) {
        v = ref1[j];
        r.push(this.getParamValue(this.name, v));
      }
      if (r.length > 1) {
        return [
          {
            'OR': r
          }
        ];
      }
      return r;
    };

    SearchItem.prototype.remove = function() {
      return this.element.remove();
    };

    SearchItem.prototype.reset = function() {
      this.expanded = false;
      this.expand.removeClass('expanded');
      return this.expand.addClass('expandable');
    };

    return SearchItem;

  })();

  SearchField = (function(superClass) {
    extend(SearchField, superClass);

    function SearchField(name, item, parent, ref, menu) {
      if (ref.type === 'ForeignKey') {
        this.expandable = true;
        this.children = [];
      } else {
        this.expandable = false;
      }
      SearchField.__super__.constructor.call(this, name, item, parent, ref, menu);
    }

    return SearchField;

  })(SearchItem);

  SearchFilter = (function(superClass) {
    extend(SearchFilter, superClass);

    function SearchFilter() {
      return SearchFilter.__super__.constructor.apply(this, arguments);
    }

    return SearchFilter;

  })(SearchItem);

  SearchGroup = (function(superClass) {
    extend(SearchGroup, superClass);

    function SearchGroup(name, item, parent, ref, menu) {
      var ctx;
      SearchGroup.__super__.constructor.call(this, name, item, parent, ref, menu);
      ctx = item.attr('context');
      console.log(item);
      if (typeof ctx === 'string') {
        this.context = JSON.parse(ctx);
      } else {
        this.context = {
          grouping: [name]
        };
      }
    }

    SearchGroup.prototype.getFacetLabel = function() {
      return '<span class="fa fa-bars"></span>';
    };

    SearchGroup.prototype.templateLabel = function() {
      return Katrid.i18n.gettext('Group by:') + ' ' + this.label;
    };

    SearchGroup.prototype.getDisplayValue = function() {
      return this.label;
    };

    return SearchGroup;

  })(SearchItem);

  SearchView = (function() {
    function SearchView(scope1, options) {
      this.scope = scope1;
      this.onRemoveItem = bind(this.onRemoveItem, this);
      this.onSelectItem = bind(this.onSelectItem, this);
      this.query = new SearchQuery(this);
      this.items = [];
    }

    SearchView.prototype.createMenu = function(scope, el, parent) {
      var menu;
      menu = new SearchMenu(el, parent, {
        select: this.onSelectItem
      });
      menu.searchView = this;
      return menu;
    };

    SearchView.prototype.template = function() {
      var html;
      return html = "<div class=\"search-area\">\n  <div class=\"search-view\">\n    <div class=\"search-view-facets\"></div>\n    <input class=\"search-view-input\" role=\"search\" placeholder=\"" + (Katrid.i18n.gettext('Search...')) + "\" ng-model=\"search.text\">\n    <span class=\"search-view-more fa fa-search-plus\"></span>\n  </div>\n  <div class=\"col-sm-12\">\n  <ul class=\"dropdown-menu search-view-menu\" role=\"menu\"></ul>\n  </div>\n</div>";
    };

    SearchView.prototype.link = function(scope, el, attrs, controller, $compile) {
      var html, item, j, len, ref1;
      html = $compile(this.template())(scope);
      el.replaceWith(html);
      html.addClass(attrs["class"]);
      this.$compile = $compile;
      this.view = scope.views.search;
      this.viewContent = $(this.view.content);
      this.element = html;
      this.searchView = html.find('.search-view');
      html.find('.search-view-more').click((function(_this) {
        return function(evt) {
          $(evt.target).toggleClass('fa-search-plus fa-search-minus');
          return _this.viewMoreToggle();
        };
      })(this));
      this.menu = this.createMenu(scope, $(html.find('.dropdown-menu.search-view-menu')), html);
      this.menu.searchView = this;
      this.menu.link();
      this.menu.input.on('keydown', function(evt) {});
      ref1 = this.viewContent.children();
      for (j = 0, len = ref1.length; j < len; j++) {
        item = ref1[j];
        this.loadItem($(item));
      }
    };

    SearchView.prototype.loadItem = function(item, value, parent, cls) {
      var grouping, j, len, name, ref1, tag;
      tag = item.prop('tagName');
      if (cls == null) {
        if (tag === 'FIELD') {
          cls = SearchField;
        } else if (tag === 'FILTER') {
          cls = SearchFilter;
        } else if (tag === 'GROUP') {
          console.log('group', item);
          ref1 = item.children();
          for (j = 0, len = ref1.length; j < len; j++) {
            grouping = ref1[j];
            this.loadItem($(grouping), null, null, SearchGroup);
          }
          return;
        }
      }
      name = item.attr('name');
      item = new cls(name, item, this.menu.element, this.view.fields[name], this.menu);
      item.searchView = this;
      if (value) {
        item.expandable = false;
        item.value = value;
      }
      item.link(this.scope, this.$compile, parent);
      return this.items.push(item);
    };

    SearchView.prototype.renderFacets = function() {
      var el, f, item, j, len, ref1, results;
      ref1 = this.query.items;
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        item = ref1[j];
        if (!item.facet) {
          f = new FacetView(item);
          el = f.link(this);
          results.push(el.insertBefore(this.menu.input));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SearchView.prototype.viewMoreToggle = function() {
      this.viewMore = !this.viewMore;
      return this.scope.$apply((function(_this) {
        return function() {
          console.log(_this.viewMore);
          return _this.scope.search.viewMoreButtons = _this.viewMore;
        };
      })(this));
    };

    SearchView.prototype.onSelectItem = function(evt, obj) {
      return this.query.add(obj);
    };

    SearchView.prototype.onRemoveItem = function(evt, obj) {
      return this.query.remove(obj);
    };

    SearchView.prototype.change = function() {
      if (this.query.groups.length || (this.scope.dataSource.groups && this.scope.dataSource.groups.length)) {
        this.scope.action.applyGroups(this.query.groups);
      }
      if (this.query.groups.length === 0) {
        return this.scope.action.setSearchParams(this.query.getParams());
      }
    };

    return SearchView;

  })();

  Katrid.UI.Views = {
    SearchView: SearchView,
    SearchMenu: SearchMenu
  };

}).call(this);

//# sourceMappingURL=views.js.map
