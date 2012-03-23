# Behaviour Driven Backbone JS

Component extends Backbone.View with behavioral functionality and provides quick way to bind triggers on component initialization.

The main goal of behaviours is to add extra functionality to existing component unobtrusively, avoiding multiple extending and calling parent methods.

<pre>
	var CollapsibeSerializableWidget = Backbone.BView.extend({
		behaviours: {
			collapsible: Collapsibe,
			serializable: {
				behaviour: Backbone.Behaviours.Serializable,
				elements: ':input'
			}
		}
	});
</pre>

## Backbone.Behaviour

Behaviour have reference to owner object. By default BView supports this events: <b>beforeInit</b>, <b>afterInit</b>, <b>destroy</b>.

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
widget.bind('destroy', function () { // on reset })
</pre>