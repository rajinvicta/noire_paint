const SmartDepend      =    require('../Dep/SmartDepend.js');

//Control
  //Control
  const  Config         =    require('../Control/Config.js');
  const  Kernel         =    require('../Control/Kernel.js');
  const  MessageCenter  =    require('../Control/MessageCenter.js');

//Data
  //Data
  const  Block          =    require('../Data/Block.js');
  const  PersonList     =    require('../Data/PersonList.js');
  const  Session        =    require('../Data/Session.js');

//Dep
  //Dep
  const  Externs        =    require('../Dep/Externs.js');

//Engine
  //Engine
  const  Camera         =    require('../Engine/Camera.js');
  const  Entity         =    require('../Engine/Entity.js');
  const  Joystick       =    require('../Engine/Joystick.js');
  const  Scene          =    require('../Engine/Scene.js');
  const  World          =    require('../Engine/World.js');

//Entity
  //Entity
  const  Person         =    require('../Entity/Person.js');
  const  Player         =    require('../Entity/Player.js');
  const  Loading        =    require('../Entity/Loading.js');
  const  Wall           =    require('../Entity/Wall.js');

//Logic
  //Logic
  const  BlockWorld     =    require('../Logic/BlockWorld.js');
  const  Color          =    require('../Logic/Color.js');
  const  GPS            =    require('../Logic/GPS.js');
  const  Movement       =    require('../Logic/Movement.js');
  const  SessionManager =    require('../Logic/SessionManager.js');

//Network
  //Network
  const  Auth           =    require('../Network/Auth.js');
  const  Connection     =    require('../Network/Connection.js');
  const  Server         =    require('../Network/Server.js');
  const  Socket         =    require('../Network/Socket.js');

//Scene
  //Scene
  const  LoadScene      =    require('../Scene/LoadScene.js');
  const  MainScene      =    require('../Scene/MainScene.js');

//Util
  //Util
  const  AccuTime       =    require('../Util/AccuTime.js');
  const  DelayLoop      =    require('../Util/DelayLoop.js');


class DependencyBoss {
  constructor() {
    this._allocateResources();

    this._setupTypes();
    this._decorate();
    this._injectDependencies();
    this._declareBindings();

    this._generateObjects();
  }

  getMainObj() {
    return this._mainObj;
  }

  _allocateResources() {
    this._depManager = new SmartDepend();
    this._container = this._getDepContainer();
  }

  _setupTypes() {
    this._types = {
      //Control
        //Control
        Config        : {name: "Config",          class: Config,        single: false},
        Kernel        : {name: "Kernel",          class: Kernel,        single: false},
        MessageCenter : {name: "MessageCenter",   class: MessageCenter, single: true},

      //Data
        //Data
        Block         : {name: "Block",           class: Block,         single: false},
        PersonList    : {name: "PersonList",      class: PersonList,    single: false},
        Session       : {name: "Session",         class: Session,       single: false},

      //Dep
        //Dep
        Externs       : {name: "Externs",         class: Externs,       single: true},

      //Engine
        //Engine
        Camera        : {name: "Camera",          class: Camera,        single: false},
        Entity        : {name: "Entity",          class: Entity,        single: false},
        Joystick      : {name: "Joystick",        class: Joystick,      single: false},
        Scene         : {name: "Scene",           class: Scene,         single: false},
        World         : {name: "World",           class: World,         single: true},

      //Entity
        //Entity
        Loading       : {name: "Loading",         class: Loading,       single: false},
        Person        : {name: "Person",          class: Person,        single: false},
        Player        : {name: "Player",          class: Player,        single: false},
        Wall          : {name: "Wall",            class: Wall,          single: false},

      //Logic
        //Logic
        BlockWorld    : {name: "BlockWorld",      class: BlockWorld,    single: false},
        Color         : {name: "Color",           class: Color,         single: false},
        GPS           : {name: "GPS",             class: GPS,           single: false},
        Movement      : {name: "Movement",        class: Movement,      single: false},
        SessionManager: {name: "SessionManager",  class: SessionManager,single: false},

      //Network
        //Network
        Auth          : {name: "Auth",            class: Auth,          single: false},
        Connection    : {name: "Connection",      class: Connection,    single: false},
        Server        : {name: "Server",          class: Server,        single: false},
        Socket        : {name: "Socket",          class: Socket,        single: false},

      //Scene
        //Scene
        LoadScene     : {name: "LoadScene",       class: LoadScene,     single: false},
        MainScene     : {name: "MainScene",       class: MainScene,     single: false},

      //Util
        //Util
        AccuTime      : {name: "AccuTime",        class: AccuTime,      single: false},
        DelayLoop     : {name: "DelayLoop",       class: DelayLoop,     single: false}
    }

    this._addObjects();
  }

  _addObjects() {
    for (let type in this._types) {
      if(this._types[type].single) {
        //console.log("NAME OF SINGLE: %s", this._types[type].name);
      }
      this._addType(this._types[type].name,  this._types[type].class, this._types[type].single);
    }
  }

