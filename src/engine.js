
import * as Renderer from './engine/renderer'
import * as Events from './engine/events';
import * as Time from './engine/time';
import * as Input from './engine/input';
import * as Scenes from './engine/scenes';

Object.assign(globalThis, Renderer, Events, Time, Input, Scenes);
