/*jslint unparam: true, browser: true, nomen: true, safe: false, regexp: true, maxerr: 50, indent: 4 */
/*global $: false, jQuery: false, eFC: false, log: false, _: false, Backbone: true */


(function () {
    'use strict';

    /**
     * @class Backbone.Behavioural extension
     * @description Extend component with this class to add behaviours support ({@link eFC.Behaviour}).
     *  is components that can modify owner with custom functionality:
     * - unobtrusive adding event to owner class
     * - setting triggers
     * - (dirty) directly adding methods and properties to owner
     * - you can do everything with them
     *
     * - `triggers` will be bound to object before initialize method is executed
     * Examples: draggable, collapsible/expandabe, etc.
     * How to use:
     * <pre>
     *  // example for Backbone-like component having static `.extend` method.
     *  _.extend(SomeComponent.prototype, eFC.Behavioural);
     *
     *  var NewInstance = SomeComponent.extend({
     *      behaviours: {
     *          collapsible: {behaviour: "Collapsibe"},
     *          behaviour1: {
     *              behaviour: "Behaviour1",
     *              property1: value1,
     *              property2: value2
     *          },
     *          triggers: {
     *              reset: function () {},
     *              eventName: function () {},
     *              ...
     *          }
     *      }
     *  });
     * </pre>
     * @property {Object} behaviours widget behaviours list (key/config pairs)
     */
    Backbone.Behavioural = {
        /**
         * Initialize behaviours.
         * Behaviours works this way:
         * - add custom functionality to classes using triggers
         *  ('beforeInit', 'afterInit' are built-in, others should be triggered manually)
         * - can add events before events delegation
         * <pre>
         *     ...
         *     behaviour.addEvent('click', 'a.add', 'add');
         *     ...
         * </pre>
         * @param {object} [options] optiona passed to constructor
         */
        initBehaviours: function (options) {
            var self = this;

            this.setBehaviours();

            this.bindTriggers(options);

            _.each(this.behaviours, function (settings, key) {
                self._behaviours[key] = self.initBehaviour(settings);
            });

            _.each(this._behaviourTrackableEvents, function (eventName) {
                self.bind(eventName, function () {
                    self.triggerBehaviours.call(self, eventName);
                }, self);
            });
        },
        /**
         * gets behaviour constructor
         * @property {Object|string} behaviour settings
         * @returns {Object} instance of behaviour
         */
        initBehaviour: function (settings) {
            var Constructor;
            if ($.type(settings) === 'object') {
                Constructor = settings.behaviour;
                //delete settings.behaviour;
            } else {
                // constructor is passed directly, default params will be used
                Constructor = settings;
                settings = {};
            }

            if (_.isString(Constructor)) {
                // TODO customize constructor with namespaces
                if (window[Constructor]) {
                    Constructor = window[Constructor];
                } else {
                    throw new Error('Behaviour constructor not found');
                }
            }

            return new Constructor(this, settings);
        },
        /**
         * set behaviours for current instance, merging with parent behaviours
         */
        setBehaviours: function () {
            var parent = this.constructor.__super__;

            if (!this.behaviours) {
                this.behaviours = {};
            }

            this._behaviours = {};

            // if parent behaviours are added, merge with them
            if (parent && parent.behaviours) {
                this.behaviours = $.extend({}, parent.behaviours, this.behaviours);
            }
        },
        /**
         * get behaviour instance
         * @param {string} alias Key of behaviour
         * @returns {eFC.Behaviour} behaviour object
         */
        getBehaviour: function (alias) {
            return this._behaviours[alias];
        },
        /**
         * Bind triggers to object events
         * @param {object} [options] Options passed to object
         */
        bindTriggers: function (options) {
            if (!(options && options.triggers)) { return; }
            var self = this;
            _.each(options.triggers, function (trigger, event) {
                self.bind(event, trigger, self);
            });
        },
        /**
         * triggers behaviours events if event defined
         * @param eventName
         */
        triggerBehaviours: function (eventName) {
            var self = this, method;
            _.each(this._behaviours, function (behaviour) {
                method = behaviour[eventName];
                if (_.isFunction(method)) {
                    method.call(behaviour, self);
                }
            });
        }
    };

    /**
     * @class Backbone.Behaviour
     * @description Base class for all behaviours. Extend it and add custom functionality to owner class.
     * @param {Object} owner Reference to owner object
     * @param {Object} [options]
     * @constructs
     * @returns {Object} Self
     */
    Backbone.Behaviour = function (owner, options) {
        this.__construct.apply(this, arguments);
        return this;
    };

    Backbone.Behaviour.extend = Backbone.View.extend;
    Backbone.Behaviour.prototype = {
        /**
         * behaviour events to be added to owner
         * @property events
         * @type {function|Object}
         */
        events: null,
        /**
         * @constructor
         * @param {object} owner Reference to behaviour owner object
         * @param {object} [options] Options with current behaviour public parameters
         */
        __construct: function (owner, options) {
            // populate with public parameters
            if (options) {
                _.extend(this, options);
            }
            /**
             * Reference to owner object
             * @property owner
             * @type Object
             */
            this.owner = owner;

            this.initialize.apply(this, arguments);
        },
        /**
         * initializes behaviour functionality
         * @param {Object} owner Behaviour owner object
         */
        initialize: function (owner) {}
    };

    /**
     * @class Backbone.BView
     * @description Backbone.View with behaviours support.
     * @param {Object} [options] view options
     * @returns {Object} Self
     */
    Backbone.BView = function (options) {
        this.construct.apply(this, arguments);
        return this;
    };
    Backbone.BView.extend = Backbone.View.extend;
    _.extend(Backbone.BView.prototype, Backbone.View.prototype, Backbone.Behavioural, {
        /**
         * this events will be tracked automatically
         */
        _behaviourTrackableEvents: ['beforeInit', 'afterInit', 'destroy'],
        /**
         * @constructs
         */
        construct: function (options) {
            this.cid = _.uniqueId('view');
            this._configure(options || {});
            this._ensureElement();

            this.initBehaviours(options);

            this.trigger('beforeInit');

            this.delegateEvents();

            this.initialize.apply(this, arguments);

            this.trigger('afterInit');
        }
    });

}());