
const DependencyBoss = require('./Dep/DependencyBoss.js');

let dependencyBoss  = new DependencyBoss();
let server          = dependencyBoss.getMainObj();

server.start();
