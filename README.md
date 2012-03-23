# Behaviour Driven Backbone JS

Component extends Backbone.View with behavioral functionality and provides quick way to bind triggers on component initialization.

The main goal of behaviours is to add extra functionality to existing component unobtrusively, avoiding multiple extending and calling parent methods.

<pre>
	var CollapsibeSerializableWidget = Backbone.BView.extend({
		behaviours: {
			collapsible: Collapsibe",
			serializabla: {
				behaviour: Serializable,
				elements: ':input'
			}
		}
	});
</pre>

## Backbone.Behaviour

Behaviour have reference to owner object. By default BView supports this events: <b>beforeInit</b>, <b>afterInit</b>, <b>destroy</b>.

<pre>
	var Draggable = Backbone.Behaviour.extend({
		options: {}, // draggable options, can be defined in config
		initialize: function (owner) {
			owner.el.addClass('behavioural component');
		}
		afterInit: function (owner) {
			// owner is Backbone component (BView)
			this.dragEl = this.owner.draggable(this.options);
		},
		// will automatically trigger on
		destroy: function () {
			this.dragEl.draggable('destroy');
			this.owner.el.removeClass('behavioural component');
		}
	});
</pre>

## Triggers

<pre>
	var widget = new Backbone.BView({
		triggers: {
			// trigger will be bound on component initialization
			reset: function () {
				// can use vars from current scope
			},
			destroy: function () {},
				// perform some logic on destroy
			}
		}
	});
</pre>