import {Http, HTTP_BINDINGS} from 'http/http';
import {Backend} from 'backend';
import {HeroDataservice} from 'hero.dataservice';
import {User} from 'user';

export var CORE_BINDINGS = [Backend, HeroDataservice, User, Http, HTTP_BINDINGS];