# Behaviour Driven Backbone JS

Component extends Backbone.View with behavioral functionality and quick way to bind triggers to component.

<pre>
var NewInstance = SomeComponent.extend({
	behaviours: {
		collapsible: Collapsibe",
		behaviour1: {
			behaviour: Behaviour1,
			property1: value1,
			property2: value2
		}
	},
	triggers: {
		// trigger will be bound on component initialization
		reset: function () {},
		eventName: function () {},
		// etc ...
		}
	}
});
</pre>