  _injectDependencies() {
    //Control
      //Control
      this._addDependency(this._types.Kernel.name,            this._types.World.name);
      this._addDependency(this._types.Kernel.name,            this._types.MessageCenter.name);
      this._addDependency(this._types.Kernel.name,            this._types.MainScene.name);
      this._addDependency(this._types.Kernel.name,            this._types.LoadScene.name);

    //Data
      //Data
      this._addDependency(this._types.Session.name,          this._types.Config.name);
      this._addDependency(this._types.Session.name,          this._types.MessageCenter.name);

    //Engine
      //Engine
      this._addDependency(this._types.Entity.name,           this._types.Config.name);

      this._addDependency(this._types.Joystick.name,         this._types.Externs.name);

      this._addDependency(this._types.Scene.name,            this._types.Externs.name);
      this._addDependency(this._types.World.name,            this._types.Externs.name);

    //Entity
      //Entity
      this._addDependency(this._types.Loading.name,           this._types.Entity.name);

      this._addDependency(this._types.Person.name,           this._types.Entity.name);
      this._addDependency(this._types.Person.name,           this._types.Movement.name);
      this._addDependency(this._types.Person.name,           this._types.AccuTime.name);

      this._addDependency(this._types.Player.name,           this._types.Person.name);
      this._addDependency(this._types.Player.name,           this._types.Joystick.name);

      this._addDependency(this._types.Wall.name,             this._types.Entity.name);

    //Logic
      //Logic
      this._addDependency(this._types.BlockWorld.name,       this._types.Config.name);
      this._addDependency(this._types.BlockWorld.name,       this._types.Block.name);
      this._addDependency(this._types.BlockWorld.name,       this._types.GPS.name);
      this._addDependency(this._types.BlockWorld.name,       this._types.MessageCenter.name);

      this._addDependency(this._types.Color.name,            this._types.Config.name);
      this._addDependency(this._types.Color.name,            this._types.Entity.name);
      this._addDependency(this._types.Color.name,            this._types.MessageCenter.name);

      this._addDependency(this._types.Movement.name,         this._types.Config.name);
      this._addDependency(this._types.Movement.name,         this._types.AccuTime.name);
      this._addDependency(this._types.Movement.name,         this._types.GPS.name);

      this._addDependency(this._types.SessionManager.name,   this._types.Config.name);
      this._addDependency(this._types.SessionManager.name,   this._types.Session.name);
      this._addDependency(this._types.SessionManager.name,   this._types.BlockWorld.name);

    //Network
      //Network
      this._addDependency(this._types.Connection.name,       this._types.Config.name);

      this._addDependency(this._types.Server.name,           this._types.Socket.name);
      this._addDependency(this._types.Server.name,           this._types.Config.name);
      this._addDependency(this._types.Server.name,           this._types.Auth.name);
      this._addDependency(this._types.Server.name,           this._types.GPS.name);
      this._addDependency(this._types.Server.name,           this._types.DelayLoop.name);
      this._addDependency(this._types.Server.name,           this._types.DelayLoop.name);
      this._addDependency(this._types.Server.name,           this._types.Person.name);
      this._addDependency(this._types.Server.name,           this._types.SessionManager.name);
      this._addDependency(this._types.Server.name,           this._types.MessageCenter.name);

      this._addDependency(this._types.Socket.name,           this._types.Externs.name);

    //Scene
      //Scene
      this._addDependency(this._types.LoadScene.name,        this._types.Scene.name);
      this._addDependency(this._types.LoadScene.name,        this._types.MessageCenter.name);
      this._addDependency(this._types.LoadScene.name,        this._types.Externs.name);
      this._addDependency(this._types.LoadScene.name,        this._types.Loading.name);

      this._addDependency(this._types.MainScene.name,        this._types.Scene.name);
      this._addDependency(this._types.MainScene.name,        this._types.Connection.name);
      this._addDependency(this._types.MainScene.name,        this._types.Camera.name);
      this._addDependency(this._types.MainScene.name,        this._types.DelayLoop.name);
      this._addDependency(this._types.MainScene.name,        this._types.SessionManager.name);
      this._addDependency(this._types.MainScene.name,        this._types.MessageCenter.name);
      this._addDependency(this._types.MainScene.name,        this._types.Color.name);
      this._addDependency(this._types.MainScene.name,        this._types.Player.name);
      this._addDependency(this._types.MainScene.name,        this._types.Person.name);
      this._addDependency(this._types.MainScene.name,        this._types.Wall.name);
  }

  _generateObjects() {
    if (typeof window == 'undefined') {
      this._mainObj = this._container.get(this._types.Server.name);
    } else {
      this._mainObj  = this._container.get(this._types.Kernel.name);
    }
  }

  //Foreign dependencies
  _addDependency(type, dependency) {
    this._depManager.addDependency(type, dependency);
  }

  _addType(typeName, typeClass, typeSingle) {
    this._depManager.addObject(typeName, typeClass, typeSingle);
  }

  _decorate() {
    this._depManager.decorate();
  }

  _declareBindings() {
    this._depManager.bindAll();
  }

  _getDepContainer() {
    return this._depManager.container;
  }
}


module.exports = DependencyBoss;
