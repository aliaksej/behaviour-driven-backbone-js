# Behaviour Driven Backbone JS

Component extends Backbone.View with behavioral functionality and provides quick way to bind triggers on component initialization.

The main goal of behaviours is to add extra functionality to existing component unobtrusively, avoiding multiple extending and calling parent methods.

<pre>
var CollapsibeSerializableWidget = Backbone.BView.extend({
	behaviours: {
		collapsible: app.behaviours.Collapsible,
		serializable: {
			behaviour: App.behaviours.Serializable,
			elements: ':input'
		}
	}
});
</pre>

## Backbone.Behaviour

Behaviour is extensible component that contains methods. Behaviour have reference to owner object. Methods' names should be equal to owner's events, specified in owner's `behaviour trackable events`.

<pre>
var Draggable = Backbone.Behaviour.extend({
	options: {}, // draggable options, can be defined in owner's `behaviours` property
	initialize: function (owner) {
		owner.el.addClass('behaviour_driven');
		// you can perform additional logic with owner here
	},
	// will be performed after initialization of owner
	afterInit: function (owner) {
		this.dragEl = this.owner.draggable(this.options);
	},
	// will automatically trigger on owner destruction
	destroy: function () {
		this.dragEl.draggable('destroy');
		this.owner.el.removeClass('behaviour_driven');
	}
});
</pre>

## Backbone.BView

Backbone.BView is behaviour driven Backbone.View.
By default BView supports this events for behaviours: <b>beforeInit</b>, <b>afterInit</b>, <b>destroy</b>.

<pre>
// Attach behaviours to component
var Widget = Backbone.BView.extend({
	behaviours: {
		draggable: {
			behaviour: Draggable,
			// set public properties
			options: {
				dragSrc: '.title'
				// etc.
			}
		}
	}
});
// now graggable functionality can be reused for many plugins :) You only override default options.
</pre>

## Triggers

Triggers are easy way to bind triggers on component instantiation. Key of trigger should equal event name.

<pre>
var widget = new Backbone.BView({
	triggers: {
		// trigger will be bound on component reset
		reset: function () {
			// can use vars from current scope
		},
		// will be triggered on destroy
		destroy: function () {},
			// perform some logic on destroy
		}
	}
});

// the same as
widget.bind('reset', function () { // on reset })
widget.bind('destroy', function () { // on destroy })
</pre>