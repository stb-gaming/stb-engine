
import * as Renderer from './engine/renderer'
import * as Events from './engine/events';
import * as Time from './engine/time';
import * as Input from './engine/input';

Object.assign(globalThis, Renderer, Events, Time, Input);
