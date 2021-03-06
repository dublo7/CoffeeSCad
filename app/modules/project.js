// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, Library, LocalStorage, Project, ProjectFile, ProjectFiles, debug, _;
    $ = require('jquery');
    _ = require('underscore');
    Backbone = require('backbone');
    LocalStorage = require('localstorage');
    debug = false;
    ProjectFile = (function(_super) {

      __extends(ProjectFile, _super);

      ProjectFile.prototype.idAttribute = 'name';

      ProjectFile.prototype.defaults = {
        name: "mainPart",
        ext: "coscad",
        content: ""
      };

      function ProjectFile(options) {
        this.onSynched = __bind(this.onSynched, this);

        this.onChanged = __bind(this.onChanged, this);
        ProjectFile.__super__.constructor.call(this, options);
        this.rendered = false;
        this.dirty = false;
        this.storedContent = this.get("content");
        this.bind("change", this.onChanged);
        this.bind("sync", this.onSynched);
      }

      ProjectFile.prototype.onChanged = function() {
        if (this.storedContent === this.get("content")) {
          this.dirty = false;
        } else {
          this.dirty = true;
        }
        if (this.dirty) {
          return this.trigger("dirtied");
        } else {
          return this.trigger("cleaned");
        }
      };

      ProjectFile.prototype.onSynched = function() {
        console.log("synching");
        this.storedContent = this.get("content");
        this.dirty = false;
        return this.trigger("saved");
      };

      return ProjectFile;

    })(Backbone.Model);
    ProjectFiles = (function(_super) {

      __extends(ProjectFiles, _super);

      function ProjectFiles() {
        return ProjectFiles.__super__.constructor.apply(this, arguments);
      }

      ProjectFiles.prototype.model = ProjectFile;

      /*
          parse: (response)=>
            console.log("in projFiles parse")
            for i, v of response
              response[i] = new ProjectFile(v)
              response[i].collection = @
              
            console.log response      
            return response
      */


      return ProjectFiles;

    })(Backbone.Collection);
    Project = (function(_super) {

      __extends(Project, _super);

      Project.prototype.idAttribute = 'name';

      Project.prototype.defaults = {
        name: "TestProject"
      };

      function Project(options) {
        this.fetch_file = __bind(this.fetch_file, this);

        this.remove = __bind(this.remove, this);

        this.add = __bind(this.add, this);

        this.onPartChanged = __bind(this.onPartChanged, this);

        this.onPartSaved = __bind(this.onPartSaved, this);

        var locStorName;
        Project.__super__.constructor.call(this, options);
        this.dirty = false;
        this["new"] = true;
        this.bind("reset", this.onReset);
        this.bind("sync", this.onSync);
        this.bind("change", this.onChanged);
        this.files = [];
        this.pfiles = new ProjectFiles();
        locStorName = this.get("name") + "-parts";
        this.pfiles.localStorage = new Backbone.LocalStorage(locStorName);
      }

      Project.prototype.onReset = function() {
        if (debug) {
          console.log("Project model reset");
          console.log(this);
          return console.log("_____________");
        }
      };

      Project.prototype.onSync = function() {
        this["new"] = false;
        if (debug) {
          console.log("Project sync");
          console.log(this);
          return console.log("_____________");
        }
      };

      Project.prototype.onChanged = function(settings, value) {
        var key, locStorName, val, _ref, _results;
        this.dirty = true;
        _ref = this.changedAttributes();
        _results = [];
        for (key in _ref) {
          val = _ref[key];
          switch (key) {
            case "name":
              locStorName = val + "-parts";
              _results.push(this.pfiles.localStorage = new Backbone.LocalStorage(locStorName));
              break;
            default:
              _results.push(void 0);
          }
        }
        return _results;
      };

      Project.prototype.onPartSaved = function(partName) {
        var part;
        for (part in this.pfiles) {
          if (part.dirty) {
            return;
          }
        }
        return this.trigger("allSaved");
      };

      Project.prototype.onPartChanged = function() {};

      Project.prototype.isNew2 = function() {
        return this["new"];
      };

      Project.prototype.add = function(pFile) {
        var _this = this;
        this.pfiles.add(pFile);
        this.files.push(pFile.get("name"));
        pFile.bind("change", function() {
          return _this.trigger("change");
        });
        pFile.bind("saved", function() {
          return _this.onPartSaved(pFile.get("id"));
        });
        pFile.bind("dirtied", function() {
          return _this.trigger("dirtied");
        });
        return pFile.bind("cleaned", function() {
          return _this.onPartSaved(pFile.get("id"));
        });
      };

      Project.prototype.remove = function(pFile) {
        var index;
        index = this.files.indexOf(pFile.get("name"));
        this.files.splice(index, 1);
        return this.pfiles.remove(pFile);
      };

      Project.prototype.fetch_file = function(options) {
        var id, pFile;
        id = options.id;
        console.log("id specified: " + id);
        if (this.pfiles.get(id)) {
          pFile = this.pfiles.get(id);
        } else {
          pFile = new ProjectFile({
            name: id
          });
          pFile.collection = this.pfiles;
          pFile.fetch();
        }
        return pFile;
      };

      Project.prototype["export"] = function(format) {};

      /*
          parse: (response)=>
            console.log("in proj parse")
            console.log response
            
            return response
      */


      return Project;

    })(Backbone.Model);
    Library = (function(_super) {

      __extends(Library, _super);

      Library.prototype.model = Project;

      Library.prototype.localStorage = new Backbone.LocalStorage("Library");

      Library.prototype.defaults = {
        recentProjects: []
      };

      function Library(options) {
        this.parse = __bind(this.parse, this);

        this.fetch = __bind(this.fetch, this);

        this.save = __bind(this.save, this);

        this.bli = __bind(this.bli, this);
        Library.__super__.constructor.call(this, options);
        this.bind("reset", this.onReset);
        this.namesFetch = false;
      }

      Library.prototype.bli = function() {
        return console.log("calling bli");
      };

      Library.prototype.save = function() {
        return this.each(function(model) {
          return model.save();
        });
      };

      Library.prototype.fetch = function(options) {
        var id, proj, res;
        if (options != null) {
          if (options.id != null) {
            id = options.id;
            console.log("id specified");
            proj = null;
            if (this.get(id)) {
              proj = this.get(id);
              proj["new"] = false;
              proj.pfiles.fetch();
            }
            return proj;
          } else {
            res = Library.__super__.fetch.apply(this, options);
            return res;
          }
        } else {
          res = Library.__super__.fetch.call(this, options);
          return res;
        }
      };

      Library.prototype.parse = function(response) {
        var i, v;
        for (i in response) {
          v = response[i];
          response[i].pfiles = new ProjectFiles(response[i].pfiles);
        }
        return response;
      };

      Library.prototype.getLatest = function() {
        return this.namesFetch = true;
      };

      Library.prototype.onReset = function() {
        if (debug) {
          console.log("Library reset");
          console.log(this);
          return console.log("_____________");
        }
      };

      return Library;

    })(Backbone.Collection);
    return {
      ProjectFile: ProjectFile,
      Project: Project,
      Library: Library
    };
  });

}).call(this);
