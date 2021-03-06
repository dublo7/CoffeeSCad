// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Library, MainMenuView, Project, ProjectFile, RecentFilesView, examples, mainMenu_template, marionette, sF_template, _, _ref;
    $ = require('jquery');
    _ = require('underscore');
    marionette = require('marionette');
    require('bootstrap');
    require('bootbox');
    mainMenu_template = require("text!templates/mainMenu.tmpl");
    sF_template = require("text!templates/menuFiles.tmpl");
    examples = require("modules/examples");
    _ref = require("modules/project"), Library = _ref.Library, Project = _ref.Project, ProjectFile = _ref.ProjectFile;
    RecentFilesView = (function(_super) {

      __extends(RecentFilesView, _super);

      function RecentFilesView() {
        this.onRender = __bind(this.onRender, this);
        return RecentFilesView.__super__.constructor.apply(this, arguments);
      }

      RecentFilesView.prototype.template = sF_template;

      RecentFilesView.prototype.tagName = "li";

      RecentFilesView.prototype.onRender = function() {
        return this.$el.attr("id", this.model.get("name"));
      };

      return RecentFilesView;

    })(Backbone.Marionette.ItemView);
    MainMenuView = (function(_super) {
      var _this = this;

      __extends(MainMenuView, _super);

      MainMenuView.prototype.template = mainMenu_template;

      MainMenuView.prototype.tagName = "ul";

      MainMenuView.prototype.itemView = RecentFilesView;

      MainMenuView.prototype.itemViewContainer = "#recentFilesList";

      MainMenuView.prototype.ui = {
        dirtyStar: "#dirtyStar",
        examplesList: "#examplesList"
      };

      MainMenuView.prototype.triggers = {
        "mouseup .newFile": "file:new:mouseup",
        "mouseup .saveFile": "file:save:mouseup",
        "mouseup .saveFileAs": "file:saveas:mouseup",
        "mouseup .loadFile": "file:load:mouseup",
        "mouseup .newProject": "project:new:mouseup",
        "mouseup .settings": "settings:mouseup",
        "mouseup .undo": "file:undo:mouseup",
        "mouseup .redo": "file:redo:mouseup",
        "mouseup .parseCSG": "csg:parserender:mouseup",
        "mouseup .downloadStl": "download:stl:mouseup"
      };

      MainMenuView.prototype.events = {
        "mouseup .loadFileDirect": "requestFileLoad",
        "mouseup .showEditor": "showEditor",
        "mouseup #aboutBtn": "showAbout",
        "mouseup .exampleProject": "loadExample"
      };

      MainMenuView.prototype.templateHelpers = {
        dirtyStar: function() {
          if (MainMenuView.model != null) {
            if (MainMenuView.model.dirty) {
              return "*";
            } else {
              return "";
            }
          } else {
            return "";
          }
        }
      };

      MainMenuView.prototype.requestFileLoad = function(ev) {
        var fileName;
        fileName = $(ev.currentTarget).html();
        return this.app.vent.trigger("fileLoadRequest", fileName);
      };

      MainMenuView.prototype.showEditor = function(ev) {
        return this.app.vent.trigger("editorShowRequest");
      };

      MainMenuView.prototype.showAbout = function(ev) {
        return bootbox.dialog("<b>Coffeescad v0.1</b> (experimental)<br/><br/>\nLicenced under the MIT Licence<br/>\n@2012 by Mark 'kaosat-dev' Moissette\n", [
          {
            label: "Ok",
            "class": "btn-inverse"
          }
        ], {
          "backdrop": false,
          "keyboard": true,
          "animate": false
        });
      };

      function MainMenuView(options) {
        this.loadExample = __bind(this.loadExample, this);

        this.modelSaved = __bind(this.modelSaved, this);

        this.modelChanged = __bind(this.modelChanged, this);

        this.showAbout = __bind(this.showAbout, this);

        this.showEditor = __bind(this.showEditor, this);

        this.requestFileLoad = __bind(this.requestFileLoad, this);

        var _this = this;
        MainMenuView.__super__.constructor.call(this, options);
        this.app = require('app');
        this.bindTo(this.model, "change", this.modelChanged);
        this.bindTo(this.model, "allSaved", this.modelSaved);
        this.on("file:new:mouseup", function() {
          return _this.app.vent.trigger("fileNewRequest", _this);
        });
        this.on("file:undo:mouseup", function() {
          if (!$('#undoBtn').hasClass("disabled")) {
            return _this.app.vent.trigger("undoRequest", _this);
          }
        });
        this.on("file:redo:mouseup", function() {
          if (!$('#redoBtn').hasClass("disabled")) {
            return _this.app.vent.trigger("redoRequest", _this);
          }
        });
        this.on("csg:parserender:mouseup", function() {
          if (!$('#updateBtn').hasClass("disabled")) {
            return _this.app.vent.trigger("parseCsgRequest", _this);
          }
        });
        this.on("download:stl:mouseup", function() {
          if (!$('#exportStl').hasClass("disabled")) {
            return _this.app.vent.trigger("downloadStlRequest", _this);
          }
        });
        this.app.vent.bind("undoAvailable", function() {
          return $('#undoBtn').removeClass("disabled");
        });
        this.app.vent.bind("redoAvailable", function() {
          return $('#redoBtn').removeClass("disabled");
        });
        this.app.vent.bind("undoUnAvailable", function() {
          return $('#undoBtn').addClass("disabled");
        });
        this.app.vent.bind("redoUnAvailable", function() {
          return $('#redoBtn').addClass("disabled");
        });
        this.app.vent.bind("clearUndoRedo", function() {
          $('#undoBtn').addClass("disabled");
          return $('#redoBtn').addClass("disabled");
        });
        this.app.vent.bind("modelChanged", function() {
          $('#updateBtn').removeClass("disabled");
          return $('#exportStl').addClass("disabled");
        });
        this.app.vent.bind("parseCsgDone", function() {
          $('#updateBtn').addClass("disabled");
          return $('#exportStl').removeClass("disabled");
        });
        this.app.vent.bind("stlGenDone", function(blob) {
          var fileName, tmpLnk;
          tmpLnk = $("#exportStlLink");
          fileName = _this.app.project.get("name");
          tmpLnk.prop("download", "" + fileName + ".stl");
          return tmpLnk.prop("href", blob);
        });
      }

      MainMenuView.prototype.switchModel = function(newModel) {
        this.model = newModel;
        this.bindTo(this.model, "dirtied", this.modelChanged);
        this.bindTo(this.model, "allSaved", this.modelSaved);
        return this.render();
      };

      MainMenuView.prototype.modelChanged = function(model, value) {
        return this.ui.dirtyStar.text("*");
      };

      MainMenuView.prototype.modelSaved = function(model) {
        return this.ui.dirtyStar.text("");
      };

      MainMenuView.prototype.loadExample = function(ev) {
        var index, mainPart, project,
          _this = this;
        index = ev.currentTarget.id;
        project = new Project({
          name: examples[index].name
        });
        mainPart = new ProjectFile({
          name: "mainPart",
          ext: "coscad",
          content: examples[index].content
        });
        project.add(mainPart);
        if (this.app.project.dirty) {
          return bootbox.dialog("Project is unsaved, proceed anyway?", [
            {
              label: "Ok",
              "class": "btn-inverse",
              callback: function() {
                _this.app.project = project;
                _this.app.mainPart = mainPart;
                _this.app.codeEditorView.switchModel(_this.app.mainPart);
                _this.app.glThreeView.switchModel(_this.app.mainPart);
                return _this.app.mainMenuView.switchModel(_this.app.project);
              }
            }, {
              label: "Cancel",
              "class": "btn-inverse",
              callback: function() {}
            }
          ]);
        } else {
          this.app.project = project;
          this.app.mainPart = mainPart;
          this.app.codeEditorView.switchModel(this.app.mainPart);
          this.app.glThreeView.switchModel(this.app.mainPart);
          return this.app.mainMenuView.switchModel(this.app.project);
        }
      };

      MainMenuView.prototype.onRender = function() {
        var example, index, _results;
        this.ui.examplesList.html("");
        _results = [];
        for (index in examples) {
          example = examples[index];
          _results.push(this.ui.examplesList.append("<li id='" + index + "' class='exampleProject'><a href=#> " + example.name + "</a> </li>"));
        }
        return _results;
      };

      return MainMenuView;

    }).call(this, marionette.CompositeView);
    return MainMenuView;
  });

}).call(this);
